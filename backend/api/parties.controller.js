import PartiesDAO from "../dao/partiesDAO.js";
import jwt from "jsonwebtoken";

export default class PartiesController {
    static async apiPostParty(req, res, next) {
        try {
            const title = req.body.title;
            const series = req.body.series;
            const user = req.body.user;
            const party = req.body.party; // contains up to 6 pokemon
            const comment = req.body.comment;
            const userId = res.locals.user.userId;

            const partyResponse = await PartiesDAO.addParty(
                title,
                series,
                user,
                party,
                comment,
                userId
            );
            console.log("Successfully create new party");
            res.json({ success: true, message: "Successfully create new party"});
        } catch (e) {
            res.status(500).json({ success: false, message: "Failed to create new party" });
        }
    }

    static async apiGetParty(req, res, next) {
        try {
            const userId = res.locals.user.userId;
            const access = res.locals.user.access;
            let partyId = req.params.partyId || {};
            let party = await PartiesDAO.getParty(partyId);
            if (!party) {
                res.status(404).json({ success: false, message: "Party not found" });
                return;
            }
            res.json({ success: true, userId: userId, access: access, party: party });
        } catch (e) {
            res.status(500).json({ success: false, message: "Failed to retrieve party" });
        }
    }

    static async apiUpdateParty(req, res, next) {
        try {
            const partyId = req.params.partyId;
            const title = req.body.title;
            const series = req.body.series;
            const user = req.body.user;
            const party = req.body.party; // contains up to 6 pokemon
            const comment = req.body.comment;
            const userId = req.body.userId;
            
            const partyResponse = await PartiesDAO.updateParty(
                partyId,
                title,
                series,
                user,
                party,
                comment,
                userId
            );
            console.log("Successfully updated party")
            res.json({ success: true, message: "Successfully updated party" });
        } catch (e) {
            res.status(500).json({ success: false, message: "Failed to update party" });
        }
    }
    
    static async apiDeleteParty(req, res, next) {
        try {
            const partyId = req.params.partyId;
            const partyResponse = await PartiesDAO.deleteParty(partyId);
            console.log("Successfully deleted party");
            res.json({ success: true, message: "Successfully deleted party" });
        } catch (e) {
            res.status(500).json({ success: false, message: "Failed to delete party" });
        }
    }

    static async apiGetAllParties(req, res, next) {
        try {
            const username = res.locals.user.username;
            const userId = res.locals.user.userId;
            const access = res.locals.user.access;
            let parties = await PartiesDAO.getAllParties();
            if (!parties) {
                res.status(404).json({ success: false, message: "not found"});
                return;
            }
            res.json({ success: true,  username: username, userId: userId, access: access, parties: parties});
        } catch (e) {
            console.error(e);
            res.status(500).json({ success: false, message: "Failed to retrieve all party" });
        }
    }

    static async apiGetAccountInfo(req, res, next) {
        try {
            const userId = res.locals.user.userId;
            const userInfo = await PartiesDAO.getAccountInfo(userId);
            if (!userInfo) {
                res.status(400).json({ success: false, message: "could not find account" });
            }
            res.json({ success: true, username: userInfo.username, userId: userInfo.userId, access: userInfo.access, numParty: userInfo.numParty, parties: userInfo.parties });
        } catch (e) {
            console.error(e);
            res.status(500).json({ success: false, message: "Failed to retrieve account info" });
        }
    }

    static async apiDeleteAccount(req, res, next) {
        try {
            const userId = res.locals.user.userId;
            const deleteRes = await PartiesDAO.deleteAccount(userId);
            if (!deleteRes) {
                res.status(400).json({ success: false, message: "Could not find account to delete" });
            }
            console.log("Successfully deleted account.");
            res.json({ success: true, message: "Successfully deleted account."});
        } catch (e) {
            res.status(500).json({ success: false, message: "Failed to delete account."});
        }
    }

    static async apiCreateAccount(req, res, next) {
        try {
            const username = req.body.username;
            const password = req.body.password;
            const createAccountResponse = await PartiesDAO.createAccount(username, password);
            if (createAccountResponse) {
                res.json({ success: true, message: "Successfully create new account" });
            } else {
                res.status(400).json({ success: false, message: "Username already exists" });
            }
        } catch (e) {
            res.status(500).json({ success: false, message: "Failed to create account" });
        }
    }

    static async apiLogin(req, res, next) {
        try {
            const username = req.body.username;
            const password = req.body.password;
            const tokens = await PartiesDAO.login(username, password);
            if (tokens) {
                const { accessToken, refreshToken, access } = tokens;
                if (access === "user" || access === "guest") {
                    res.cookie('access_token', accessToken, { 
                        httpOnly: true,
                        maxAge: 14*60*1000,
                        domain: ".heppoko.space",
                        sameSite: "none",
                        secure: true
                    });
                    res.cookie('refresh_token', refreshToken, { 
                        httpOnly: true,
                        maxAge: 7*24*60*60*1000,
                        domain: ".heppoko.space",
                        sameSite: "none",
                        secure: true
                    });
                } 
                else if (access === "admin") {
                    res.cookie('access_token', accessToken, { 
                        httpOnly: true,
                        domain: ".heppoko.space",
                        sameSite: "none",
                        secure: true
                    });
                }
                res.json({ success: true, message: "Successfully logged in" });
            } else {
                res.status(400).json({ success: false, message: "Incorrect username or password" });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({ success: false, message: "Failed to login" });
        }
    }

    static async apiRefresh(req, res, next) {
        const refreshToken = req.cookies.refresh_token;
        if (refreshToken == null) {
            res.status(401).json({success: false, message: "Couldn't refresh token"})
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ success: false, message: "Invalid refresh token" });
            }
            const accessToken = jwt.sign({ _id: user._id, username: user.username, access: user.access }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            res.cookie('access_token', accessToken, { 
                httpOnly: true,
                maxAge: 14*60*1000,
                domain: ".heppoko.space",
                sameSite: "none",
                secure: true
            });
            res.json({ success: true, message: "Session extended" });
        });
    }

    static async apiLogout(req, res, next) {
        res.clearCookie("access_token", { 
            httpOnly: true,
            domain: ".heppoko.space",
            sameSite: "none",
            secure: true 
        });
        res.clearCookie("refresh_token", { 
            httpOnly: true,
            domain: ".heppoko.space",
            sameSite: "none",
            secure: true 
        });
        res.json({ success: true, message: "Successfully logged out"})
    }

    static async authenticateToken(req, res, next) {
        try {
            const accessToken = req.cookies.access_token;
            const refreshToken = req.cookies.refresh_token;
            if (accessToken == null) {
                if (refreshToken == null) {
                    console.error("accessToken and refreshToken not found");
                    return res.status(401).json({ success: false, refresh: false, message: "Access denied" });
                } else {
                    console.error("need to refresh token");
                    return res.json({ success: false, refresh: true, message: "refresh token"});
                }
            }
            jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) {
                    return res.status(403).json({ success: false, message: "Correct authentication required" });
                }
                res.locals.user = { userId: user._id, username: user.username, access: user.access };
                next();
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({ success: false, message: "Failed to authenticate user" });
        }
    }
}
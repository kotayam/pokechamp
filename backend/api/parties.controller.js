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
            const userId = req.body.userId;

            const partyResponse = await PartiesDAO.addParty(
                title,
                series,
                user,
                party,
                comment,
                userId
            );
            res.json({ success: true, message: "Successfully create new party"});
        } catch (e) {
            res.status(500).json({ success: false, message: "Failed to create new party" });
        }
    }

    static async apiGetParty(req, res, next) {
        try {
            const userId = res.locals.user.userId;
            let partyId = req.params.partyId || {};
            let party = await PartiesDAO.getParty(partyId);
            if (!party) {
                res.status(404).json({ success: false, message: "Party not found" });
                return;
            }
            party.success = true;
            res.json({userId: userId, party: party });
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
            // if nothing was modified,
            if (partyResponse.modifiedCount === 0) {
                throw new Error ("nothing changed")
            }

            res.json({ success: true, message: "Successfully update party" });
        } catch (e) {
            res.status(500).json({ success: false, message: "Failed to update party" });
        }
    }
    
    static async apiDeleteParty(req, res, next) {
        try {
            const partyId = req.params.partyId;
            const userId = req.body.userId;
            const partyResponse = await PartiesDAO.deleteParty(partyId, userId);
            res.json({ success: true, message: "Successfully deleted party" });
        } catch (e) {
            res.status(500).json({ success: false, message: "Failed to delete party" });
        }
    }

    static async apiGetAllParties(req, res, next) {
        try {
            const username = res.locals.user.username;
            const userId = res.locals.user.userId;
            let parties = await PartiesDAO.getAllParties();
            if (!parties) {
                res.status(404).json({ success: false, message: "not found"});
                return;
            }
            res.json({ success: true,  username: username, userId: userId, parties: parties});
        } catch (e) {
            console.log(e);
            res.status(500).json({ success: false, message: "Failed to retrieve all party" });
        }
    }

    static async apiGetUserInfo(req, res, next) {
        try {
            const userId = req.params.userId;
            const userInfo = await PartiesDAO.getUserInfo(userId);
            if (!userInfo) {
                res.status(400).json({ error: "could not find user"});
            }
            res.json({userInfo});
        } catch (e) {
            res.status(500).json({ error: e.message });
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
            const accessToken = await PartiesDAO.login(username, password);
            if (accessToken) {
                res.cookie('access_token', accessToken, { 
                    httpOnly: true,
                    maxAge: 14*60*1000,
                    domain: "localhost",
                    sameSite: "none",
                    secure: true
                });
                res.json({ success: true, message: "Successfully logged in" });
            } else {
                res.status(400).json({ success: false, message: "Incorrect username or password" });
            }
        } catch (e) {
            res.status(500).json({ success: false, message: "Failed to login" });
        }
    }

    static async apiLogout(req, res, next) {
        res.clearCookie("access_token");
        res.status(200),json({ success: true, message: "Successfully logged out"})
    }

    static async authenticateToken(req, res, next) {
        try {
            const accessToken = req.cookies.access_token;
            if (accessToken == null) {
                console.error("accessToken not found");
                return res.status(401).json({ success: false, message: "Access denied" });
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
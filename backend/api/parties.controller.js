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
            const userId = req.params.userId;

            const partyResponse = await PartiesDAO.addParty(
                title,
                series,
                user,
                party,
                comment,
                userId
            );
            res.json({ status: "success"});
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetParty(req, res, next) {
        try {
            let partyId = req.params.partyId || {};
            let party = await PartiesDAO.getParty(partyId);
            if (!party) {
                res.status(404).json({ error: "Not found"});
                return;
            }
            res.json(party);
        } catch (e) {
            res.status(500).json({ error: e.message });
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
            const userId = req.params.userId;
            
            const partyResponse = await PartiesDAO.updateParty(
                partyId,
                title,
                series,
                user,
                party,
                comment,
                userId
            );

            var { error } = partyResponse;
            if (error) {
                res.status(400).json({ error });
            }

            // if nothing was modified,
            if (partyResponse.modifiedCount === 0) {
                throw new Error (
                    "unable to update review",
                )
            }

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    
    static async apiDeleteParty(req, res, next) {
        try {
            const partyId = req.params.partyId;
            const userId = req.params.userId;
            const partyResponse = await PartiesDAO.deleteParty(partyId, userId);
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetAllParties(req, res, next) {
        try {
            let parties = await PartiesDAO.getAllParties();
            if (!parties) {
                res.status(404).json({ error: "Not found"});
                return;
            }
            res.json(parties);
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }

    static async apiGetUserInfo(req, res, next) {
        try {
            const userId = req.params.userId;
            const userInfo = await PartiesDAO.getUserInfo(userId);
            if (!userInfo) {
                res.status(400).json({ error: "could not find user"});
            }
            res.json(userInfo);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiLogin(req, res, next) {
        try {
            const username = req.body.username;
            const password = req.body.password;
            const loginRes = await PartiesDAO.login(username, password);
            if (loginRes) {
                res.json({ status: "success", accessToken: loginRes[0], userId: loginRes[1] });
            } else {
                res.status(400).json({ error: "incorrect username or password" });
            }
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
                res.json({ status: "success" });
            } else {
                res.status(400).json({ error: "username already exists" });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async authenticateToken(req, res, next) {
        // const userId = req.params.userId;
        // if (!userId) {
        //     next();
        // }
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
            return res.status(401).json({ error: "access denied"});
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ error: "do not have auth"});
            }
            req.user = user;
            next();
        });
    }
}
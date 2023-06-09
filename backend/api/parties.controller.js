import PartiesDAO from "../dao/partiesDAO.js";

export default class PartiesController {
    static async apiPostParty(req, res, next) {
        try {
            const title = req.body.title;
            const series = req.body.series;
            const user = req.body.user;
            const party = req.body.party; // contains up to 6 pokemon
            const comment = req.body.comment;

            const partyResponse = await PartiesDAO.addParty(
                title,
                series,
                user,
                party,
                comment
            );
            res.json({ status: "success"});
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetParty(req, res, next) {
        try {
            let partyId = req.params.id || {};
            console.log(partyId);
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
            const partyId = req.body.id;
            const title = req.body.title;
            const series = req.body.series;
            const user = req.body.user;
            const party = req.body.party; // contains up to 6 pokemon
            const comment = req.body.comment;
            
            const partyResponse = await PartiesDAO.updateParty(
                partyId,
                title,
                series,
                user,
                party,
                comment
            );

            console.log(partyResponse);

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
            const partyId = req.params.id;
            const partyResponse = await PartiesDAO.deleteParty(partyId);
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
            res.json(reviews);
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }
}
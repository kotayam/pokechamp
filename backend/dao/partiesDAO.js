import { ObjectId } from "mongodb";
// const ObjectId = mongodb.ObjectID;

let parties;

export default class PartiesDAO {
    static async injectDB(conn) {
        if(parties) {
            return;
        }
        try {
            parties = await conn.db("parties").collection("parties");
        } catch (e) {
            console.error(`Unable to establish collection hadnles in userDAO: ${e}`);
        }
    }

    static async addParty(title, series, user, party, comment) {
        try {
            const partyDoc = {
                title: title,
                series: series,
                user: user,
                party: party,
                comment: comment
            };
            return await parties.insertOne(partyDoc); 
        } catch (e) {
            console.error(`Unable to post party: ${e}`);
            return { error: e };
        }
    }

    static async getParty(partyId) {
        try {
            return await parties.findOne({ _id: new ObjectId(partyId) });
        } catch (e) {
            console.error(`Unable to get party: ${e}`);
            return { error: e };
        }
    }

    static async updateParty(partyId, title, series, user, party, comment) {
        try {
            const updateResponse = await parties.updateOne(
                { _id: new ObjectId(partyId) },
                { $set: {
                    title: title,
                    series: series,
                    user: user,
                    party: party,
                    comment: comment}
                }
            );

            return updateResponse;
        } catch (e) {
            console.error(`Unable to put party: ${e}`);
            return { error: e };
        }
    }

    static async deleteParty(partyId) {
        try {
            const deleteResponse = await parties.deleteOne({ _id: new ObjectId(partyId) });
            return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete party: ${e}`);
            return { error: e };
        }
    }

    static async getAllParties() {
        try {
            const allParties = await parties.find();
            return allParties.toArray();
        } catch (e) {
            console.error(`Unable to get all parties: ${e}`);
            return { error: e };
        }
    }
}
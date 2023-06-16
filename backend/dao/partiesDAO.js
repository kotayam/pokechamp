import {ObjectId} from "mongodb";
import { Party, Account } from "../odm/model.js";
import bcrypt from "bcrypt";

export default class PartiesDAO {

    static async addParty(title, series, user, party, comment) {
        try {
            const partyDoc = {
                title: title,
                series: series,
                user: user,
                party: party,
                comment: comment
            };
            return await Party.create(partyDoc); 
        } catch (e) {
            console.error(`Unable to post party: ${e}`);
            return { error: e };
        }
    }

    static async getParty(partyId) {
        try {
            return await Party.findOne({ _id: new ObjectId(partyId) });
        } catch (e) {
            console.error(`Unable to get party: ${e}`);
            return { error: e };
        }
    }

    static async updateParty(partyId, title, series, user, party, comment) {
        try {
            const updateResponse = await Party.updateOne(
                { _id: new ObjectId(partyId) },
                { $set: {
                    title: title,
                    series: series,
                    user: user,
                    party: party,
                    comment: comment }
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
            const deleteResponse = await Party.deleteOne({ _id: new ObjectId(partyId) });
            return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete party: ${e}`);
            return { error: e };
        }
    }

    static async getAllParties() {
        try {
            const cursor = Party.find().cursor();
            return cursor.toArray();
        } catch (e) {
            console.error(`Unable to get all parties: ${e}`);
            return { error: e };
        }
    }

    static async login(username, password) {
        const doc = await Account.findOne({ username: username });
        // if account does not exist
        if(!doc) {
            return;
        }
        try {
            const validPass = bcrypt.compare(password, doc.password)
            if (validPass) {
                return "sucess";
            } else {
                console.log("wrong password");
                return;
            }
        } catch (e) {
            console.error(`Unable to login: ${e}`);
            return;
        }
        
    }

    static async createAccount(username, password) {
        try {
            const doc = await Account.findOne({ username: username });
            // if account already exists
            if (doc) {
                return;
            }
            const hashedPass = await bcrypt.hash(password, 10);
            const account = {
                username: username,
                password: hashedPass,
                access: "user"
            };
            return await Account.create(account); 
        } catch (e) {
            console.error(`Unable to login: ${e}`);
            return;
        }
    }
}
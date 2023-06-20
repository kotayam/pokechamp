import {ObjectId} from "mongodb";
import { Party, Account } from "../odm/model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default class PartiesDAO {

    static async addParty(title, series, user, party, comment, userId) {
        try {
            const partyDoc = {
                title: title,
                series: series,
                user: user,
                party: party,
                comment: comment,
                userId: userId
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

    static async updateParty(partyId, title, series, user, party, comment, userId) {
        try {
            const updateResponse = await Party.updateOne(
                { _id: new ObjectId(partyId) },
                { $set: {
                    title: title,
                    series: series,
                    user: user,
                    party: party,
                    comment: comment,
                    userId: userId 
                }
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

    static async getUserInfo(userId) {
        try {
            const userInfo = await Account.findOne({ _id: userId });
            if(!userInfo) {
                return;
            }
            return userInfo;
        } catch (e) {
            return;
        }
    }

    static async login(username, password) {
        const doc = await Account.findOne({ username: username });
        // if account does not exist
        if(!doc) {
            return;
        }
        try {
            const validPass = await bcrypt.compare(password, doc.password);
            if (validPass) {
                const user = {
                    _id: doc._id, 
                    username: doc.username, 
                    acess: doc.access,
                     __v: doc.__v
                    };
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15min' });
                return [accessToken, doc._id];
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
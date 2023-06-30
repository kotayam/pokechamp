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
            const partyRes = await Party.create(partyDoc); 
            if (partyRes) {
                const acc = await Account.findOne({ _id: userId });
                if (acc) {
                    let parties = acc.parties;
                    parties.push(partyRes._id.toString());
                    let numParty = parties.length;
                    const update = await Account.updateOne(
                        { _id: userId }, 
                        { numParty: numParty, parties: parties}
                    );
                }  
            }
            return;
        } catch (e) {
            console.error(e);
            throw new Error("unable to post party");
        }
    }

    static async getParty(partyId) {
        try {
            return await Party.findOne({ _id: new ObjectId(partyId) });
        } catch (e) {
            console.error(e);
            throw new Error("unable to get party");
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
            console.error(e);
            throw new Error("unable to update party");
        }
    }

    static async deleteParty(partyId) {
        try {
            const deleteRes = await Party.findOneAndDelete({ _id: new ObjectId(partyId) });
            if (deleteRes) {
                const userId = new ObjectId(deleteRes.userId);
                const acc = await Account.findOne({ _id: userId });
                if (acc) {
                    let parties = acc.parties;
                    let idx = parties.indexOf(deleteRes._id.toString());
                    if (idx > -1) {
                        parties.splice(idx, 1);
                    }
                    let numParty = parties.length;
                    const update = await Account.updateOne(
                        { _id: userId }, 
                        { numParty: numParty, parties: parties}
                    );
                }  
            }
            return;
        } catch (e) {
            console.error(e);
            throw new Error("unable to delete party")
        }
    }

    static async getAllParties() {
        try {
            const parties = await Party.find();
            return parties;
        } catch (e) {
            console.error(e);
            return { error: e };
        }
    }

    static async getAccountInfo(userId) {
        try {
            const userInfo = await Account.findOne({ _id: userId });
            if(!userInfo) {
                return;
            }
            return userInfo;
        } catch (e) {
            console.error(e);
            return;
        }
    }

    static async deleteAccount(userId) {
        try {
            const deleteRes = await Account.findOneAndDelete({ _id: new ObjectId(userId) });
            return deleteRes;
        } catch (e) {
            console.error(e);
            throw new Error("Failed to delete account.")
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
                    access: doc.access
                };
                let accessToken;
                let refreshToken;
                if (doc.access == "guest" || doc.access == "user") {
                    accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                    refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
                } 
                else if (doc.access == "admin") {
                    accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
                }
                return { accessToken: accessToken, refreshToken: refreshToken, access: doc.access};
            } else {
                console.error("wrong password");
                return;
            }
        } catch (e) {
            console.error(e);
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
                access: "user",
                numParty: 0,
                parties: []
            };
            return await Account.create(account); 
        } catch (e) {
            console.error(e);
            return;
        }
    }
}

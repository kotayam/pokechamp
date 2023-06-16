import mongoose from "mongoose";

// party schema
const partySchema = new mongoose.Schema({
    title: String,
    series: String,
    user: String,
    party: String,
    comment: String
});

// account schema
const accountSchema = new mongoose.Schema({
    username: String,
    password: String,
    access: String
});

// model creation
export const Party = mongoose.model('party', partySchema);
export const Account = mongoose.model('account', accountSchema);
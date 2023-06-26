import express from "express";
import cors from "cors";
import parties from "./api/parties.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const corsOptions = {
    "origin": ["https://pokechamp.heppoko.space", "http://127.0.0.1:5500"],
    "credentials": true
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/api/v1/pokechamp", parties);
app.use("*", (req, res) => res.status(404).json({error: "not found"})); // if invalid location, not found.

export default app;
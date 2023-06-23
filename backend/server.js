import express from "express";
import cors from "cors";
import parties from "./api/parties.route.js";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions = {
    "origin": ["pokechamp.heppoko.space", "http://127.0.0.1:5500"],
    "credentials": true
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/pokechamp", parties);
app.use("*", (req, res) => res.status(404).json({error: "not found"})); // if invalid location, not found.

export default app;
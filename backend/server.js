import express from "express";
import cors from "cors";
import parties from "./api/parties.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/parties", parties);
app.use("*", (req, res) => res.status(404).json({error: "not found"})); // if invalid location, not found.

export default app;
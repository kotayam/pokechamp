import app from "./server.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
const port = process.env.PORT || 8000;

mongoose.connect(
    uri,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    }
)
.catch(err => {
    console.error(err.stack);
    process.exit(1);
}) 
.then(async client => {
    app.listen(port, () => {
        console.log(`listening on port: ${port}`);
    });
});
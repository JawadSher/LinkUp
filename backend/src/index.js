import dotenv from "dotenv";
dotenv.config();
import express from "express";

import authUserRouter from "./routes/authUser.router.js"
import dbConnect from "./utils/dbConnection.js";

const app = express();
const PORT = process.env.PORT || 3000

app.use("/api/v1/user/auth", authUserRouter);

app.listen(PORT, () => {
    dbConnect();
    console.log("Server is running on PORT: ", + PORT);
})
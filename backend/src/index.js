import dotenv from "dotenv";
dotenv.config();
import express from "express";

import authRouter from "./routes/auth.router.js"

const app = express();
const PORT = process.env.PORT || 3000

app.use("/api/v1/auth/", authRouter);

app.listen(PORT, () => {
    console.log("Server is running on PORT: ", + PORT);
})
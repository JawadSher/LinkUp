import express, { json } from "express";
import authUserRouter from "./routes/authUser.router.js"

const app = express();
app.use(express.json({ limit: "16kb" }));
app.use("/api/v1/user/auth", authUserRouter);

export {app};
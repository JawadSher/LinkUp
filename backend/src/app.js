
import express from "express";
import authUserRouter from "./routes/authUser.router.js"

const app = express();
app.use(express.json({ limit: "16kb" }));
app.use("/api/v1/user/auth", authUserRouter);
app.use(express.static("public"));

export {app};
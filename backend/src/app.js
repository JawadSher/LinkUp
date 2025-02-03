import cookieParser from "cookie-parser";
import express from "express";

const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


import authUserRouter from "./routes/authUser.router.js";
app.use("/api/v1/user/auth", authUserRouter);
app.use("/api/v1/user/ch", authUserRouter);

export {app};
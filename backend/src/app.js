import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();
app.use(express.urlencoded({extended: true}))
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const whitelist = ["http://localhost:5173"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    res.status(403).json({
      error: "CORS Error: Origin not allowed",
    });
  } else {
    next(err);
  }
});

import authUserRouter from "./routes/authUser.router.js";
import playlistRouter from "./routes/playlist.router.js";

app.use("/api/v1/user/auth", authUserRouter);
app.use("/api/v1/user/ch", playlistRouter);

export { app };

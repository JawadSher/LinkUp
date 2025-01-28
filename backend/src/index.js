import dotenv from "dotenv";
dotenv.config();
import dbConnect from "./utils/dbConnection.js";
import { app } from "./app.js";

dbConnect()
.then(() => {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log("Server is running on PORT: ", + PORT);
    })
})
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import {app} from "./app.js"

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    const port = process.env.PORT || 8000
    try{
        app.listen(port, () => {
            console.log("Application is listing on port: ", port);
        });
    }catch(error){
        console.log("Mongodb connection failed: ", error);
    }
})
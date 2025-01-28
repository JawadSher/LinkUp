import mongoose from "mongoose"
import { ApiError } from "./ApiError.js"

const dbConnect = async () => {
    try{
        if(!process.env.MONGODB_URI){
            throw new ApiError(500, "Environment variable is not set");
        }
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        if(connectionInstance) {
            console.log("MONGODB connected successfully", connectionInstance.connection.host);
        }
    }catch(error){
        console.log("DB connection failed");
        throw new ApiError(
            500, "DB connection failed", error
        )
    }
}

export default dbConnect;
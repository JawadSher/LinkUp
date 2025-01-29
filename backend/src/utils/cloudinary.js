import {v2 as cloudinary} from "cloudinary";
import fs from "fs"
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadtoCloudinary = async (fileLocalPath) => {
    try{
        if(!fileLocalPath) return null;
        const normalizedPath = fileLocalPath.replace(/\\/g, "/");

        const response = await cloudinary.uploader.upload(
            normalizedPath,
            {
                resource_type: "auto"
            }
        )

        fs.unlinkSync(fileLocalPath);
        return response;
    }catch(error){
        fs.unlinkSync(fileLocalPath);
        return null;
    }
}

export {uploadtoCloudinary};
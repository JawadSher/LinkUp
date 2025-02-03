import {v2 as cloudinary} from "cloudinary";
import fs from "fs"
import dotenv from "dotenv";
import { ApiError } from "./ApiError.js";
import { ApiResponse } from "./ApiResponse.js";
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

const deleteFromCloudinary = async (imageURL) => {
    try {
        const urlParts = imageURL.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const publicID = fileName.split('.')[0];

        const result = await cloudinary.uploader.destroy(publicID);

        if (result.result !== 'ok') {
            throw new Error(`Failed to delete image with public ID ${publicID}`);
        }

        return { status: 200, message: "Image deleted from cloudinary successfully"}
    } catch (error) {
        throw new ApiError(400, error?.message)
    }
}

export { 
    uploadtoCloudinary, 
    deleteFromCloudinary 
};
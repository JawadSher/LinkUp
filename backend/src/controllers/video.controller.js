import mongoose, { isValidObjectId } from "mongoose";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { uploadtoCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";

const publishVideo = asyncHandler( async (req, res) => {
    const {title, description, isPublic = true} = req.body;
    const userId = req.user._id;

    if(!title?.trim().length){
        throw new ApiError(400, "Title is required")
    }
    
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "User id is invalid")
    }

    const user = await User.findById(user._id);
    if(!user){
        throw new ApiError(404, "User not found")
    }

    const videoFileLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if(!thumbnailLocalPath?.trim().length){
        throw new ApiError(400, "Thumbail is required")
    }

    if(!videoFileLocalPath?.trim().length){
        throw new ApiError(400, "Video file is required")
    }

    const allowedMimeTypes = ['video/mp4', 'video/mov'];
    if (!allowedMimeTypes.includes(req.files?.videoFile[0]?.mimetype)) {
        throw new ApiError(400, "Invalid video format");
    }

    const [video, thumbnail] = await Promise.all([
        uploadtoCloudinary(videoFileLocalPath),
        uploadtoCloudinary(thumbnailLocalPath)
    ]);

    const uploadedVideo = await Video.create({
        videoFile: video?.secure_url,
        thumbnail: thumbnail?.secure_url,
        owner: user._id,
        title,
        description: description?.trim() || "",
        duration: video.length,
        views: 0,
        isPublic
    })

    if(!uploadedVideo){
        throw new ApiError(500, "Failed to save video details after upload");
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201, uploadedVideo, "Video is Uploaded Successfully")
    )
})

export const getAllVideos = asyncHandler( async (req, res) => {
    const { limit = 10, page = 1, userId} = req.query;

    if(!userId || !mongoose.Types.ObjectId.isValid(userId)){
        throw new ApiError(400, "Valid user id is required to get channel videos")
    }

    const match = {
        owner: new mongoose.Types.ObjectId(userId),
        isPublished: true,
        isPublic: true
    }

    const videos = Video.find(match)
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate('owner', '_id firstName lastName userName')
    .sort({ createdAt: -1})

    if(!videos){
        throw new ApiError(404, "Videos not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );
})

export const getVideosBySearch = asyncHandler( async (req, res) => {
    const { limit = 10, page = 1, query, userId} = req.query;

    if(!userId || !mongoose.Types.ObjectId.isValid(userId)){
        throw new ApiError(400, "Invalid user id")
    }

    if(!query?.trim()){
        throw new ApiError(400, "Search query is required")
    }

    const match = {
        owner: new mongoose.Types.ObjectId(userId),
        isPublic: true,
        isPublished: true,

        $or: [
            {
                title:{
                    $regex: query,
                    $options: 'i'
                }
            },
            {
                description:{
                    $regex: query,
                    $options: 'i'
                }
            }
        ]
    };

    const videos = Video.find(match)
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate('owner', '_id firstName lastName userName')
    .sort({ createdAt: -1})

    if(!videos){
        throw new ApiError(404, "Videos not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Videos fetched successfuly")
    )
})
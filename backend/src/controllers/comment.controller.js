import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Comment } from "../models/comment.model";
import { Video } from "../models/video.model";
import { ApiResponse } from "../utils/ApiResponse";

export const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    const {page = 1, limit = 10} = req.query;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }

    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video  not found")
    }

    const comments = await Comment.find({videoId})
    .skip((page - 1) * parseInt(limit))
    .limit(parseInt(limit))
    .sort({ createdAt: -1})
    .lean();

    if(!comments.length){
        throw new ApiError(400, "No comments found for this video")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, comments, "Comments fetched successfully")
    )
})

export const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    const {content} = req.body;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }

    const videoExists = await Video.exists({_id: videoId});
    if(!videoExists){
        throw new ApiError(404, "Video not found")
    }

    if(!req.user?._id){
        throw new ApiError(400, "Please login first")
    }

    if(!content?.trim().length){
        throw new ApiError(400, "Please write some text to comment")
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, comment, "Comment created successfully")
    )
})

export const updateComment = asyncHandler(async (req, res) => {
    const {videoId, commentId} = req.params;
    const {content} = req.body;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const videoExists = await Video.exists({_id: videoId});
    if(!videoExists){
        throw new ApiError(404, "Video not found")
    }

    if(!req.user?._id){
        throw new ApiError(401, "Unauthorized request. Please log in first.")
    }

    if(!content?.trim().length){
        throw new ApiError(400, "Please write some text to update comment")
    }

    const comment = await Comment.findOne(
        {
            _id: commentId,
            video: videoId,
            owner: req.user?._id
        }
    )

    if (!comment) {
        throw new ApiError(403, "You are not authorized to update this comment");
    }

    comment.content = content.trim();
    await comment.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200, comment, "Comment updated successfully")
    )
})

export const deleteComment = asyncHandler(async (req, res) => {
    const {videoId, commentId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const videoExists = await Video.exists({_id: videoId});
    if(!videoExists){
        throw new ApiError(404, "Video not found")
    }

    if(!req.user?._id){
        throw new ApiError(401, "Unauthorized request. Please log in first.")
    }

    const comment = await Comment.findOne({
        _id: commentId,
        video: videoId,
        owner: req.user._id,
    });

    if(!comment){
        throw new ApiError(403, "You are not authorized to delete this comment")
    }

    await comment.deleteOne();
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Comment updated successfully")
    )
})
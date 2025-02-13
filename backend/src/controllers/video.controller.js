import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadtoCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";

export const publishVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublic = true } = req.body;
  const userId = req.user._id;

  if (!title?.trim().length) {
    throw new ApiError(400, "Title is required");
  }

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "User id is invalid");
  }

  const user = await User.findById(user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const videoFileLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!thumbnailLocalPath?.trim().length) {
    throw new ApiError(400, "Thumbail is required");
  }

  if (!videoFileLocalPath?.trim().length) {
    throw new ApiError(400, "Video file is required");
  }

  const allowedMimeTypes = ["video/mp4", "video/mov"];
  if (!allowedMimeTypes.includes(req.files?.videoFile[0]?.mimetype)) {
    throw new ApiError(400, "Invalid video format");
  }

  const [video, thumbnail] = await Promise.all([
    uploadtoCloudinary(videoFileLocalPath),
    uploadtoCloudinary(thumbnailLocalPath),
  ]);

  const uploadedVideo = await Video.create({
    videoFile: video?.secure_url,
    thumbnail: thumbnail?.secure_url,
    owner: user._id,
    title,
    description: description?.trim() || "",
    duration: video.length,
    views: 0,
    isPublic,
  });

  if (!uploadedVideo) {
    throw new ApiError(500, "Failed to save video details after upload");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, uploadedVideo, "Video is Uploaded Successfully")
    );
});

export const getOwnerChannelVideos = asyncHandler(async (req, res) => {
  const { limit = 10, page = 1 } = req.query;
  const userId = req.user?._id;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Valid user ID is required to get channel videos");
  }

  const userExist = await User.exists({_id: userId});
  if (!userExist) {
    throw new ApiError(400, "User not found");
  }

  const match = {
    owner: userId,
  };

  const videos = await Video.find(match)
    .skip((page - 1) * parseInt(limit))
    .limit(parseInt(limit))
    .populate("owner", "_id firstName lastName userName")
    .sort({ createdAt: -1 })
    .lean();

  if (!videos.length) {
    throw new ApiError(404, "Videos not found for this user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

export const getSpecificChannelVideos = asyncHandler(async (req, res) => {
  const { limit = 10, page = 1, userId } = req.query;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Valid user ID is required to get channel videos");
  }

  const match = {
    owner: new mongoose.Types.ObjectId(userId),
    isPublic: true,
  };

  const videos = await Video.find(match)
    .skip((page - 1) * parseInt(limit))
    .limit(parseInt(limit))
    .populate("owner", "_id firstName lastName userName")
    .sort({ createdAt: -1 })
    .lean();

  if (!videos.length) {
    throw new ApiError(404, "Videos not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

export const getAllVideos = asyncHandler(async (req, res) => {
  const { limit = 10, page = 1 } = req.query;

  const match = {
    isPublic: true,
  };

  const videos = await Video.find(match)
    .skip((page - 1) * parseInt(limit))
    .limit(parseInt(limit))
    .populate("owner", "_id firstName lastName userName")
    .sort({ createdAt: -1 })
    .lean();

  if (!videos.length) {
    return res.status(200).json(new ApiResponse(200, [], "No videos exists"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

export const getVideosBySearch = asyncHandler(async (req, res) => {
  const { limit = 10, page = 1, query, userId } = req.query;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user id");
  }

  if (!query?.trim()) {
    throw new ApiError(400, "Search query is required");
  }

  const match = {
    owner: new mongoose.Types.ObjectId(userId),
    isPublic: true,
    isPublished: true,

    $or: [
      {
        title: {
          $regex: query,
          $options: "i",
        },
      },
      {
        description: {
          $regex: query,
          $options: "i",
        },
      },
    ],
  };

  const videos = Video.find(match)
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate("owner", "_id firstName lastName userName")
    .sort({ createdAt: -1 });

  if (!videos) {
    throw new ApiError(404, "Videos not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Videos fetched successfuly"));
});

export const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Valid video ID is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found with the given ID");
  }

  if (!video.isPublic && (!req.user || !video.owner.equals(req.user?._id))) {
    throw new ApiError(403, "Video is not found with given ID");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched succesfully"));
});

export const incrementVideoView = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Valid video ID is required");
  }

  const video = Video.findById(videoId);
  if (!video) {
    throw new ApiError(4004, "Video not found");
  }

  video.views += 1;
  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video.views, "View count updated"));
});

export const updateVideoDetails = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;
  const { title, description } = req.body;
  const thumbnail = req.file?.thumbnail?.[0]?.path;

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (!video.owner.equals(userId)) {
    throw new ApiError(400, "Unauthorized request");
  }

  if (!thumbnail && !video.thumbnail) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const oldThumnail = video.thumbnail;
  const newThumnail = await uploadtoCloudinary(thumbnail);
  const updateData = { title };
  if (description) updateData.description = description;
  if (newThumnail) updateData.thumbnail = newThumnail;

  const updatedDetails = await Video.findByIdAndUpdate(
    videoId,
    { $set: updateData },
    { new: true }
  );

  if (!updatedDetails) {
    throw new ApiError(403, "Failed to update video details");
  }

  const thumbnailDeleted = await deleteFromCloudinary(oldThumnail);
  if (!thumbnailDeleted) {
    throw new ApiError(400, "Something went wrong while deleting old thumnail");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedDetails, "Video details updated successfully")
    );
});

export const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (!req.user || !video.owner.equals(userId)) {
    throw new ApiError(400, "Unauthorized request");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Comment.deleteMany({ video: videoId }).session(session);
    await Like.deleteMany({ video: videoId }).session(session);
    const deleteVideo = await Video.findByIdAndDelete(videoId).session(session);

    await Promise.all([deleteComments, deleteLikes, deleteVideo]);

    if (video.thumbnail) {
      const thumbnailDeleted = await deleteFromCloudinary(video.thumbnail);
      if (!thumbnailDeleted) {
        throw new ApiError(500, "Failed to delete video thumbnail");
      }
    }

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(200, videoDeleted, "Video Deleted Successfully"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res
      .status(500)
      .json(new ApiResponse(500, error, "Video Deleted Successfully"));
  }
});

export const toggleisPublicStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Valid video ID is required");
  }

  const video = await Video.findOneAndUpdate(
    {
      _id: videoId,
      owner: userId,
    },
    [
      {
        $set: {
          isPublic: {
            $not: "$isPublic",
          },
        },
      },
    ],
    {
      new: true,
    }
  );

  if (!video) {
    throw new ApiError(404, "Video not found or unauthorized request");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isPublic: video.isPublic },
        "Video public status toggled successfully"
      )
    );
});

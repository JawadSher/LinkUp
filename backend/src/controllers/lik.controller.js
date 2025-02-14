import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Video } from "../models/video.model";
import { Like } from "../models/like.model";
import { Tweet } from "../models/tweet.model";
import { Comment } from "../models/comment.model";
import { ApiResponse } from "../utils/ApiResponse";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Video ID is required to toggle likes");
  }

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Please login first to toggle likes");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: userId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Video unliked successfully"));
  } else {
    const newLike = new Like({
      video: videoId,
      likedBy: userId,
    });

    await newLike.save();
    return res
      .status(201)
      .json(new ApiResponse(201, newLike, "Video liked successfully"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?._id;

  if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Comment ID is required to toggle likes");
  }

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Please login first to toggle likes");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: userId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Comment unliked successfully"));
  } else {
    const newLike = new Like({
      comment: commentId,
      likedBy: userId,
    });

    await newLike.save();
    return res
      .status(201)
      .json(new ApiResponse(201, newLike, "Comment liked successfully"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user?._id;

  if (!tweetId || !mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Tweet ID is required to toggle likes");
  }

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Please login first to toggle likes");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: userId,
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Tweet unliked successfully"));
  } else {
    const newLike = new Like({
      tweet: tweetId,
      likedBy: userId,
    });

    await newLike.save();
    return res
      .status(201)
      .json(new ApiResponse(201, newLike, "Tweet liked successfully"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Please login first to get all liked videos");
  }

  const likedVideos = await Like.find({
    likedBy: userId,
  })
    .populate("videos")
    .exec();

  if (likedVideos.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No liked videos found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos retrieved successfully")
    );
});
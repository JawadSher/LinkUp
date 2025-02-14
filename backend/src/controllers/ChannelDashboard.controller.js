import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse";
import { getSpecificChannelVideos } from "./video.controller.js";

export const getUserChannelBySearch = asyncHandler(async (req, res) => {
  const { channel } = req.query;
  const userId = req.user?._id;

  if (!channel?.trim()?.length) {
    throw new ApiError(400, "Username or Channel name is required");
  }

  const match = {
    $or: [
      { userName: { $regex: channel, $options: "i" } },
      { channelName: { $regex: channel, $options: "i" } },
      { description: { $regex: channel, $options: "i" } },
    ],
  };

  const userChannel = await User.findOne(match).select(
    "-password -refreshToken"
  );

  if (!userChannel) {
    throw new ApiError(404, "Channel not found");
  }

  if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const channelOwner = userChannel._id.equals(userId);

  const channelProfile = await User.aggregate([
    {
      $match: { _id: userChannel._id },
    },
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "videos",
      },
    },
    {
      $addFields: {
        totalVideos: { $size: "$videos" },
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" },
        isSubscribed: {
          $in: [mongoose.Types.ObjectId(userId), "$subscribers.subscriber"],
        },
      },
    },
    {
      $project: {
        _id: 1,
        userName: 1,
        channelName: 1,
        avatar: 1,
        bannerImage: 1,
        totalVideos: 1,
        subscribersCount: 1,
        isSubscribed: 1,
        videos: {
          _id: 1,
          title: 1,
          description: 1,
          thumbnail: 1,
          views: 1,
          createdAt: 1,
        },
      },
    },
  ]);

  const data = {
    channelOwner,
    channelProfile: channelProfile[0],
  };

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Channel profile fetched successfully"));
});

export const getChannelVideos = asyncHandler(async (req, res) => {
    const {userName} = req.params;

    if (!userName?.trim().length) {
        throw new ApiError(400, "Username is required to get channel videos");
    }

    const user = await User.findOne({
        $or: [
            { userName: { $regex: userName, $options: 'i' } },
            { channelName: { $regex: userName, $options: 'i' } }
        ]
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const match = {
        owner: new mongoose.Types.ObjectId(user._id),
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
    .json(
        new ApiResponse(200, videos, "Videos fetch successfully")
    )
})
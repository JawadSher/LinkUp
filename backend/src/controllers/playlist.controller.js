import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

export const createPlaylist = asyncHandler(async (req, res) => {
    const {playlistName, playlistDescription} = req.body;

    if(!playlistName?.length){
        throw new ApiError(400, "Playlist name is required")
    }

    const existingPlaylist = await Playlist.findOne({ playlistName });

    if(existingPlaylist){
        throw new ApiError(400, "Playlist with this name is already exist")
    }

    const playlist = await Playlist.create(
        {
            playlistName,
            playlistDescription,
            playlistOwner: req.user._id 
        },
        {
            new: true
        }
    );

    const createdPlaylist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlist._id)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "playlistOwner",
                foreignField: "_id",
                as: "playlistOwner"
            }
        },
        {
            $unwind: "$playlistOwner" 
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        },
        {
            $project:{
                _id: 1,
                playlistName: 1,
                playlistDescription: 1,
                createdAt: 1,
                updatedAt: 1,
                "playlistOwner._id": 1,
                "playlistOwner.firstName": 1,
                "playlistOwner.lastName": 1,
                "playlistOwner.channelName": 1,
                "videos._id": 1,
                "videos.title": 1,
                "videos.thumbnail": 1,
                "videos.duration": 1,
            }
        }
    ])

    if(!createPlaylist){
        throw new ApiError(400, "Something went wrong while creating a playlist")
    }



    return res
    .status(201)
    .json(
        new ApiResponse(200, createdPlaylist[0], "Playlist is created Successfully")
    )
})

export const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    
    if(!userId?.length){
        throw new ApiError(400, "User ID is required")
    }

    const playlists = await Playlist.aggregate([
        {
            $match: {playlistOwner: new mongoose.Types.ObjectId(userId)}
        },
        {
            $lookup: {
                from: "users",
                localField: "playlistOwner",
                foreignField: "_id",
                as: "playlistOwner"
            }
        },
        {
            $unwind: "$playlistOwner" 
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        },
        {
            $project: {
                _id: 1,
                playlistName: 1,
                playlistDescription: 1,
                createdAt: 1,
                updatedAt: 1,
                "playlistOwner._id": 1,
                "playlistOwner.username": 1,
                "playlistOwner.email": 1,
                "playlistOwner.avatar": 1,
                "videos._id": 1,
                "videos.title": 1,
                "videos.thumbnail": 1,
                "videos.duration": 1
            }
        }
    ])

    if(!playlists){
        throw new ApiError(400, "No any playlists available")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, playlists[0], "Playlists fetched successfully")
    )
})

export const getPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if(!playlistId?.length){
        throw new ApiError(400, "Playlist ID is required")
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "playlistOwner",
                foreignField: "_id",
                as: "playlistOwner",
            }
        },
        {
            $unwind: "$playlistOwner" 
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        },
        {
            $project:{
                _id: 1,
                playlistName: 1,
                playlistDescription: 1,
                "playlistOwner._id": 1,
                "playlistOwner.firstName": 1,
                "playlistOwner.lastName": 1,
                "playlistOwner.channelName": 1,
                "videos._id": 1,
                "videos.title": 1,
                "videos.description": 1,
                "videos.duration": 1,
            }
        }
    ]);


    if(playlist.length === 0){
        throw new ApiError(404, "Playlist is not exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, playlist[0], "Playlist fetched successfully")
    )
})

export const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;

    if(!playlistId || !videoId){
        throw new ApiError(400, "PlaylistId and videoId is required")
    }

    const videoExists = await Video.findById(videoId);
    if(!videoExists){
        throw new ApiError(400, "Video not found")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: {
                videos: videoId
            }
        },
        {
            new: true
        }
    )

    if (!updatedPlaylist) {
        throw new ApiError(404, "Playlist not found");
    }

    const populatedPlaylist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup:{
               from: "videos",
               localField: "videos",
               foreignField: "_id",
               as: "videos" 
            }
        },
        {
            $project:{
                
            }
        }
    ])

    if(!populatedPlaylist || populatedPlaylist.length === 0){
        throw new ApiError(400, "Failed to retreive updated playlist")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(200, populatedPlaylist[0], "Video add successfully to playlist")
    )
})

export const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;

    if(!playlistId || !videoId){
        throw new ApiError(400, "PlaylistId and videoId is required")
    }

    const videoExists = await Video.findById(videoId);
    if(!videoExists){
        throw new ApiError(400, "Video not found")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                videos: videoId
            }
        },
        {
            new: true
        }
    )

    if (!updatedPlaylist) {
        throw new ApiError(404, "Playlist not found");
    }

    const populatedPlaylist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup:{
               from: "videos",
               localField: "videos",
               foreignField: "_id",
               as: "videos" 
            }
        },
        {
            $project:{

            }
        }
    ])

    if(!populatedPlaylist || populatedPlaylist.length === 0){
        throw new ApiError(400, "Failed to retreive updated playlist")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(200, populatedPlaylist[0], "Video remove successfully from playlist")
    )
})

export const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;

    if(!playlistId){
        throw new ApiError(400, "Playlist id is required")
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

    if(!deletePlaylist){
        throw new ApiError(400, "Playlist not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Playlist deleted successfully")
    )
})

export const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;
    const {playlistName, playlistDescription} = req.body;

    if(!playlistId){
        throw new ApiError(400, "Playlist id is required")
    }

    if(!playlistName?.trim().length){
        throw new ApiError(400, "Playlist name is required")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            playlistName: playlistName.trim(),
            playlistDescription: playlistDescription?.trim(),
        },
        {
            new: true
        }
    )

    if(!playlist){
        throw new ApiError(400, "Playlist not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, playlist, "Playlist is updated successfully")
    )
})
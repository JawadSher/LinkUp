import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler.js";

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
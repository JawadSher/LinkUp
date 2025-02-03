import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User }  from "../models/user.model.js";
import { deleteFromCloudinary, uploadtoCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (user) =>{
    try {
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return {accessToken, refreshToken};
    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Something went wrong while generating Access and Refresh Token")
    }
}

const options = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'strict', 
    secure: process.env.NODE_ENV === 'production',
    path: '/',
}

export const registerUser = asyncHandler( async (req, res) => {
    const { firstName, lastName, email, channelName, password } = req.body;

    if(
        [firstName, lastName, email, channelName, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    const userExist = await User.findOne({email: email});
    if(userExist) {
        throw new ApiError(409, "The user with this email is already exist")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path || null;
    const bannerImageLocalPath = req.files?.bannerImage?.[0]?.path || null;

    const avatar = avatarLocalPath ? await uploadtoCloudinary(avatarLocalPath) : null;
    const bannerImage =  bannerImageLocalPath ? await uploadtoCloudinary(bannerImageLocalPath) : null;

    const user = await User.create({
        firstName,
        lastName,
        email,
        channelName: "@" + channelName,
        password,
        avatar: avatar?.secure_url || "",
        bannerImage: bannerImage?.secure_url || "",
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registerd successfully")
    )
})

export const loginUser = asyncHandler( async (req, res) => {

    const { email, password } = req.body;

    if(!email || !password){
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({email: email});
    if(!user || !(await user.isPasswordCorrect(password))){
        throw new ApiError(401, "Invalid Credentails")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )
})

export const logoutUser = asyncHandler (async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(
        new ApiResponse(200, {}, "User logged out")
    )
})

export const refreshAccessToken = asyncHandler (async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
        if(!incomingRefreshToken){
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id);
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Invalid refresh token")
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user);
        
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(200, {accessToken, refreshToken: newRefreshToken}, "Access token refreshed")
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

export const updatePassword = asyncHandler (async (req, res) => {
    const {oldPassword, newPassword} = req.body;

    if(!oldPassword || !newPassword){
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiError(400, "Old password is invalid")
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false});

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Password updated successfully")
    )
})

export const updateAccount = asyncHandler (async (req, res) => {
    const {firstName, lastName, email, channelName, password} = req.body;

    if(!firstName || !lastName || !email || !channelName || !password){
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findById(req.user._id);
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    
    if(!isPasswordCorrect){
        throw new ApiError("400", "Invalid password")
    }

    const newUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                firstName,
                lastName,
                email,
                channelName,
            }
        },
        {new: true}
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(
        new ApiResponse(200, newUser, "Account details updated successfully")
    )
})

export const updateAvatar = asyncHandler (async (req, res) => {
    const newAvatarLocalPath = req.file.path;

    if(!newAvatarLocalPath){
        throw new ApiError(400, "Avatar file is missing")
    }

    const oldAvatar = req.user?.avatar;
    const newAvatar = await uploadtoCloudinary(newAvatarLocalPath);

    if(!newAvatar.secure_url){
        throw new ApiError(400, "Error while uploading avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: newAvatar.secure_url
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    await user.save({ validateBeforeSave: false });

    if (oldAvatar != "") {
        try {
            const deleteResponse = await deleteFromCloudinary(oldAvatar);
            console.log(deleteResponse.message);
        } catch (error) {
            console.error(error.message);
        }
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar updated successfully")
    )
})

export const updateBannerImage = asyncHandler (async (req, res) => {
    const newBannerLocalPath = req.file.path;

    if(!newBannerLocalPath){
        throw new ApiError(400, "Banner image file is missing")
    }

    const oldBannerImage = req.user?.bannerImage;
    const newBannerImage = await uploadtoCloudinary(newBannerLocalPath);

    if(!newBannerImage.secure_url){
        throw new ApiError(400, "Error while uploading banner image")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                bannerImage: newBannerImage.secure_url
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    await user.save({ validateBeforeSave: false });

    if (oldBannerImage != "") {
        try {
            const deleteResponse = await deleteFromCloudinary(oldBannerImage);
            console.log(deleteResponse.message);
        } catch (error) {
            console.error(error.message);
        }
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Banner image updated successfully")
    )
})

export const getCurrentUser = asyncHandler (async (req, res) => {
    const user = req.user;

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "User fetched successfully")
    )
})

export const getUserChannelProfile = asyncHandler (async (req, res) => {
    try{
        const { channelname } = req.params;

        if(!channelname?.length) {
            throw new ApiError(400, "Channel name is missing")
        }

        const channel = await User.aggregate([
            {
                $match: {
                    _id: new moongose.Types.ObjectId(req.user?._id)
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscriber",
                    as: "subscribeTo"
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "channel",
                    as: "subscribers"
                }
            },
            {
                $addFields: {
                    subscribersCount: {
                        $size: "$subscribers"
                    },
                    subscribedToCount: {
                        $size: "$subscribeTo"
                    },
                    isSubscribed: {
                        $cond:{
                            if: {$in: [req.user._id, "$subscribers.subscriber"]},
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    channelname: 1,
                    subscribedToCount: 1,
                    subscribersCount: 1,
                    isSubscribed: 1,
                    avatar: 1,
                    bannerImage: 1,
                }
            }
        ])

        if(!channel?.length){
            throw new ApiError(400, "Channel does not exits")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, channel[0], "User channel fetch successfully")
        )

    }catch(error){
        throw new ApiError(400, "Something went while getting the channel profile")
    }
})

export const getWatchHistory = asyncHandler (async (req, res) => {
    const user = User.aggregate([
        {
            $match: {
                _id: new moongose.Types.ObjectId(req,user?._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        firstName: 1,
                                        lastName: 1,
                                        avatar: 1,
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            } 
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200, user[0].watchHistory, "Watch history fetched successfully")
    )
})
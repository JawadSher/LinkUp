import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User }  from "../models/user.model.js";
import { uploadtoCloudinary } from "../utils/cloudinary.js";
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
    const { firstName, lastName, email, password } = req.body;

    if(
        [firstName, lastName, email, password].some((field) => field?.trim() === "")
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
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
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
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {accessToken, refreshToken: newRefreshToken}, "Access token refreshed")
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})


import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { User }  from "../models/user.model.js";

export const RegisterUser = asyncHandler( async (req, res) => {
    // get all data from user -> name, email, password etc
    // check all data present in the req
    // Check the user by email has already account or not
    // Check the user avatar or banner image
    // upload avatar or banner image to cloudinary
    // create entry in the db
    // remove the important data from response
    // return response

    const { firstName, lastName, email, password } = req.body;

    if(
        [firstName, lastName, email, password].some((field) => field.trim() === "")
    ){
        throw new ApiError(400, "All fields are required" );
    }

    const user = await User.findOne({email: email});
    if(user){
        throw new ApiError(409, "User with this email is already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const bannerImageLocalPath = req.files?.bannerImage[0]?.path;

    
})
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const healthcheck = asyncHandler(async (req, res) => {
    if(!req.user._id || !mongoose.Types.ObjectId.isValid(req.user?._id)){
        throw new ApiError(400, "Please login to check health")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {
            health: ok
        }, "Health checked successfully")
    )
})

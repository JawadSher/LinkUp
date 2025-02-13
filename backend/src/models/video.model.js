import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new Schema({
    videoFile: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 255
    },
    description: {
        type: String,
        default: '',
        maxLength: 1000
    },
    duration: {
        type: Number,
        required: true,
    },
    views: {
        type: Number,
        required: true,
        default: 0
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: true,
    }    

}, {timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videoSchema);
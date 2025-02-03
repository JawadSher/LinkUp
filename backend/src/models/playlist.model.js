import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const playlistSchema = new Schema({
    playlistName: {
        type: String,
        required: [true, "Playlist name is required"],
        maxLength: 30
    },
    playlistDescription: {
        type: String,
        default: "",
        maxLength: 1000
    },
    videos:[
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    playlistOwner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true})

playlistSchema.plugin(mongooseAggregatePaginate);
export const Playlist = mongoose.model("Playlist", playlistSchema);
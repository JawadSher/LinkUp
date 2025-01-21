import mongoose, {Schema} from 'mongoose';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    fullName: {
        type: String,
        get: function() {
            return `${this.firstname} ${this.lastname}`;
        }
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'password is required'],
        min: [8, 'password must be at least 8 character long'],
        match: [/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'password must contain at least one letter, one number, and one special character'],
        trim: true,
    },
    refreshToken: {
        type: String,
    }

}, 
    {
        toJSON: {getters: true},
        toObject: {getters: true},
        timestamps: true
    },
)

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        fullname: this.fullName,
        email: this.email,

    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const User = mongoose.model("User", userSchema);
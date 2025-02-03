import mongoose, { Schema } from "mongoose";
import bycrpt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 40
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 40,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "User already exist with this email"],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    channelName: {
        type: String,
        required: [true, "Channel name is required"],
        maxLength: 30
    }, 
    avatar: {
        type: String,
        default: ""
    },
    bannerImage: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: [true, "Password is required"], 
        minLength: [10, "Password must be at least 10 characters long"],
        validate: {
            validator: function (v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/.test(v);
            },
            message: props => `${props.value} is not a strong password! A strong password must include uppercase, lowercase, a digit, and a special character.`
        }
    },
    refreshToken: {
        type: String,
    },
    watchHistory: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    friends: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]

}, {timestamps: true});

userSchema.pre('save', async function(next){
    if(!this.isModified("password")) return next();
    const saltRounds = 10; 
    const hashPassword = await bycrpt.hash(this.password, saltRounds);
    this.password = hashPassword;
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bycrpt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);
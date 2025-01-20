import mongoose, {Schema} from 'mongoose';
import bcrypt from "bcrypt"

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    fullname: {
        type: String,
        get: function() {
            return `${this.firstname} ${this.lastname}`;
        }
    },
    username: {
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

userSchema.pre("save", function(next){
    if(!this.isModified("firstname") && !this.isModified("lastname")) return next();
    this.fullname = `${this.firstname} ${this.lastname}`;
    next();
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {

}
userSchema.methods.generateRefreshToken = function () {

}

export const User = mongoose.model("User", userSchema);
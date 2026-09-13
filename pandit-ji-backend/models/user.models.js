import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "pandit"],
        default: "user"
    },
    resetOtp: {
        type: String
    },
    firebaseUid: {
        type: String,
        default: ""
    },
    isotpVerified: {
        type: Boolean,
        default: false
    },
    otpExpires: {
        type: Date
    },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
    },
    address: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    }
}, { timestamps: true });

userSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", userSchema);
export default User;

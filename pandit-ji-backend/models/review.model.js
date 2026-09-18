import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    pandit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pandit",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        default: ""
    },
    userName: {
        type: String,
        required: true
    },
    serviceName: {
        type: String,
        default: "Pooja Ceremony"
    }
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;

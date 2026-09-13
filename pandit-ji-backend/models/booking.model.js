import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
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
    bookingType: {
        type: String,
        enum: ["instant", "scheduled"],
        default: "scheduled"
    },
    serviceName: {
        type: String,
        required: true
    },
    servicePrice: {
        type: Number,
        default: 0
    },
    isCustomPooja: {
        type: Boolean,
        default: false
    },
    customRequirement: {
        type: String,
        default: ""
    },
    bhojanSeva: {
        type: Boolean,
        default: false
    },
    numberOfPeople: {
        type: Number,
        default: 1
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userMobile: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    userLocation: {
        latitude: { type: Number, default: 22.7196 },
        longitude: { type: Number, default: 75.8577 }
    },
    panditLocation: {
        latitude: { type: Number, default: 22.7296 },
        longitude: { type: Number, default: 75.8677 }
    },
    distanceKm: {
        type: Number,
        default: 0
    },
    etaMinutes: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "on_the_way", "arriving", "reached", "started", "completed", "cancelled", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;

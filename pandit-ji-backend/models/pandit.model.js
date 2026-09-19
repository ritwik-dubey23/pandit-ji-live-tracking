import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    duration: {
        type: String,
        default: "1-2 Hours"
    },
    image: {
        type: String,
        default: ""
    },
    photos: [{
        type: String
    }]
}, { timestamps: true });

const panditSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    experienceYears: {
        type: Number,
        default: 5
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: ""
    },
    backgroundImage: {
        type: String,
        default: ""
    },
    photos: [{
        type: String
    }],
    services: [serviceSchema],
    availability: {
        type: Boolean,
        default: true
    },
    isOnline: {
        type: Boolean,
        default: true
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    rating: {
        average: { type: Number, default: 4.8 },
        count: { type: Number, default: 12 }
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Pandit = mongoose.model("Pandit", panditSchema);
export default Pandit;

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
        index: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    senderRole: {
        type: String,
        enum: ["user", "pandit"],
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;

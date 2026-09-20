import Message from "../models/message.model.js";
import Booking from "../models/booking.model.js";
import { getIo } from "../socket.js";

// GET /api/booking/:bookingId/messages
export const getBookingMessages = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId).populate("pandit");
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        const currentUserId = req.userId.toString();
        const bookingUserId = booking.user ? booking.user.toString() : "";
        const panditUserId = booking.pandit?.user ? booking.pandit.user.toString() : "";

        // STRICT AUTHORIZATION GUARD: User can only access messages of their own booking
        if (currentUserId !== bookingUserId && currentUserId !== panditUserId) {
            return res.status(403).json({ message: "Unauthorized access to private booking conversation." });
        }

        const messages = await Message.find({ booking: bookingId }).sort({ createdAt: 1 });
        return res.status(200).json(messages);
    } catch (error) {
        console.error("getBookingMessages error:", error);
        return res.status(500).json({ message: "Error fetching booking messages." });
    }
};

// POST /api/booking/:bookingId/messages
export const sendBookingMessage = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: "Message text is required." });
        }

        const booking = await Booking.findById(bookingId).populate("pandit");
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        const currentUserId = req.userId.toString();
        const bookingUserId = booking.user ? booking.user.toString() : "";
        const panditUserId = booking.pandit?.user ? booking.pandit.user.toString() : "";

        // STRICT AUTHORIZATION GUARD
        if (currentUserId !== bookingUserId && currentUserId !== panditUserId) {
            return res.status(403).json({ message: "Unauthorized to send messages to this booking conversation." });
        }

        const senderRole = (currentUserId === panditUserId) ? "pandit" : "user";

        const message = await Message.create({
            booking: bookingId,
            sender: req.userId,
            senderRole,
            text: text.trim()
        });

        const messagePayload = {
            _id: message._id.toString(),
            id: message._id.toString(),
            bookingId,
            sender: req.userId,
            senderRole,
            text: message.text,
            createdAt: message.createdAt
        };

        // Real-Time Socket.IO Broadcast to booking room & user rooms
        try {
            const io = getIo();
            io.to(`booking_${bookingId}`).emit("receive_chat_message", messagePayload);
            if (bookingUserId) io.to(`user_${bookingUserId}`).emit("receive_chat_message", messagePayload);
            if (panditUserId) {
                io.to(`pandit_${panditUserId}`).emit("receive_chat_message", messagePayload);
                io.to(`user_${panditUserId}`).emit("receive_chat_message", messagePayload);
            }
        } catch (socketErr) {
            console.error("Socket emit failed in sendBookingMessage:", socketErr.message);
        }

        return res.status(201).json(messagePayload);
    } catch (error) {
        console.error("sendBookingMessage error:", error);
        return res.status(500).json({ message: "Error sending message." });
    }
};

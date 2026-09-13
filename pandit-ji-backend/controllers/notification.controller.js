import Notification from "../models/notification.model.js";
import { getIo } from "../socket.js";

export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.userId })
            .sort({ createdAt: -1 })
            .limit(40);
        
        const unreadCount = await Notification.countDocuments({ recipient: req.userId, isRead: false });

        return res.status(200).json({
            notifications,
            unreadCount
        });
    } catch (error) {
        console.error("getUserNotifications error:", error);
        return res.status(500).json({ message: "Error fetching notifications." });
    }
};

export const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findOne({ _id: id, recipient: req.userId });
        if (!notification) {
            return res.status(404).json({ message: "Notification not found." });
        }
        notification.isRead = true;
        await notification.save();

        const unreadCount = await Notification.countDocuments({ recipient: req.userId, isRead: false });
        return res.status(200).json({ message: "Notification marked as read", notification, unreadCount });
    } catch (error) {
        return res.status(500).json({ message: "Error updating notification." });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ recipient: req.userId, isRead: false }, { isRead: true });
        return res.status(200).json({ message: "All notifications marked as read", unreadCount: 0 });
    } catch (error) {
        return res.status(500).json({ message: "Error updating notifications." });
    }
};

// Internal Helper Function to Create and Broadcast Notifications over Socket.IO
export const createAndEmitNotification = async ({ recipientId, senderId, title, message, type, bookingId, data }) => {
    try {
        if (!recipientId || !title || !message) return null;

        const notification = await Notification.create({
            recipient: recipientId,
            sender: senderId || null,
            title,
            message,
            type: type || "system",
            bookingId: bookingId || null,
            data: data || {},
            isRead: false
        });

        // Emit Socket.IO Event
        try {
            const io = getIo();
            const recIdStr = recipientId.toString();
            console.log(`[NOTIFICATION SOCKET EMIT] Sending new_notification to user_${recIdStr} & pandit_${recIdStr}`);
            io.to(`user_${recIdStr}`).emit("new_notification", notification);
            io.to(`pandit_${recIdStr}`).emit("new_notification", notification);
        } catch (socketErr) {
            console.error("Socket notification emit error:", socketErr.message);
        }

        return notification;
    } catch (error) {
        console.error("createAndEmitNotification error:", error);
        return null;
    }
};

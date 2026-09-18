import Booking from "../models/booking.model.js";
import Pandit from "../models/pandit.model.js";
import Review from "../models/review.model.js";
import { getIo } from "../socket.js";
import { createAndEmitNotification } from "./notification.controller.js";

export const createBooking = async (req, res) => {
    try {
        const {
            panditId,
            bookingType,
            serviceName,
            servicePrice,
            isCustomPooja,
            customRequirement,
            bhojanSeva,
            numberOfPeople,
            date,
            time,
            userName,
            userMobile,
            address,
            latitude,
            longitude
        } = req.body;

        const pandit = await Pandit.findById(panditId);
        if (!pandit) {
            return res.status(404).json({ message: "Pandit Ji not found." });
        }

        const userLat = latitude ? Number(latitude) : 22.7196;
        const userLon = longitude ? Number(longitude) : 75.8577;

        // Server-Side Price Verification against Pandit's configured services
        let verifiedPrice = 500;
        const targetServiceName = serviceName ? serviceName.trim() : "Custom Pooja";
        const matchedService = pandit.services.find(s => s.name.toLowerCase() === targetServiceName.toLowerCase());

        if (matchedService) {
            verifiedPrice = matchedService.price;
        } else if (servicePrice && Number(servicePrice) > 0) {
            verifiedPrice = Number(servicePrice);
        }

        const isBhojanSevaRequest = Boolean(bhojanSeva) || targetServiceName.toLowerCase().includes("bhojan");

        const booking = await Booking.create({
            user: req.userId,
            pandit: panditId,
            bookingType: bookingType || "scheduled",
            serviceName: targetServiceName,
            servicePrice: verifiedPrice,
            isCustomPooja: Boolean(isCustomPooja),
            customRequirement: customRequirement || "",
            bhojanSeva: isBhojanSevaRequest,
            numberOfPeople: numberOfPeople ? Number(numberOfPeople) : 1,
            date: date || new Date().toISOString().split("T")[0],
            time: time || "10:00 AM",
            userName,
            userMobile,
            address,
            userLocation: { latitude: userLat, longitude: userLon },
            panditLocation: { latitude: userLat + 0.015, longitude: userLon + 0.015 },
            distanceKm: 2.1,
            etaMinutes: 8,
            totalAmount: verifiedPrice,
            status: "pending"
        });

        const populatedBooking = await Booking.findById(booking._id)
            .populate("user", "fullName email mobile")
            .populate("pandit");

        // Real-Time Socket.IO Notification to Pandit Ji Room
        try {
            const io = getIo();
            const panditUserId = pandit.user.toString();
            console.log(`[SOCKET] Emitting new_booking to room pandit_${panditUserId}`);
            io.to(`pandit_${panditUserId}`).emit("new_booking", populatedBooking);

            await createAndEmitNotification({
                recipientId: pandit.user,
                senderId: req.userId,
                title: isBhojanSevaRequest ? "Bhojan Seva Request 🍚" : "New Booking Request 🕉️",
                message: `${userName} sent a ${isBhojanSevaRequest ? 'Bhojan Seva' : 'booking'} request for ${populatedBooking.serviceName} on ${date} (₹${verifiedPrice}).`,
                type: "booking_request",
                bookingId: booking._id,
                data: { bookingId: booking._id, serviceName: populatedBooking.serviceName }
            });
        } catch (socketErr) {
            console.error("Socket emit failed:", socketErr.message);
        }

        return res.status(201).json({
            message: "Booking request submitted successfully!",
            booking: populatedBooking
        });
    } catch (error) {
        console.error("createBooking error:", error);
        return res.status(500).json({ message: "Error creating booking request." });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.userId })
            .populate("pandit")
            .populate("review")
            .sort({ createdAt: -1 });
        return res.status(200).json(bookings);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching user bookings." });
    }
};

export const getPanditBookings = async (req, res) => {
    try {
        const pandit = await Pandit.findOne({ user: req.userId });
        if (!pandit) {
            return res.status(404).json({ message: "Pandit Ji profile not found." });
        }

        const bookings = await Booking.find({ pandit: pandit._id })
            .populate("user", "fullName email mobile")
            .populate("review")
            .sort({ createdAt: -1 });
        return res.status(200).json(bookings);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching Pandit Ji bookings." });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["pending", "accepted", "on_the_way", "arriving", "reached", "started", "completed", "rejected", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid booking status." });
        }

        const booking = await Booking.findById(id).populate("pandit").populate("user", "fullName email mobile");
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        booking.status = status;
        await booking.save();

        // Real-Time Socket.IO Notification to User and Pandit Rooms
        try {
            const io = getIo();
            const userId = booking.user._id ? booking.user._id.toString() : booking.user.toString();
            const panditUserId = booking.pandit.user ? booking.pandit.user.toString() : booking.pandit.toString();

            console.log(`[SOCKET] Emitting booking_status_updated (${status}) to user_${userId}, pandit_${panditUserId}, booking_${id}`);
            io.to(`user_${userId}`).emit("booking_status_updated", booking);
            io.to(`pandit_${panditUserId}`).emit("booking_status_updated", booking);
            io.to(`booking_${id}`).emit("booking_status_updated", booking);

            if (status === "accepted") {
                io.to(`user_${userId}`).emit("booking_accepted", booking);
                io.to(`booking_${id}`).emit("booking_accepted", booking);

                await createAndEmitNotification({
                    recipientId: userId,
                    senderId: panditUserId,
                    title: "Booking Accepted! 🙏",
                    message: `${booking.pandit.name} has accepted your request for ${booking.serviceName}.`,
                    type: "booking_accepted",
                    bookingId: booking._id,
                    data: { bookingId: booking._id, status: "accepted" }
                });
            } else if (status === "on_the_way") {
                await createAndEmitNotification({
                    recipientId: userId,
                    senderId: panditUserId,
                    title: "Pandit Ji is On The Way 🚗",
                    message: `${booking.pandit.name} has started driving to your venue for ${booking.serviceName}.`,
                    type: "booking_on_the_way",
                    bookingId: booking._id,
                    data: { bookingId: booking._id, status: "on_the_way" }
                });
            } else if (status === "arriving") {
                await createAndEmitNotification({
                    recipientId: userId,
                    senderId: panditUserId,
                    title: "Pandit Ji Arriving Shortly 📍",
                    message: `${booking.pandit.name} is near your venue location.`,
                    type: "booking_arriving",
                    bookingId: booking._id,
                    data: { bookingId: booking._id, status: "arriving" }
                });
            } else if (status === "reached") {
                await createAndEmitNotification({
                    recipientId: userId,
                    senderId: panditUserId,
                    title: "Pandit Ji Reached Venue 🙏",
                    message: `${booking.pandit.name} has reached your venue.`,
                    type: "booking_reached",
                    bookingId: booking._id,
                    data: { bookingId: booking._id, status: "reached" }
                });
            } else if (status === "started") {
                await createAndEmitNotification({
                    recipientId: userId,
                    senderId: panditUserId,
                    title: "Pooja Ceremony Started 🕉️",
                    message: `The sacred ${booking.serviceName} ceremony has officially started.`,
                    type: "booking_started",
                    bookingId: booking._id,
                    data: { bookingId: booking._id, status: "started" }
                });
            } else if (status === "rejected") {
                io.to(`user_${userId}`).emit("booking_rejected", booking);
                io.to(`booking_${id}`).emit("booking_rejected", booking);

                await createAndEmitNotification({
                    recipientId: userId,
                    senderId: panditUserId,
                    title: "Booking Request Declined ❌",
                    message: `${booking.pandit.name} is unavailable for ${booking.serviceName}.`,
                    type: "booking_rejected",
                    bookingId: booking._id,
                    data: { bookingId: booking._id, status: "rejected" }
                });
            } else if (status === "completed") {
                await createAndEmitNotification({
                    recipientId: userId,
                    senderId: panditUserId,
                    title: "Ceremony Completed 🚩",
                    message: `Your ${booking.serviceName} ceremony has been marked as completed! You can now rate Pandit Ji.`,
                    type: "booking_completed",
                    bookingId: booking._id,
                    data: { bookingId: booking._id, status: "completed" }
                });
            } else if (status === "cancelled") {
                await createAndEmitNotification({
                    recipientId: panditUserId,
                    senderId: userId,
                    title: "Booking Cancelled ⚠️",
                    message: `User ${booking.userName} cancelled the booking for ${booking.serviceName}.`,
                    type: "booking_cancelled",
                    bookingId: booking._id,
                    data: { bookingId: booking._id, status: "cancelled" }
                });
            }
        } catch (socketErr) {
            console.error("Socket status update emit failed:", socketErr.message);
        }

        return res.status(200).json({
            message: `Booking status updated to ${status}`,
            booking
        });
    } catch (error) {
        console.error("updateBookingStatus error:", error);
        return res.status(500).json({ message: "Error updating booking status." });
    }
};

export const submitBookingReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        const numericRating = Number(rating);
        if (!numericRating || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5 stars." });
        }

        const booking = await Booking.findById(id).populate("pandit").populate("user", "fullName");
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        if (booking.user._id.toString() !== req.userId) {
            return res.status(403).json({ message: "You are not authorized to rate this booking." });
        }

        if (booking.status !== "completed") {
            return res.status(400).json({ message: "You can only rate a ceremony after it is completed." });
        }

        if (booking.isRated) {
            return res.status(400).json({ message: "You have already submitted a review for this booking." });
        }

        // Create Review Document
        const review = await Review.create({
            booking: booking._id,
            user: req.userId,
            pandit: booking.pandit._id,
            rating: numericRating,
            comment: comment ? comment.trim() : "",
            userName: booking.userName || booking.user.fullName || "Verified Devotee",
            serviceName: booking.serviceName
        });

        // Mark Booking as rated
        booking.isRated = true;
        booking.review = review._id;
        await booking.save();

        // Recalculate Pandit's rating average and count
        const allReviews = await Review.find({ pandit: booking.pandit._id });
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const count = allReviews.length;
        const average = Number((totalRating / count).toFixed(1));

        const pandit = await Pandit.findById(booking.pandit._id);
        if (pandit) {
            pandit.rating = { average, count };
            await pandit.save();
        }

        return res.status(200).json({
            message: "Thank you for your rating & review! 🙏",
            review,
            booking
        });
    } catch (error) {
        console.error("submitBookingReview error:", error);
        return res.status(500).json({ message: "Error submitting review." });
    }
};

export const acceptBooking = async (req, res) => {
    req.body = { status: "accepted" };
    return updateBookingStatus(req, res);
};

export const rejectBooking = async (req, res) => {
    req.body = { status: "rejected" };
    return updateBookingStatus(req, res);
};

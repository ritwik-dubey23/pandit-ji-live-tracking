import { Server } from "socket.io";
import Booking from "./models/booking.model.js";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                // Allow requests with no origin (like mobile apps or curl) or any allowed domain
                return callback(null, true);
            },
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`[SOCKET SERVER] connection: ${socket.id}`);

        socket.on("join_user_room", (userId) => {
            if (userId) {
                const room = `user_${userId}`;
                socket.join(room);
                console.log(`[SOCKET SERVER] user joined: ${room}`);
            }
        });

        socket.on("join_pandit_room", (panditUserId) => {
            if (panditUserId) {
                const room = `pandit_${panditUserId}`;
                socket.join(room);
                console.log(`[SOCKET SERVER] pandit joined: ${room}`);
            }
        });

        socket.on("join_booking_room", (bookingId) => {
            if (bookingId) {
                const room = `booking_${bookingId}`;
                socket.join(room);
                console.log(`[SOCKET SERVER] booking room joined: ${room}`);
            }
        });

        // Real-Time Pandit GPS Location Handler
        socket.on("update_pandit_location", async (data) => {
            try {
                const { bookingId, lat, lng, latitude, longitude } = data;
                const pLat = lat !== undefined ? Number(lat) : Number(latitude);
                const pLng = lng !== undefined ? Number(lng) : Number(longitude);

                if (!bookingId || isNaN(pLat) || isNaN(pLng)) return;

                console.log(`[SOCKET SERVER] location update received for booking_${bookingId}: lat=${pLat}, lng=${pLng}`);

                const booking = await Booking.findById(bookingId);
                if (!booking) return;

                booking.panditLocation = { latitude: pLat, longitude: pLng };

                // Haversine distance calculation
                const lat1 = booking.userLocation?.latitude || 22.7196;
                const lon1 = booking.userLocation?.longitude || 75.8577;
                const lat2 = pLat;
                const lon2 = pLng;

                const R = 6371; // Earth radius in KM
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLon = (lon2 - lon1) * Math.PI / 180;
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distance = Number((R * c).toFixed(2));
                const eta = Math.max(1, Math.ceil(distance * 3));

                booking.distanceKm = distance;
                booking.etaMinutes = eta;
                await booking.save();

                const locationPayload = {
                    bookingId,
                    userLocation: booking.userLocation,
                    panditLocation: booking.panditLocation,
                    lat: pLat,
                    lng: pLng,
                    distanceKm: distance,
                    etaMinutes: eta,
                    updatedBy: "pandit"
                };

                console.log(`[SOCKET SERVER] location update broadcast to booking_${bookingId}`);
                io.to(`booking_${bookingId}`).emit("pandit_location_updated", locationPayload);
                io.to(`booking_${bookingId}`).emit("booking_location_updated", locationPayload);
                if (booking.user) io.to(`user_${booking.user.toString()}`).emit("pandit_location_updated", locationPayload);
            } catch (err) {
                console.error("[SOCKET SERVER ERROR] Error in update_pandit_location:", err.message);
            }
        });

        // Universal Real-Time Location Handler
        socket.on("update_live_location", async (data) => {
            try {
                const { bookingId, role, latitude, longitude, lat, lng } = data;
                const uLat = latitude !== undefined ? Number(latitude) : Number(lat);
                const uLng = longitude !== undefined ? Number(longitude) : Number(lng);

                if (!bookingId || isNaN(uLat) || isNaN(uLng)) return;

                const booking = await Booking.findById(bookingId);
                if (!booking) return;

                if (role === "pandit") {
                    booking.panditLocation = { latitude: uLat, longitude: uLng };
                } else {
                    booking.userLocation = { latitude: uLat, longitude: uLng };
                }

                const lat1 = booking.userLocation?.latitude || 22.7196;
                const lon1 = booking.userLocation?.longitude || 75.8577;
                const lat2 = booking.panditLocation?.latitude || 22.7296;
                const lon2 = booking.panditLocation?.longitude || 75.8677;

                const R = 6371;
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLon = (lon2 - lon1) * Math.PI / 180;
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distance = Number((R * c).toFixed(2));
                const eta = Math.max(1, Math.ceil(distance * 3));

                booking.distanceKm = distance;
                booking.etaMinutes = eta;
                await booking.save();

                const locationPayload = {
                    bookingId,
                    userLocation: booking.userLocation,
                    panditLocation: booking.panditLocation,
                    distanceKm: distance,
                    etaMinutes: eta,
                    updatedBy: role
                };

                io.to(`booking_${bookingId}`).emit("pandit_location_updated", locationPayload);
                io.to(`booking_${bookingId}`).emit("booking_location_updated", locationPayload);
                if (booking.user) io.to(`user_${booking.user.toString()}`).emit("pandit_location_updated", locationPayload);
            } catch (err) {
                console.error("Error in update_live_location:", err.message);
            }
        });

        // Real-Time In-App Chat Messaging Handler (Chat messages belong strictly inside Tracking Modal Chat)
        socket.on("send_chat_message", async (data) => {
            try {
                const { bookingId, text, senderRole, recipientId } = data;
                if (!bookingId || !text) return;

                const messagePayload = {
                    id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
                    bookingId,
                    text,
                    senderRole,
                    createdAt: new Date().toISOString()
                };

                console.log(`[SOCKET SERVER] Chat message for booking_${bookingId}: ${text}`);
                io.to(`booking_${bookingId}`).emit("receive_chat_message", messagePayload);

                if (recipientId) {
                    io.to(`user_${recipientId}`).emit("receive_chat_message", messagePayload);
                    io.to(`pandit_${recipientId}`).emit("receive_chat_message", messagePayload);
                }

                // Broadcast to DB-associated user and pandit rooms to guarantee instant delivery
                const booking = await Booking.findById(bookingId).populate("pandit");
                if (booking) {
                    if (booking.user) {
                        io.to(`user_${booking.user.toString()}`).emit("receive_chat_message", messagePayload);
                    }
                    if (booking.pandit?.user) {
                        const pUserId = booking.pandit.user.toString();
                        io.to(`pandit_${pUserId}`).emit("receive_chat_message", messagePayload);
                        io.to(`user_${pUserId}`).emit("receive_chat_message", messagePayload);
                    }
                    if (booking.pandit?._id) {
                        io.to(`pandit_${booking.pandit._id.toString()}`).emit("receive_chat_message", messagePayload);
                    }
                }
            } catch (err) {
                console.error("Error in send_chat_message:", err.message);
            }
        });

        socket.on("disconnect", () => {
            console.log(`[SOCKET DISCONNECTED] Socket ID: ${socket.id}`);
        });
    });

    return io;
};

export const getIo = () => {
    if (!io) {
        throw new Error("Socket.io is not initialized!");
    }
    return io;
};

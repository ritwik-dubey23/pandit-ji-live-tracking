import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { socket } from "../socket";
import { setNotifications, addNotification, setArrivalPopup } from "../redux/userSlice";
import { playNotificationSound, playPanditArrivedSound } from "../utils/audio";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

export default function useNotifications() {
    const dispatch = useDispatch();
    const { userData, soundEnabled } = useSelector(state => state.user);

    // 1. Fetch initial persisted notifications from backend
    useEffect(() => {
        if (!userData?._id) return;

        const fetchNotifications = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/notifications`, { withCredentials: true });
                dispatch(setNotifications({
                    notifications: res.data.notifications || [],
                    unreadCount: res.data.unreadCount || 0
                }));
            } catch (err) {
                console.error("Error fetching notifications:", err.message);
            }
        };

        fetchNotifications();
    }, [userData?._id, dispatch]);

    // 2. Real-Time Socket.IO Listener for Incoming Notifications & Reconnection
    useEffect(() => {
        if (!userData?._id) return;

        const userId = userData._id;
        const joinRooms = () => {
            socket.emit("join_user_room", userId);
            if (userData.role === "pandit") {
                socket.emit("join_pandit_room", userId);
            }
        };

        joinRooms();

        const handleNewNotification = (notif) => {
            console.log("[SOCKET RECEIVED NEW NOTIFICATION]", notif);
            if (!notif) return;

            dispatch(addNotification(notif));

            const isReached = notif.type === "booking_reached" || notif.data?.status === "reached";

            if (isReached) {
                playPanditArrivedSound(notif.bookingId || notif._id);
                dispatch(setArrivalPopup({
                    title: notif.title || "Pandit Ji Reached Venue! 🙏",
                    message: notif.message || "Pandit Ji has reached your venue location.",
                    bookingId: notif.bookingId || notif.data?.bookingId
                }));
            } else if (soundEnabled) {
                playNotificationSound(notif._id);
            }
        };

        socket.on("connect", joinRooms);
        socket.on("new_notification", handleNewNotification);

        return () => {
            socket.off("connect", joinRooms);
            socket.off("new_notification", handleNewNotification);
        };
    }, [userData?._id, userData?.role, soundEnabled, dispatch]);
}


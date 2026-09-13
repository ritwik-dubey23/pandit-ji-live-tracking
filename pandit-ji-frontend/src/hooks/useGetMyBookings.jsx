import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMyBookings, updateBookingStatusInState } from "../redux/userSlice";
import { socket } from "../socket";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

const useGetMyBookings = () => {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
        if (!userData || userData.role !== "user") return;

        // Join Socket User Room
        console.log(`[SOCKET CLIENT] joining user room: user_${userData._id}`);
        socket.emit("join_user_room", userData._id);

        const fetchBookings = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/booking/user-bookings`, { withCredentials: true });
                dispatch(setMyBookings(res.data));
            } catch (error) {
                console.error("Error fetching user bookings:", error);
            }
        };

        fetchBookings();

        // Socket listener for live status updates
        const handleStatusUpdate = (updatedBooking) => {
            console.log("[SOCKET RECEIVED] booking_status_updated:", updatedBooking);
            dispatch(updateBookingStatusInState(updatedBooking));
        };

        socket.on("booking_status_updated", handleStatusUpdate);

        return () => {
            socket.off("booking_status_updated", handleStatusUpdate);
        };
    }, [dispatch, userData]);
};

export default useGetMyBookings;

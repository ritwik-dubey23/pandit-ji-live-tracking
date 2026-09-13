import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMyPanditProfile, setPanditBookings, addPanditBooking, updatePanditBookingStatusInState } from "../redux/panditSlice";
import { socket } from "../socket";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

const useGetPanditBookings = () => {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    useEffect(() => {
        if (!userData || userData.role !== "pandit") return;

        // Join Socket Pandit Room
        console.log(`[SOCKET CLIENT] joining pandit room: pandit_${userData._id}`);
        socket.emit("join_pandit_room", userData._id);

        const fetchPanditData = async () => {
            try {
                // Fetch profile
                const profRes = await axios.get(`${serverUrl}/api/pandit/my-profile`, { withCredentials: true });
                dispatch(setMyPanditProfile(profRes.data));

                // Fetch bookings
                const bookRes = await axios.get(`${serverUrl}/api/booking/pandit-bookings`, { withCredentials: true });
                dispatch(setPanditBookings(bookRes.data));
            } catch (error) {
                console.error("Error fetching pandit data:", error);
            }
        };

        fetchPanditData();

        // Socket listeners
        const handleNewBooking = (newBooking) => {
            console.log("[SOCKET RECEIVED] new_booking:", newBooking);
            dispatch(addPanditBooking(newBooking));
        };

        const handleStatusUpdate = (updatedBooking) => {
            console.log("[SOCKET RECEIVED] booking_status_updated:", updatedBooking);
            dispatch(updatePanditBookingStatusInState(updatedBooking));
        };

        socket.on("new_booking", handleNewBooking);
        socket.on("booking_status_updated", handleStatusUpdate);

        return () => {
            socket.off("new_booking", handleNewBooking);
            socket.off("booking_status_updated", handleStatusUpdate);
        };
    }, [dispatch, userData]);
};

export default useGetPanditBookings;

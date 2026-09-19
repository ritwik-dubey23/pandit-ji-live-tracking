import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMyBookings, updateBookingStatusInState, setArrivalPopup } from "../redux/userSlice";
import { playPanditArrivedSound } from "../utils/audio";
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

                if (Array.isArray(res.data)) {
                    const unconfirmedReached = res.data.find(b =>
                        (b.status === "reached" || b.status === "started") && !b.userArrivalConfirmed
                    );
                    if (unconfirmedReached) {
                        // DO NOT PLAY SOUND ON FETCH/PAGE LOAD/REFRESH (Sound plays ONLY on live socket event)
                        dispatch(setArrivalPopup({
                            title: "Pandit Ji Reached Venue! 🙏",
                            message: `${unconfirmedReached.pandit?.name || 'Pandit Ji'} has reached your venue location. Please confirm arrival.`,
                            bookingId: unconfirmedReached._id,
                            booking: unconfirmedReached
                        }));
                    }
                }
            } catch (error) {
                console.error("Error fetching user bookings:", error);
            }
        };

        fetchBookings();

        // Socket listener for live status updates
        const handleStatusUpdate = (updatedBooking) => {
            console.log("[SOCKET RECEIVED] booking_status_updated:", updatedBooking);
            dispatch(updateBookingStatusInState(updatedBooking));

            if (updatedBooking?.status === "reached" && !updatedBooking?.userArrivalConfirmed) {
                playPanditArrivedSound(updatedBooking._id);
                dispatch(setArrivalPopup({
                    title: "Pandit Ji Reached Venue! 🙏",
                    message: `${updatedBooking.pandit?.name || 'Pandit Ji'} has reached your venue location.`,
                    bookingId: updatedBooking._id,
                    booking: updatedBooking
                }));
            }
        };

        socket.on("booking_status_updated", handleStatusUpdate);

        return () => {
            socket.off("booking_status_updated", handleStatusUpdate);
        };
    }, [dispatch, userData]);
};

export default useGetMyBookings;

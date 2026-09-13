import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateBookingStatusInState } from '../redux/userSlice';
import LiveTrackingModal from './LiveTrackingModal';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPrayingHands, FaPhone, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaRoute } from 'react-icons/fa';

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

function UserBookingCard({ booking }) {
    const dispatch = useDispatch();
    const [showTracking, setShowTracking] = useState(false);

    const getStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FaHourglassHalf /> Pending Approval</span>;
            case "accepted":
                return <span className="bg-green-100 text-green-800 border border-green-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FaCheckCircle /> Accepted</span>;
            case "completed":
                return <span className="bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FaCheckCircle /> Completed</span>;
            case "rejected":
                return <span className="bg-red-100 text-red-800 border border-red-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FaTimesCircle /> Rejected</span>;
            case "cancelled":
                return <span className="bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><FaTimesCircle /> Cancelled</span>;
            default:
                return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    const handleCancelBooking = async () => {
        if (!window.confirm("Are you sure you want to cancel this booking request?")) return;
        try {
            const res = await axios.put(`${serverUrl}/api/booking/${booking._id}/status`, { status: "cancelled" }, { withCredentials: true });
            dispatch(updateBookingStatusInState(res.data.booking));
        } catch (error) {
            alert("Error cancelling booking.");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-200">
            <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                    <div>
                        <span className="text-xs font-semibold uppercase text-orange-600 tracking-wider">
                            {booking.bookingType === "instant" ? "⚡ Instant Booking" : "📅 Scheduled Booking"}
                        </span>
                        <h4 className="text-lg font-bold text-gray-900 mt-0.5">{booking.serviceName}</h4>
                    </div>
                    {getStatusBadge(booking.status)}
                </div>

                {/* Pandit Info */}
                <div className="flex items-center gap-3 mt-4 p-3 bg-orange-50/50 rounded-xl">
                    <img
                        src={booking.pandit?.profileImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"}
                        alt={booking.pandit?.name}
                        className="w-12 h-12 rounded-full object-cover border border-orange-200"
                    />
                    <div>
                        <h5 className="text-sm font-bold text-gray-900">{booking.pandit?.name || "Pandit Ji"}</h5>
                        <p className="text-xs text-gray-500">{booking.pandit?.city}, {booking.pandit?.state}</p>
                    </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-2 gap-3 text-xs font-medium text-gray-600 mt-4">
                    <div className="flex items-center gap-1.5 bg-gray-50 p-2 rounded-lg">
                        <FaCalendarAlt className="text-orange-500" />
                        <span>Date: {booking.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 p-2 rounded-lg">
                        <FaClock className="text-orange-500" />
                        <span>Time: {booking.time}</span>
                    </div>
                </div>

                <div className="text-xs font-medium text-gray-600 mt-2 flex items-center gap-1.5 bg-gray-50 p-2 rounded-lg">
                    <FaMapMarkerAlt className="text-orange-500 shrink-0" />
                    <span className="truncate">Venue: {booking.address}</span>
                </div>

                {booking.customRequirement && (
                    <div className="mt-3 bg-amber-50/60 border border-amber-200 p-2.5 rounded-lg text-xs">
                        <strong className="text-amber-900 block font-semibold mb-0.5">Custom Requirement:</strong>
                        <p className="text-amber-800 italic">{booking.customRequirement}</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                    <span className="text-xs text-gray-400 block font-medium">Total Amount</span>
                    <span className="text-lg font-extrabold text-gray-900">₹{booking.totalAmount}</span>
                </div>

                <div className="flex items-center gap-2">
                    {["pending", "accepted", "on_the_way", "arriving", "reached", "started"].includes(booking.status) && (
                        <button
                            onClick={() => setShowTracking(true)}
                            className="px-3.5 py-2 text-xs font-black text-white bg-[#ff4d2d] hover:bg-[#e64323] rounded-xl shadow-md transition duration-150 cursor-pointer flex items-center gap-1.5 min-h-[44px]"
                        >
                            <FaRoute /> TRACK PANDIT LIVE
                        </button>
                    )}

                    {booking.status === "pending" && (
                        <button
                            onClick={handleCancelBooking}
                            className="px-3.5 py-2 text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 rounded-xl transition duration-150 cursor-pointer min-h-[44px]"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {showTracking && (
                <LiveTrackingModal
                    booking={booking}
                    currentUserRole="user"
                    onClose={() => setShowTracking(false)}
                    onStatusUpdated={(up) => dispatch(updateBookingStatusInState(up))}
                />
            )}
        </div>
    );
}

export default UserBookingCard;

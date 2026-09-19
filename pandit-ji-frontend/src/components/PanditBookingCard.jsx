import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updatePanditBookingStatusInState } from '../redux/panditSlice';
import LiveTrackingModal from './LiveTrackingModal';
import { FaCheck, FaTimes, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone, FaUser, FaCheckDouble, FaRoute, FaCompass, FaMapMarkedAlt } from 'react-icons/fa';
import { openGoogleMapsDirections } from '../utils/locationUtils';

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

function PanditBookingCard({ booking }) {
    const dispatch = useDispatch();
    const [showTracking, setShowTracking] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpenGoogleMaps = () => {
        const userLat = booking.userLocation?.latitude;
        const userLng = booking.userLocation?.longitude;
        openGoogleMapsDirections(userLat, userLng, booking.address);
    };

    const handleAccept = async () => {
        try {
            setLoading(true);
            const res = await axios.put(`${serverUrl}/api/booking/accept/${booking._id}`, {}, { withCredentials: true });
            dispatch(updatePanditBookingStatusInState(res.data.booking));
            setLoading(false);
            setShowTracking(true); // Automatically unlock/switch to live route tracking
        } catch (error) {
            setLoading(false);
            alert("Failed to accept booking request.");
        }
    };

    const handleReject = async () => {
        try {
            setLoading(true);
            const res = await axios.put(`${serverUrl}/api/booking/reject/${booking._id}`, {}, { withCredentials: true });
            dispatch(updatePanditBookingStatusInState(res.data.booking));
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert("Failed to reject booking request.");
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            setLoading(true);
            const res = await axios.put(`${serverUrl}/api/booking/${booking._id}/status`, { status: newStatus }, { withCredentials: true });
            dispatch(updatePanditBookingStatusInState(res.data.booking));
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert(`Failed to update status to ${newStatus}`);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-3.5 sm:p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-200">
            <div>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-gray-100 pb-3 sm:pb-4">
                    <div>
                        <span className="text-[10px] sm:text-[11px] font-black uppercase text-[#ff4d2d] tracking-wider bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 inline-block">
                            {booking.bookingType === "instant" ? "⚡ INSTANT REQUEST" : "📅 SCHEDULED REQUEST"}
                        </span>
                        <h4 className="text-lg sm:text-xl font-extrabold text-gray-900 mt-1.5">{booking.serviceName}</h4>
                    </div>

                    <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-black capitalize shadow-xs ${
                        booking.status === 'pending' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        booking.status === 'accepted' ? 'bg-green-100 text-green-900 border border-green-300' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                        'bg-red-100 text-red-900 border border-red-300'
                    }`}>
                        {booking.status}
                    </span>
                </div>

                {/* User Details & Exact Address */}
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-2">
                    <p className="text-xs sm:text-sm font-black text-gray-900 flex items-center gap-2">
                        <FaUser className="text-[#ff4d2d] shrink-0" /> {booking.userName}
                    </p>
                    <p className="text-xs font-bold text-gray-700 flex items-center gap-2">
                        <FaPhone className="text-[#ff4d2d] shrink-0" /> <a href={`tel:${booking.userMobile}`} className="hover:underline">{booking.userMobile}</a>
                    </p>
                    <div className="text-xs font-semibold text-gray-700 flex items-start gap-2 pt-1 border-t border-orange-100/60">
                        <FaMapMarkerAlt className="text-[#ff4d2d] mt-0.5 shrink-0" size={14} />
                        <div>
                            <span className="font-extrabold text-gray-900 block">User's Exact Address:</span>
                            <span className="text-gray-700 break-words">{booking.address}</span>
                        </div>
                    </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs font-bold text-gray-700 mt-3 sm:mt-4">
                    <div className="bg-amber-50/80 p-2.5 sm:p-3 rounded-xl flex items-center gap-2 border border-amber-100 truncate">
                        <FaCalendarAlt className="text-amber-700 shrink-0" size={15} />
                        <div className="truncate">
                            <span className="text-[9px] sm:text-[10px] text-gray-400 block font-bold uppercase">Date</span>
                            <span className="truncate">{booking.date}</span>
                        </div>
                    </div>
                    <div className="bg-amber-50/80 p-2.5 sm:p-3 rounded-xl flex items-center gap-2 border border-amber-100 truncate">
                        <FaClock className="text-amber-700 shrink-0" size={15} />
                        <div className="truncate">
                            <span className="text-[9px] sm:text-[10px] text-gray-400 block font-bold uppercase">Time</span>
                            <span className="truncate">{booking.time}</span>
                        </div>
                    </div>
                </div>

                {booking.customRequirement && (
                    <div className="mt-3 bg-amber-50 border border-amber-200 p-2.5 sm:p-3 rounded-xl text-xs">
                        <strong className="text-amber-900 block font-bold mb-0.5">User Requirement:</strong>
                        <p className="text-amber-800 break-words">{booking.customRequirement}</p>
                    </div>
                )}
            </div>

            {/* Actions & Navigation Button */}
            <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center justify-between sm:block">
                    <span className="text-[10px] sm:text-xs text-gray-400 block font-bold uppercase">Dakshina / Earnings</span>
                    <span className="text-xl sm:text-2xl font-black text-gray-900">₹{booking.totalAmount}</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* EXPLICIT ACCEPT & REJECT BUTTONS FOR PENDING BOOKINGS */}
                    {booking.status === "pending" && (
                        <>
                            <button
                                onClick={handleReject}
                                disabled={loading}
                                className="px-4 py-2.5 text-xs font-black text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition duration-150 cursor-pointer flex items-center gap-1.5 min-h-[44px]"
                            >
                                <FaTimes size={14} /> Reject Request
                            </button>
                            <button
                                onClick={handleAccept}
                                disabled={loading}
                                className="px-5 py-2.5 text-xs font-black text-white bg-green-600 hover:bg-green-700 shadow-md rounded-xl transition duration-150 cursor-pointer flex items-center gap-1.5 min-h-[44px]"
                            >
                                <FaCheck size={14} /> Accept Request
                            </button>
                        </>
                    )}

                    {/* NAVIGATE / VIEW USER LOCATION & COMPLETE ACTIONS */}
                    {booking.status === "accepted" && (
                        <>
                            <button
                                onClick={() => setShowTracking(true)}
                                className="px-3.5 py-2.5 text-xs font-black text-white bg-[#ff4d2d] hover:bg-[#e64323] shadow-md rounded-xl transition duration-150 cursor-pointer flex items-center gap-1.5 min-h-[44px]"
                            >
                                <FaCompass size={14} /> Live Map
                            </button>
                            <button
                                onClick={handleOpenGoogleMaps}
                                className="px-3.5 py-2.5 text-xs font-black text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-xl transition duration-150 cursor-pointer flex items-center gap-1.5 min-h-[44px]"
                                title="Open in Google Maps"
                            >
                                <FaMapMarkedAlt size={14} /> 🗺️ Google Maps
                            </button>
                            <button
                                onClick={() => handleUpdateStatus("completed")}
                                disabled={loading || !booking.userArrivalConfirmed}
                                title={!booking.userArrivalConfirmed ? "Waiting for user to confirm arrival" : "Mark ceremony as completed"}
                                className={`px-3.5 py-2.5 text-xs font-black rounded-xl transition duration-150 flex items-center gap-1.5 min-h-[44px] ${
                                    !booking.userArrivalConfirmed
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300 shadow-none"
                                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer"
                                }`}
                            >
                                <FaCheckDouble size={14} /> {!booking.userArrivalConfirmed ? "🔒 Mark Completed" : "Mark Completed"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {showTracking && (
                <LiveTrackingModal
                    booking={booking}
                    currentUserRole="pandit"
                    onClose={() => setShowTracking(false)}
                    onStatusUpdated={(up) => dispatch(updatePanditBookingStatusInState(up))}
                />
            )}
        </div>
    );
}

export default PanditBookingCard;

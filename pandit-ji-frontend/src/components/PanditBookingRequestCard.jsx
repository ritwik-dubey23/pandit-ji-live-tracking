import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updatePanditBookingStatusInState } from '../redux/panditSlice';
import { FaCheck, FaTimes, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaPhone, FaBolt, FaExclamationCircle } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

function PanditBookingRequestCard({ booking, onAcceptSuccess }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleAccept = async () => {
        try {
            setLoading(true);
            const res = await axios.post(`${serverUrl}/api/booking/accept/${booking._id}`, {}, { withCredentials: true });
            dispatch(updatePanditBookingStatusInState(res.data.booking));
            setLoading(false);
            if (onAcceptSuccess) onAcceptSuccess(res.data.booking);
        } catch (error) {
            setLoading(false);
            alert("Failed to accept booking request.");
        }
    };

    const handleReject = async () => {
        try {
            setLoading(true);
            const res = await axios.post(`${serverUrl}/api/booking/reject/${booking._id}`, {}, { withCredentials: true });
            dispatch(updatePanditBookingStatusInState(res.data.booking));
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert("Failed to decline booking request.");
        }
    };

    const isInstant = booking.bookingType === "instant";

    return (
        <div className="bg-white rounded-3xl shadow-xl border-2 border-orange-200 p-5 sm:p-6 flex flex-col justify-between hover:shadow-2xl transition-all duration-200">
            <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-orange-100 pb-3">
                    {booking.bhojanSeva || booking.serviceName?.toLowerCase().includes("bhojan") ? (
                        <span className="bg-orange-600 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                            🍚 BHOJAN SEVA REQUEST ({booking.numberOfPeople || 1} Guests)
                        </span>
                    ) : (
                        <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 ${
                            isInstant
                                ? "bg-red-500 text-white shadow-xs"
                                : "bg-amber-100 text-amber-900 border border-amber-300"
                        }`}>
                            {isInstant ? <FaBolt className="animate-pulse" /> : <FaCalendarAlt />}
                            {isInstant ? "🔔 NEW INSTANT REQUEST" : "📅 SCHEDULED REQUEST"}
                        </span>
                    )}

                    <span className="text-xl font-black text-gray-900">₹{booking.totalAmount}</span>
                </div>

                {/* Service Name & Customer Details */}
                <div className="mt-4">
                    <h3 className="text-xl font-black text-gray-900">{booking.serviceName}</h3>
                    
                    <div className="mt-3 p-4 bg-orange-50/70 rounded-2xl border border-orange-100 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-extrabold text-gray-800">
                            <span className="flex items-center gap-2">
                                <FaUser className="text-[#ff4d2d]" /> {booking.userName}
                            </span>
                            <a href={`tel:${booking.userMobile}`} className="flex items-center gap-1 text-[#ff4d2d] hover:underline">
                                <FaPhone /> {booking.userMobile}
                            </a>
                        </div>

                        <div className="flex items-start gap-2 text-xs text-gray-700 pt-2 border-t border-orange-200/50">
                            <FaMapMarkerAlt className="text-[#ff4d2d] mt-0.5 shrink-0" size={15} />
                            <div>
                                <span className="font-extrabold text-gray-900 block">Customer Address:</span>
                                <span className="font-semibold text-gray-700">{booking.address}</span>
                            </div>
                        </div>

                        {/* Distance & Estimated Arrival */}
                        <div className="grid grid-cols-2 gap-2 text-xs font-bold text-gray-700 pt-2">
                            <div className="bg-white p-2 rounded-xl border border-orange-100 text-center">
                                <span className="text-[10px] text-gray-400 block uppercase">Distance</span>
                                <span className="text-gray-900">{booking.distanceKm || 2.4} km</span>
                            </div>
                            <div className="bg-white p-2 rounded-xl border border-orange-100 text-center">
                                <span className="text-[10px] text-gray-400 block uppercase">Est. Arrival</span>
                                <span className="text-gray-900">~{booking.etaMinutes || 8} mins</span>
                            </div>
                        </div>
                    </div>
                </div>

                {booking.customRequirement && (
                    <div className="mt-3 bg-amber-50 border border-amber-200 p-3 rounded-2xl text-xs">
                        <span className="font-bold text-amber-900 flex items-center gap-1 mb-0.5">
                            <FaExclamationCircle /> Requirements:
                        </span>
                        <p className="text-amber-800 font-semibold">{booking.customRequirement}</p>
                    </div>
                )}
            </div>

            {/* ACTION BUTTONS: Explicit Accept (Green) and Decline (Red Outline) */}
            <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={handleReject}
                    disabled={loading}
                    className="py-3 px-4 rounded-2xl text-xs font-black text-red-600 bg-red-50 hover:bg-red-100 border-2 border-red-200 transition duration-150 cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
                >
                    {loading ? <ClipLoader size={16} color="#dc2626" /> : (
                        <>
                            <FaTimes size={14} /> DECLINE
                        </>
                    )}
                </button>

                <button
                    type="button"
                    onClick={handleAccept}
                    disabled={loading}
                    className="py-3 px-4 rounded-2xl text-xs font-black text-white bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition duration-150 cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
                >
                    {loading ? <ClipLoader size={16} color="#fff" /> : (
                        <>
                            <FaCheck size={14} /> ACCEPT REQUEST
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default PanditBookingRequestCard;

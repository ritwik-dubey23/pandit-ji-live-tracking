import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updatePanditBookingStatusInState } from '../redux/panditSlice';
import { socket } from '../socket';
import { FaPhone, FaMapMarkerAlt, FaUser, FaRoute, FaCheckDouble, FaCompass, FaChevronRight } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

function PanditActiveBookingCard({ booking, onViewMap }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const watchIdRef = useRef(null);

    const statusSteps = [
        { id: "accepted", label: "Accepted" },
        { id: "on_the_way", label: "On The Way" },
        { id: "arriving", label: "Arriving Soon" },
        { id: "reached", label: "Reached Location" },
        { id: "started", label: "Pooja Started" },
        { id: "completed", label: "Completed" }
    ];

    const currentStatus = booking.status || "accepted";
    const currentStepIndex = statusSteps.findIndex(s => s.id === currentStatus);

    // GPS Location Watcher with clearWatch Cleanup Rule
    useEffect(() => {
        const isEnded = ["completed", "cancelled", "rejected"].includes(currentStatus);

        if (isEnded) {
            if (watchIdRef.current !== null) {
                console.log(`[GPS] Clearing watchId ${watchIdRef.current} (Booking ended as ${currentStatus})`);
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
            return;
        }

        if (navigator.geolocation && watchIdRef.current === null) {
            console.log(`[GPS] Starting watchPosition for active booking ${booking._id}`);
            watchIdRef.current = navigator.geolocation.watchPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    console.log(`[GPS WATCH] Emitting location stream for booking ${booking._id}: lat=${lat}, lng=${lng}`);
                    socket.emit("update_pandit_location", {
                        bookingId: booking._id,
                        lat,
                        lng
                    });
                },
                (err) => {
                    console.warn("[GPS WATCH WARN]", err.message);
                },
                { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
            );
        }

        return () => {
            if (watchIdRef.current !== null) {
                console.log(`[GPS] Cleaning up watchId ${watchIdRef.current} on unmount`);
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
        };
    }, [booking._id, currentStatus]);

    const handleNextStatus = async (nextStatus) => {
        try {
            setLoading(true);
            const res = await axios.post(`${serverUrl}/api/booking/status/${booking._id}`, { status: nextStatus }, { withCredentials: true });
            dispatch(updatePanditBookingStatusInState(res.data.booking));
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert(error?.response?.data?.message || "Failed to update status.");
        }
    };

    const getNextStep = () => {
        if (currentStepIndex < statusSteps.length - 1) {
            return statusSteps[currentStepIndex + 1];
        }
        return null;
    };

    const nextStep = getNextStep();

    return (
        <div className="bg-white rounded-3xl shadow-xl border-2 border-green-200 p-5 sm:p-6 space-y-5">
            {/* Header Status Bar */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-black uppercase text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                    ACTIVE BOOKING #{booking._id?.slice(-6).toUpperCase()}
                </span>

                <span className="text-xs font-black text-gray-500 uppercase bg-gray-100 px-2.5 py-1 rounded-lg">
                    Status: {currentStatus.replace(/_/g, ' ')}
                </span>
            </div>

            {/* Customer & Service Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-100 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-orange-500 tracking-wider">Customer Details</span>
                    <h4 className="text-lg font-black text-gray-900 flex items-center gap-2">
                        <FaUser className="text-[#ff4d2d]" /> {booking.userName}
                    </h4>
                    <p className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                        <FaPhone className="text-[#ff4d2d]" />
                        <a href={`tel:${booking.userMobile}`} className="text-[#ff4d2d] font-bold hover:underline">
                            {booking.userMobile} (Tap to Call)
                        </a>
                    </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Service & Earnings</span>
                    <h4 className="text-lg font-black text-gray-900">{booking.serviceName}</h4>
                    <p className="text-xs font-bold text-gray-700">Dakshina: ₹{booking.totalAmount}</p>
                </div>
            </div>

            {/* Customer Address */}
            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 flex items-start gap-3">
                <FaMapMarkerAlt className="text-[#ff4d2d] mt-1 shrink-0" size={18} />
                <div>
                    <span className="text-xs font-extrabold text-gray-900 block">Customer Destination Address:</span>
                    <span className="text-xs text-gray-700 font-semibold">{booking.address}</span>
                </div>
            </div>

            {/* Progress Lifecycle Bar */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <span className="text-[11px] font-bold uppercase text-gray-500 block mb-2">Booking Progress:</span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    {statusSteps.map((step, idx) => {
                        const isDone = idx <= currentStepIndex;
                        return (
                            <div key={step.id} className="flex items-center gap-1.5 shrink-0">
                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${
                                    isDone ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"
                                }`}>
                                    {isDone ? "✓" : idx + 1} {step.label}
                                </span>
                                {idx < statusSteps.length - 1 && <span className="text-gray-300">➔</span>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Action Buttons: Next Status & Navigation */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={onViewMap}
                    className="py-3 px-4 rounded-2xl text-xs font-black text-[#ff4d2d] bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 transition duration-150 cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
                >
                    <FaCompass size={16} /> VIEW LIVE MAP ROUTE
                </button>

                {nextStep ? (
                    <button
                        type="button"
                        onClick={() => handleNextStatus(nextStep.id)}
                        disabled={loading}
                        className="py-3 px-4 rounded-2xl text-xs font-black text-white bg-green-600 hover:bg-green-700 shadow-md transition duration-150 cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
                    >
                        {loading ? <ClipLoader size={16} color="#fff" /> : (
                            <>
                                MARK AS: {nextStep.label.toUpperCase()} <FaChevronRight />
                            </>
                        )}
                    </button>
                ) : (
                    <div className="py-3 px-4 rounded-2xl text-xs font-black text-center text-green-800 bg-green-100 border border-green-300 flex items-center justify-center gap-1">
                        <FaCheckDouble /> BOOKING COMPLETED
                    </div>
                )}
            </div>
        </div>
    );
}

export default PanditActiveBookingCard;

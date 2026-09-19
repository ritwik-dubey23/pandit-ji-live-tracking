import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearArrivalPopup } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { IoLocationSharp, IoCheckmarkCircle } from "react-icons/io5";
import { stopRepeatingArrivalSound } from "../utils/audio";

export default function ArrivalNotificationToast() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { arrivalPopup } = useSelector((state) => state.user);

    if (!arrivalPopup) return null;

    const handleConfirmArrival = () => {
        console.log("[ARRIVAL CONFIRMED BY USER]");
        stopRepeatingArrivalSound();
        dispatch(clearArrivalPopup());
        if (arrivalPopup.bookingId) {
            navigate("/my-bookings");
        }
    };

    return (
        <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-orange-500 text-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-orange-200 space-y-5 text-center animate-bounce-short">
                <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/40 shadow-inner">
                    <IoLocationSharp size={44} className="text-yellow-300 animate-pulse" />
                </div>

                <div>
                    <span className="bg-white/20 text-yellow-200 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border border-white/30">
                        📍 Arrival Notification
                    </span>
                    <h2 className="text-2xl font-black text-white mt-3 leading-tight drop-shadow-md">
                        Pandit Ji Has Arrived!
                    </h2>
                    <p className="text-sm text-orange-100 mt-2 font-medium leading-relaxed">
                        {arrivalPopup.message || "Pandit Ji has arrived at your location. Please confirm that Pandit Ji has actually reached your venue."}
                    </p>
                </div>

                <div className="p-3 bg-black/20 rounded-2xl border border-white/20 text-xs font-semibold text-orange-100">
                    🔊 Repeating voice alert will continue until you confirm arrival.
                </div>

                <div className="pt-2">
                    <button
                        type="button"
                        onClick={handleConfirmArrival}
                        className="w-full py-3.5 bg-white text-orange-600 hover:bg-orange-50 font-black text-base rounded-2xl shadow-xl transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                        <IoCheckmarkCircle size={22} className="text-green-600" />
                        <span>✓ Confirm Arrival</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

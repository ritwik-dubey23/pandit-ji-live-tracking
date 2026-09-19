import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearArrivalPopup } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { IoLocationSharp, IoClose } from "react-icons/io5";

export default function ArrivalNotificationToast() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { arrivalPopup } = useSelector((state) => state.user);

    useEffect(() => {
        if (arrivalPopup) {
            const timer = setTimeout(() => {
                dispatch(clearArrivalPopup());
            }, 12000); // Auto-hide after 12 seconds
            return () => clearTimeout(timer);
        }
    }, [arrivalPopup, dispatch]);

    if (!arrivalPopup) return null;

    return (
        <div className="fixed top-[90px] right-4 left-4 sm:left-auto sm:right-6 sm:w-96 z-[999999] bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white p-4 rounded-2xl shadow-2xl border-2 border-orange-200 flex flex-col gap-2.5 transform transition-all duration-300 ease-out animate-bounce-short">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center shrink-0 text-white font-extrabold text-xl shadow-inner border border-white/30">
                        <IoLocationSharp size={26} className="text-yellow-300 animate-pulse" />
                    </div>
                    <div>
                        <h4 className="font-black text-sm sm:text-base leading-snug text-yellow-100">
                            {arrivalPopup.title || "Pandit Ji Reached Venue! 🙏"}
                        </h4>
                        <p className="text-xs sm:text-sm text-orange-50 mt-0.5 leading-snug font-medium">
                            {arrivalPopup.message || "Pandit Ji has arrived at your location."}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => dispatch(clearArrivalPopup())}
                    className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors shrink-0 cursor-pointer"
                    aria-label="Close notification"
                >
                    <IoClose size={22} />
                </button>
            </div>

            <div className="flex items-center justify-end gap-2 mt-0.5">
                <button
                    onClick={() => {
                        dispatch(clearArrivalPopup());
                        navigate("/my-bookings");
                    }}
                    className="px-4 py-1.5 bg-white text-orange-600 font-extrabold text-xs rounded-xl hover:bg-orange-50 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                    View Status
                </button>
            </div>
        </div>
    );
}

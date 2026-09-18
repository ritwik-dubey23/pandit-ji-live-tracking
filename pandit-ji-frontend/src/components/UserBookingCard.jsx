import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateBookingStatusInState } from '../redux/userSlice';
import LiveTrackingModal from './LiveTrackingModal';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPrayingHands, FaPhone, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaRoute, FaStar, FaRegStar } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

function UserBookingCard({ booking }) {
    const dispatch = useDispatch();
    const [showTracking, setShowTracking] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedRating, setSelectedRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [submittingRating, setSubmittingRating] = useState(false);
    const [ratingErr, setRatingErr] = useState("");

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

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setRatingErr("");
        setSubmittingRating(true);

        try {
            const res = await axios.post(`${serverUrl}/api/booking/${booking._id}/rate`, {
                rating: selectedRating,
                comment: reviewComment
            }, { withCredentials: true });

            dispatch(updateBookingStatusInState(res.data.booking));
            setSubmittingRating(false);
            setShowRatingModal(false);
            alert("Thank you! Your rating and review have been submitted successfully. 🙏");
        } catch (error) {
            setSubmittingRating(false);
            setRatingErr(error?.response?.data?.message || "Failed to submit review.");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-200">
            <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                    <div>
                        <span className="text-xs font-semibold uppercase text-orange-600 tracking-wider">
                            {booking.bhojanSeva ? "🍚 Bhojan Seva Invitation" : (booking.bookingType === "instant" ? "⚡ Instant Booking" : "📅 Scheduled Booking")}
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
                        className="w-12 h-12 rounded-full object-cover overflow-hidden aspect-square border-2 border-orange-300"
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
                        <strong className="text-amber-900 block font-semibold mb-0.5">Requirement / Note:</strong>
                        <p className="text-amber-800 italic">{booking.customRequirement}</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                    <span className="text-xs text-gray-400 block font-medium">Service Charge</span>
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

                    {booking.status === "completed" && (
                        booking.isRated ? (
                            <span className="bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1">
                                <FaStar className="text-amber-500" /> Reviewed
                            </span>
                        ) : (
                            <button
                                onClick={() => setShowRatingModal(true)}
                                className="px-3.5 py-2 text-xs font-black text-amber-950 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-md transition duration-150 cursor-pointer flex items-center gap-1.5 min-h-[44px]"
                            >
                                <FaStar /> RATE PANDIT JI
                            </button>
                        )
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

            {/* Live Tracking Modal */}
            {showTracking && (
                <LiveTrackingModal
                    booking={booking}
                    currentUserRole="user"
                    onClose={() => setShowTracking(false)}
                    onStatusUpdated={(up) => dispatch(updateBookingStatusInState(up))}
                />
            )}

            {/* Rating & Review Modal */}
            {showRatingModal && (
                <div className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-orange-200 shadow-2xl space-y-4 relative">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                            <div>
                                <h3 className="text-lg font-black text-gray-900">Rate Pandit Ji</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Share your feedback for {booking.serviceName}</p>
                            </div>
                            <button
                                onClick={() => setShowRatingModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            {/* Star Selector */}
                            <div className="flex flex-col items-center justify-center py-2 bg-orange-50/50 rounded-2xl border border-orange-100">
                                <span className="text-xs font-extrabold text-gray-700 mb-2">Select Star Rating</span>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setSelectedRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="p-1 cursor-pointer transition transform hover:scale-125"
                                        >
                                            {star <= (hoverRating || selectedRating) ? (
                                                <FaStar className="text-amber-500 text-3xl drop-shadow-xs" />
                                            ) : (
                                                <FaRegStar className="text-gray-300 text-3xl" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-amber-700 mt-2">
                                    {selectedRating === 5 ? "⭐⭐⭐⭐⭐ Outstanding Experience" :
                                     selectedRating === 4 ? "⭐⭐⭐⭐ Very Good Service" :
                                     selectedRating === 3 ? "⭐⭐⭐ Good Ceremony" :
                                     selectedRating === 2 ? "⭐⭐ Satisfactory" : "⭐ Poor Experience"}
                                </span>
                            </div>

                            {/* Comment Text Area */}
                            <div>
                                <label className="block text-xs font-extrabold text-gray-700 mb-1">
                                    Write a Review / Feedback (Optional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Write about the ritual expertise, punctuality, and Vedic chants..."
                                    className="w-full border border-gray-300 rounded-xl p-3 text-xs font-medium outline-none focus:border-[#ff4d2d]"
                                />
                            </div>

                            {ratingErr && (
                                <p className="text-xs font-bold text-red-600 text-center bg-red-50 p-2 rounded-xl border border-red-200">
                                    ⚠️ {ratingErr}
                                </p>
                            )}

                            <div className="flex gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setShowRatingModal(false)}
                                    className="w-1/2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl min-h-[44px] cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingRating}
                                    className="w-1/2 py-3 bg-[#ff4d2d] hover:bg-[#e64323] text-white text-xs font-black rounded-xl shadow-md min-h-[44px] cursor-pointer flex items-center justify-center"
                                >
                                    {submittingRating ? <ClipLoader size={16} color="#fff" /> : "Submit Review"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserBookingCard;

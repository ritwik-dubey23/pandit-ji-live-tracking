import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import UserBookingCard from '../components/UserBookingCard';
import LiveTrackingModal from '../components/LiveTrackingModal';
import useGetMyBookings from '../hooks/useGetMyBookings';
import { FaCalendarAlt, FaHands } from 'react-icons/fa';

function MyBookings() {
    useGetMyBookings();
    const locationState = useLocation();

    const { myBookings } = useSelector(state => state.user);
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedBookingForTracking, setSelectedBookingForTracking] = useState(null);

    const targetBookingId = locationState.state?.bookingId;

    useEffect(() => {
        if (targetBookingId && myBookings && myBookings.length > 0) {
            const found = myBookings.find(b => b._id === targetBookingId);
            if (found) {
                setSelectedBookingForTracking(found);
            }
        }
    }, [targetBookingId, myBookings]);

    const filteredBookings = myBookings.filter(b => {
        if (statusFilter === "all") return true;
        return b.status === statusFilter;
    });

    return (
        <div className="min-h-screen bg-[#fff9f9]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-[85px] md:pt-[105px] pb-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-5 mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                            <FaCalendarAlt className="text-orange-500 text-xl sm:text-2xl shrink-0" /> My Pooja Bookings
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Track real-time status updates from Pandit Ji live!</p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto -mx-1 px-1 scrollbar-none">
                        {["all", "pending", "accepted", "completed", "rejected", "cancelled"].map((st) => (
                            <button
                                key={st}
                                onClick={() => setStatusFilter(st)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold capitalize transition cursor-pointer shrink-0 border ${
                                    statusFilter === st
                                        ? "bg-orange-500 text-white border-orange-500 shadow-xs"
                                        : "bg-white text-gray-700 border-gray-200 hover:bg-orange-50/50"
                                }`}
                            >
                                {st} ({myBookings.filter(b => st === "all" ? true : b.status === st).length})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bookings Grid */}
                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-200 shadow-xs max-w-2xl mx-auto my-8 sm:my-12">
                        <FaHands className="mx-auto text-gray-300 text-5xl sm:text-6xl mb-3 sm:mb-4" />
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">No Bookings Found</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">You have not submitted any booking requests for this filter yet.</p>
                    </div>
                ) : (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {filteredBookings.map((booking) => (
                            <UserBookingCard key={booking._id} booking={booking} />
                        ))}
                    </div>
                )}
            </div>

            {selectedBookingForTracking && (
                <LiveTrackingModal
                    booking={selectedBookingForTracking}
                    currentUserRole="user"
                    onClose={() => setSelectedBookingForTracking(null)}
                />
            )}
        </div>
    );
}

export default MyBookings;

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addBooking } from '../redux/userSlice';
import { FaTimes, FaBolt, FaCalendarAlt, FaUser, FaPhone, FaMapMarkerAlt, FaUtensils, FaUsers } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

import useCurrentLocation from '../hooks/useCurrentLocation';

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

function BookingModal({ pandit, initialService, onClose }) {
    const primaryColor = "#ff4d2d";
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userData } = useSelector(state => state.user);
    const { location, loading: locLoading, detectLocation } = useCurrentLocation();

    // Booking Type: 'instant' vs 'scheduled'
    const [bookingType, setBookingType] = useState('scheduled');

    // Predefined Pooja or Custom
    const [selectedService, setSelectedService] = useState(
        initialService ? initialService.name : (pandit?.services?.[0]?.name || "Ganesh Puja")
    );
    const [isCustomPooja, setIsCustomPooja] = useState(false);
    const [customRequirement, setCustomRequirement] = useState('');

    // Schedule details
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [time, setTime] = useState("10:00 AM");

    // Additional options
    const [bhojanSeva, setBhojanSeva] = useState(false);
    const [numberOfPeople, setNumberOfPeople] = useState(10);

    // User details
    const [userName, setUserName] = useState(userData?.fullName || '');
    const [userMobile, setUserMobile] = useState(userData?.mobile || '');
    const [address, setAddress] = useState(userData?.address || location.formattedAddress);

    // Auto-update address state when current location is detected
    React.useEffect(() => {
        if (location?.formattedAddress && (!address || address.includes("Sector 15"))) {
            setAddress(location.formattedAddress);
        }
    }, [location]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Calculate total price
    const currentServiceObj = (pandit?.services || []).find(s => s.name === selectedService);
    let basePrice = currentServiceObj ? currentServiceObj.price : 1100;
    if (isCustomPooja) basePrice = 1500; // base default for custom
    const bhojanAddon = bhojanSeva ? numberOfPeople * 50 : 0;
    const totalAmount = basePrice + bhojanAddon;

    const handleCreateBooking = async (e) => {
        e.preventDefault();
        setError('');

        if (!userData) {
            navigate("/signin");
            return;
        }

        if (!userName.trim() || !userMobile.trim() || !address.trim()) {
            setError("Please fill in your Name, Mobile Number, and Delivery/Puja Address.");
            return;
        }

        if (isCustomPooja && !customRequirement.trim()) {
            setError("Please describe your custom Pooja requirement in the text box.");
            return;
        }

        setLoading(true);
        try {
            let lat = location.lat || 22.7196;
            let lon = location.lng || 75.8577;

            if (navigator.geolocation) {
                try {
                    const pos = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000, enableHighAccuracy: true });
                    });
                    lat = pos.coords.latitude;
                    lon = pos.coords.longitude;
                } catch (geoErr) {
                    console.warn("Using detected location coordinates:", lat, lon);
                }
            }

            const payload = {
                panditId: pandit._id,
                bookingType,
                serviceName: isCustomPooja ? "Custom Pooja Requirement" : selectedService,
                servicePrice: basePrice,
                isCustomPooja,
                customRequirement,
                bhojanSeva,
                numberOfPeople,
                date: bookingType === 'instant' ? "Today (Instant)" : date,
                time: bookingType === 'instant' ? "Immediate Arrival" : time,
                userName,
                userMobile,
                address,
                latitude: lat,
                longitude: lon,
                totalAmount
            };

            const res = await axios.post(`${serverUrl}/api/booking/create`, payload, { withCredentials: true });
            dispatch(addBooking(res.data.booking));
            setLoading(false);
            onClose();
            navigate("/my-bookings");
        } catch (err) {
            setLoading(false);
            setError(err?.response?.data?.message || "Failed to submit booking request. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 my-8">
                {/* Modal Header */}
                <div className="p-5 text-white flex items-center justify-between" style={{ backgroundColor: primaryColor }}>
                    <div>
                        <h3 className="text-xl font-bold">Book Pandit Ji: {pandit.name}</h3>
                        <p className="text-xs text-orange-100 mt-0.5">{pandit.city}, {pandit.state} • {pandit.experienceYears || 5} Yrs Experience</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/20 text-white transition duration-150 cursor-pointer"
                    >
                        <FaTimes size={18} />
                    </button>
                </div>

                {/* Booking Mode Selector (Instant vs Scheduled) */}
                <div className="p-4 bg-orange-50/60 border-b border-gray-200">
                    <label className="block text-xs font-extrabold uppercase text-gray-500 mb-2">Select Booking Mode</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setBookingType('scheduled')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                                bookingType === 'scheduled'
                                    ? 'bg-white border-orange-500 text-orange-600 shadow-xs ring-2 ring-orange-400/20'
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-white'
                            }`}
                        >
                            <FaCalendarAlt size={16} />
                            <span>Scheduled Booking</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setBookingType('instant')}
                            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                                bookingType === 'instant'
                                    ? 'bg-white border-orange-500 text-orange-600 shadow-xs ring-2 ring-orange-400/20'
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-white'
                            }`}
                        >
                            <FaBolt className="text-amber-500" size={16} />
                            <span>Instant Booking (Now)</span>
                        </button>
                    </div>
                </div>

                {/* Booking Form Body */}
                <form onSubmit={handleCreateBooking} className="p-6 space-y-5">
                    {/* User Details */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                            <FaUser className="text-orange-500" /> User Contact & Venue Details
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={userMobile}
                                    onChange={(e) => setUserMobile(e.target.value)}
                                    placeholder="10-digit mobile number"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                                />
                            </div>
                        </div>

                        <div className="mt-3">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Pooja Venue Address</label>
                            <input
                                type="text"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="House no, Street, Colony, City"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                            />
                        </div>
                    </div>

                    {/* Date and Time (Active for Scheduled) */}
                    {bookingType === 'scheduled' && (
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                                <FaCalendarAlt className="text-orange-500" /> Select Date & Time
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        min={new Date().toISOString().split("T")[0]}
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Time</label>
                                    <select
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-orange-500"
                                    >
                                        <option value="06:00 AM">06:00 AM (Brahma Muhurat)</option>
                                        <option value="08:00 AM">08:00 AM (Morning)</option>
                                        <option value="10:00 AM">10:00 AM (Morning)</option>
                                        <option value="12:00 PM">12:00 PM (Noon)</option>
                                        <option value="04:00 PM">04:00 PM (Evening)</option>
                                        <option value="06:00 PM">06:00 PM (Evening Aarti)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Service Selection / Custom Requirement */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-bold text-gray-900">What do you want Pandit Ji for?</label>
                            <label className="text-xs font-semibold text-orange-600 flex items-center gap-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isCustomPooja}
                                    onChange={(e) => setIsCustomPooja(e.target.checked)}
                                    className="accent-orange-500"
                                />
                                <span>Custom / Other Requirement</span>
                            </label>
                        </div>

                        {!isCustomPooja ? (
                            <select
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white font-medium focus:outline-none focus:border-orange-500"
                            >
                                {(pandit?.services || []).map((s, index) => (
                                    <option key={index} value={s.name}>
                                        {s.name} — ₹{s.price} ({s.duration || "1-2 Hours"})
                                    </option>
                                ))}
                                <option value="Satyanarayan Puja">Satyanarayan Puja — ₹1100</option>
                                <option value="Griha Pravesh">Griha Pravesh — ₹2100</option>
                                <option value="Ganesh Puja">Ganesh Puja — ₹750</option>
                                <option value="Hawan">Hawan — ₹1500</option>
                                <option value="Shiv Puja">Shiv Puja — ₹1100</option>
                                <option value="Marriage Puja">Marriage Puja — ₹5100</option>
                                <option value="Bhojan Seva">Bhojan Seva — ₹500</option>
                                <option value="Mundan">Mundan Ceremony — ₹1500</option>
                            </select>
                        ) : (
                            <div>
                                <textarea
                                    rows="3"
                                    value={customRequirement}
                                    onChange={(e) => setCustomRequirement(e.target.value)}
                                    placeholder="e.g. I want Pandit Ji for a Griha Pravesh Puja & Hawan for approximately 20 people..."
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-500"
                                ></textarea>
                            </div>
                        )}
                    </div>

                    {/* Bhojan Seva Add-on */}
                    <div className="p-4 bg-orange-50/40 rounded-xl border border-orange-100">
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                <FaUtensils className="text-orange-500" /> Include Bhojan Seva Arrangement?
                            </span>
                            <input
                                type="checkbox"
                                checked={bhojanSeva}
                                onChange={(e) => setBhojanSeva(e.target.checked)}
                                className="w-4 h-4 accent-orange-500"
                            />
                        </label>

                        {bhojanSeva && (
                            <div className="mt-3 flex items-center gap-3">
                                <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                                    <FaUsers /> Number of Guests:
                                </label>
                                <input
                                    type="number"
                                    min="5"
                                    max="500"
                                    value={numberOfPeople}
                                    onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                                    className="w-24 border border-gray-300 rounded-md px-2 py-1 text-sm bg-white"
                                />
                                <span className="text-xs font-bold text-orange-600">+₹{bhojanAddon}</span>
                            </div>
                        )}
                    </div>

                    {/* Price Summary & Submit */}
                    <div className="pt-3 border-t border-gray-200 flex items-center justify-between gap-4">
                        <div>
                            <span className="text-xs text-gray-500 block">Total Booking Amount</span>
                            <span className="text-2xl font-extrabold text-gray-900">₹{totalAmount}</span>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 rounded-xl font-bold text-white shadow-md hover:opacity-90 transition duration-200 cursor-pointer flex items-center gap-2"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {loading ? (
                                <ClipLoader size={20} color="#fff" />
                            ) : (
                                <span>Submit Booking Request</span>
                            )}
                        </button>
                    </div>

                    {error && (
                        <p className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-semibold text-center border border-red-200">
                            ⚠️ {error}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default BookingModal;

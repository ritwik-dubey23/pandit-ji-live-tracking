import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import BookingModal from '../components/BookingModal';
import { FaStar, FaMapMarkerAlt, FaBriefcase, FaPhone, FaEnvelope, FaChevronLeft, FaImages, FaCheckCircle, FaExpand } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

function PanditDetails() {
    const primaryColor = "#ff4d2d";
    const { id } = useParams();
    const navigate = useNavigate();

    const [pandit, setPandit] = useState(null);
    const [loading, setLoading] = useState(true);

    const [activePhotoIndex, setActivePhotoIndex] = useState(0);
    const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [lightboxPhoto, setLightboxPhoto] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/pandit/${id}`);
                setPandit(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error loading Pandit Ji details:", error);
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fff9f9]">
                <Navbar />
                <div className="flex items-center justify-center h-64">
                    <ClipLoader size={35} color={primaryColor} />
                </div>
            </div>
        );
    }

    if (!pandit) {
        return (
            <div className="min-h-screen bg-[#fff9f9]">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Pandit Ji Profile Not Found</h2>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 px-4 py-2 bg-orange-500 text-white font-bold rounded-lg cursor-pointer"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const allPhotos = [
        pandit.profileImage,
        ...(pandit.photos || [])
    ].filter(Boolean);

    return (
        <div className="min-h-screen bg-[#fff9f9]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-orange-600 mb-6 cursor-pointer"
                >
                    <FaChevronLeft /> Back to Pandit Ji List
                </button>

                {/* Profile Header Card */}
                <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-md grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Photos Gallery */}
                    <div className="lg:col-span-1">
                        <div
                            onClick={() => setLightboxPhoto(allPhotos[activePhotoIndex] || pandit.profileImage)}
                            className="relative h-72 w-full rounded-2xl overflow-hidden bg-orange-50 border border-gray-200 shadow-xs cursor-pointer group"
                        >
                            <img
                                src={allPhotos[activePhotoIndex] || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"}
                                alt={pandit.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                                <FaExpand size={12} /> Click to expand
                            </div>
                        </div>

                        {allPhotos.length > 1 && (
                            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                                {allPhotos.map((pUrl, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActivePhotoIndex(idx)}
                                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 cursor-pointer shrink-0 transition ${
                                            activePhotoIndex === idx ? "border-orange-500 ring-2 ring-orange-300/30" : "border-gray-200 opacity-70 hover:opacity-100"
                                        }`}
                                    >
                                        <img src={pUrl} alt="gallery" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bio & Details */}
                    <div className="lg:col-span-2 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <span className="bg-orange-100 text-orange-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-orange-200">
                                        Verified Acharya
                                    </span>
                                    <h1 className="text-3xl font-extrabold text-gray-900 mt-2">{pandit.name}</h1>
                                </div>

                                <div className="bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl text-center">
                                    <div className="flex items-center justify-center gap-1 text-sm font-bold text-gray-900">
                                        <FaStar className="text-yellow-500" />
                                        <span>{pandit.rating?.average || 4.9}</span>
                                    </div>
                                    <span className="text-[10px] font-semibold text-gray-500 block">({pandit.rating?.count || 15} Reviews)</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-600 mt-4">
                                <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <FaMapMarkerAlt className="text-orange-500" />
                                    {pandit.city}, {pandit.state} ({pandit.address})
                                </span>
                                <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                                    <FaBriefcase className="text-orange-500" />
                                    {pandit.experienceYears || 5}+ Years Vedic Experience
                                </span>
                            </div>

                            <div className="mt-5">
                                <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">About Pandit Ji</h4>
                                <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                                    {pandit.description || "Experienced Pandit Ji offering authentic Vedic rituals, Griha Pravesh, Hawan, Marriage ceremonies, and customized Poojas with complete Samagri guidance."}
                                </p>
                            </div>
                        </div>

                        {/* Action CTA */}
                        <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                            <div>
                                <span className="text-xs text-gray-400 block font-medium">Availability</span>
                                <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                                    <FaCheckCircle /> Ready for Bookings
                                </span>
                            </div>

                            <button
                                onClick={() => {
                                    setSelectedServiceForBooking(null);
                                    setShowBookingModal(true);
                                }}
                                className="px-6 py-3 text-sm font-bold text-white rounded-xl shadow-md hover:opacity-90 transition duration-200 cursor-pointer"
                                style={{ backgroundColor: primaryColor }}
                            >
                                Book Pandit Ji Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Available Poojas Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
                        Available Poojas & Services ({(pandit.services || []).length})
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(pandit.services || []).map((service) => (
                            <ServiceCard
                                key={service._id}
                                service={service}
                                onBookService={(svc) => {
                                    setSelectedServiceForBooking(svc);
                                    setShowBookingModal(true);
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Customer Reviews & Ratings Section */}
                <div className="mt-12 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-900">Devotee Reviews & Ratings</h2>
                            <p className="text-xs text-gray-500 font-semibold mt-0.5">
                                Verified experiences from devotees who booked {pandit.name}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-2xl border border-orange-200">
                            <FaStar className="text-yellow-500" size={20} />
                            <span className="text-xl font-extrabold text-gray-900">{pandit.rating?.average || 5.0}</span>
                            <span className="text-xs font-bold text-gray-500">/ 5.0 ({pandit.rating?.count || (pandit.reviews ? pandit.reviews.length : 0)} reviews)</span>
                        </div>
                    </div>

                    {pandit.reviews && pandit.reviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pandit.reviews.map((rev) => (
                                <div key={rev._id} className="p-4 bg-orange-50/40 rounded-2xl border border-orange-100 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-extrabold text-sm text-gray-900">{rev.userName}</span>
                                        <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-amber-200 text-xs font-bold text-amber-900">
                                            <FaStar className="text-amber-500" />
                                            <span>{rev.rating} / 5</span>
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-bold text-orange-600 block">Service: {rev.serviceName}</span>
                                    {rev.comment && (
                                        <p className="text-xs text-gray-700 italic bg-white p-3 rounded-xl border border-gray-100">
                                            "{rev.comment}"
                                        </p>
                                    )}
                                    <span className="text-[10px] text-gray-400 font-medium block">
                                        {new Date(rev.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <p className="text-sm font-bold text-gray-600">No devotee reviews yet.</p>
                            <p className="text-xs text-gray-400 mt-1">Be the first to complete a booking and leave a rating for {pandit.name}!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <BookingModal
                    pandit={pandit}
                    initialService={selectedServiceForBooking}
                    onClose={() => setShowBookingModal(false)}
                />
            )}

            {/* Photo Lightbox Modal */}
            {lightboxPhoto && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={() => setLightboxPhoto(null)}
                >
                    <div className="relative max-w-4xl w-full flex flex-col items-center">
                        <button
                            onClick={() => setLightboxPhoto(null)}
                            className="absolute -top-10 right-0 text-white hover:text-orange-400 text-2xl font-bold cursor-pointer"
                        >
                            ✕ Close
                        </button>
                        <img
                            src={lightboxPhoto}
                            alt="Full Resolution Ritual Photo"
                            className="max-h-[80vh] w-auto object-contain rounded-2xl border-2 border-amber-400/50 shadow-2xl"
                        />
                    </div>
                </div>
            )}

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default PanditDetails;

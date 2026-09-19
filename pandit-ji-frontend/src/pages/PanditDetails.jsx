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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[90px] md:pt-[105px] pb-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-orange-600 mb-6 cursor-pointer"
                >
                    <FaChevronLeft /> Back to Pandit Ji List
                </button>

                {/* Modern Hero Profile Header Card */}
                <div className="bg-white rounded-3xl border border-orange-100 overflow-hidden shadow-xl">
                    {/* Top Hero Banner Background */}
                    <div
                        className="relative text-white p-6 sm:p-8 bg-cover bg-center overflow-hidden"
                        style={{
                            backgroundImage: pandit.backgroundImage
                                ? `linear-gradient(to right, rgba(28,25,23,0.9), rgba(67,20,7,0.85), rgba(28,25,23,0.9)), url(${pandit.backgroundImage})`
                                : "linear-gradient(to right, #1c1917, #431407, #1c1917)"
                        }}
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <span className="text-9xl font-black">🕉️</span>
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                            {/* Main Circular Profile Photo */}
                            <div className="relative shrink-0">
                                <div
                                    onClick={() => setLightboxPhoto(allPhotos[activePhotoIndex] || pandit.profileImage)}
                                    className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-amber-400 shadow-2xl cursor-pointer group bg-stone-800"
                                >
                                    <img
                                        src={allPhotos[activePhotoIndex] || pandit.profileImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"}
                                        alt={pandit.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
                                        <FaExpand size={18} />
                                    </div>
                                </div>
                                <span className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-stone-900" title="Online & Available"></span>
                            </div>

                            {/* Hero Text Details */}
                            <div className="flex-1 text-center md:text-left space-y-3">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                    <span className="bg-amber-400/20 text-amber-300 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-amber-400/40 backdrop-blur-xs">
                                        ✓ Verified Acharya
                                    </span>
                                    <span className="bg-white/10 text-stone-200 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1">
                                        <FaBriefcase className="text-amber-400" /> {pandit.experienceYears || 5}+ Yrs Experience
                                    </span>
                                </div>

                                <h1 className="text-3xl sm:text-4xl font-black text-white">{pandit.name}</h1>

                                <p className="text-xs sm:text-sm text-stone-300 font-medium max-w-2xl leading-relaxed">
                                    {pandit.description || "Experienced Gurukul Pandit Ji offering authentic Vedic rituals, Havan, Griha Pravesh, Marriage ceremonies, and customized Poojas with complete Samagri guidance."}
                                </p>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-stone-300 font-semibold">
                                    <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                                        <FaMapMarkerAlt className="text-amber-400" />
                                        {pandit.city}, {pandit.state} ({pandit.address})
                                    </span>

                                    <div className="flex items-center gap-1.5 bg-amber-400/20 px-3 py-1.5 rounded-xl border border-amber-400/40 text-amber-300 font-bold">
                                        <FaStar className="text-amber-400" />
                                        <span>{pandit.rating?.average || 4.9}</span>
                                        <span className="text-[10px] text-stone-300 font-medium">({pandit.rating?.count || 15} Devotee Reviews)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lower Gallery & Action CTA Strip */}
                    <div className="p-6 bg-orange-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-orange-100">
                        {/* Photos Gallery Thumbnails */}
                        {allPhotos.length > 0 ? (
                            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
                                <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                                    <FaImages className="text-orange-500" /> Gallery ({allPhotos.length}):
                                </span>
                                {allPhotos.map((pUrl, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActivePhotoIndex(idx)}
                                        className={`w-12 h-12 rounded-xl overflow-hidden border-2 cursor-pointer shrink-0 transition ${
                                            activePhotoIndex === idx ? "border-[#ff4d2d] ring-2 ring-orange-400/50" : "border-gray-200 opacity-70 hover:opacity-100"
                                        }`}
                                    >
                                        <img src={pUrl} alt="gallery thumbnail" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        ) : <div></div>}

                        <button
                            onClick={() => {
                                setSelectedServiceForBooking(null);
                                setShowBookingModal(true);
                            }}
                            className="px-8 py-3.5 text-sm font-black text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition duration-200 cursor-pointer shrink-0 min-h-[44px] flex items-center gap-2"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Book Pandit Ji Now ➔
                        </button>
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

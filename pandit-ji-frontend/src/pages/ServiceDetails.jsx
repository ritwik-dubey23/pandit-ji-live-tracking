import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import { 
    FaStar, FaClock, FaRupeeSign, FaCheckCircle, FaMapMarkerAlt, 
    FaBriefcase, FaChevronLeft, FaExpand, FaUtensils, FaHands, FaUserCheck 
} from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

function ServiceDetails() {
    const primaryColor = "#ff4d2d";
    const { serviceId } = useParams();
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [pandit, setPandit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activePhotoIndex, setActivePhotoIndex] = useState(0);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [lightboxPhoto, setLightboxPhoto] = useState(null);

    useEffect(() => {
        const fetchServiceAndPandit = async () => {
            try {
                setLoading(true);
                // Fetch all pandits to locate matching service
                const res = await axios.get(`${serverUrl}/api/pandit`);
                const allPandits = res.data || [];
                
                let foundService = null;
                let foundPandit = null;

                for (const p of allPandits) {
                    if (p.services && Array.isArray(p.services)) {
                        const match = p.services.find(s => s._id.toString() === serviceId || s.name.toLowerCase().replace(/\s+/g, '-') === serviceId.toLowerCase());
                        if (match) {
                            foundService = match;
                            foundPandit = p;
                            break;
                        }
                    }
                }

                if (foundPandit && foundService) {
                    // Fetch full pandit details to get reviews
                    const pRes = await axios.get(`${serverUrl}/api/pandit/${foundPandit._id}`);
                    setPandit(pRes.data);
                    setService(foundService);
                } else if (allPandits.length > 0) {
                    // Fallback to first pandit's first service
                    const fallbackP = allPandits[0];
                    setPandit(fallbackP);
                    setService(fallbackP.services?.[0] || {
                        _id: serviceId,
                        name: "Vedic Pooja Service",
                        description: "Complete authentic Vedic rituals conducted with devotion.",
                        price: 1100,
                        duration: "2 Hours"
                    });
                } else {
                    setError("Service not found");
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching service details:", err);
                setError("Failed to load service details.");
                setLoading(false);
            }
        };

        fetchServiceAndPandit();
    }, [serviceId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fff9f5]">
                <Navbar />
                <div className="flex items-center justify-center h-64">
                    <ClipLoader size={35} color={primaryColor} />
                </div>
            </div>
        );
    }

    if (error || !service || !pandit) {
        return (
            <div className="min-h-screen bg-[#fff9f5]">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Service Details Not Found</h2>
                    <p className="text-xs text-gray-500 mt-2">The requested Pooja service could not be located.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-6 px-5 py-2.5 bg-orange-500 text-white font-bold rounded-xl shadow-md cursor-pointer"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const allPhotos = [
        service.image,
        ...(service.photos || []),
        pandit.profileImage
    ].filter(Boolean);

    return (
        <div className="min-h-screen bg-[#fff9f5] flex flex-col justify-between">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[90px] md:pt-[105px] pb-8 w-full">
                {/* Back Link */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-xs font-extrabold text-gray-600 hover:text-orange-600 mb-6 cursor-pointer"
                >
                    <FaChevronLeft /> Back to Services
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT 2 COLS: Service Info & Gallery */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Main Service Hero & Image Gallery */}
                        <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                <span className="bg-orange-100 text-orange-800 text-xs font-black uppercase px-3 py-1 rounded-full border border-orange-200">
                                    Vedic Ceremony & Ritual
                                </span>
                                <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-3 py-1 rounded-xl text-xs font-extrabold text-gray-900">
                                    <FaStar className="text-amber-500" />
                                    <span>{pandit.rating?.average || 4.9}</span>
                                    <span className="text-gray-400 font-semibold">({pandit.rating?.count || 12} reviews)</span>
                                </div>
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                                {service.name}
                            </h1>

                            {/* Image Lightbox Container */}
                            <div className="mt-6">
                                <div
                                    onClick={() => setLightboxPhoto(allPhotos[activePhotoIndex] || service.image)}
                                    className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden bg-orange-50 border border-gray-200 shadow-xs cursor-pointer group"
                                >
                                    <img
                                        src={allPhotos[activePhotoIndex] || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600"}
                                        alt={service.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition">
                                        <FaExpand size={12} /> Click to Expand Photo
                                    </div>
                                </div>

                                {allPhotos.length > 1 && (
                                    <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2">
                                        {allPhotos.map((pUrl, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActivePhotoIndex(idx)}
                                                className={`w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer shrink-0 transition ${
                                                    activePhotoIndex === idx
                                                        ? "border-orange-500 ring-2 ring-orange-400/30 scale-105"
                                                        : "border-gray-200 opacity-70 hover:opacity-100"
                                                }`}
                                            >
                                                <img src={pUrl} alt="gallery" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Service Description */}
                            <div className="mt-8 space-y-4 pt-6 border-t border-gray-100">
                                <h3 className="text-lg font-black text-gray-900">About this Pooja & Ritual</h3>
                                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                    {service.description || "Authentic Vedic ceremony performed according to traditional Shastras with proper Sankalp, Mantra Chanting, Hawan, and Aarthi guidance."}
                                </p>
                            </div>

                            {/* What is Included & Customer Requirements */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                                <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-2">
                                    <h4 className="text-xs font-black uppercase text-orange-700 flex items-center gap-1.5">
                                        <FaCheckCircle className="text-orange-500" /> What Pandit Ji Provides
                                    </h4>
                                    <ul className="text-xs font-semibold text-gray-700 space-y-1.5">
                                        <li>• Full Vedic Pooja & Hawan Execution</li>
                                        <li>• Samagri Consultation & Checklist</li>
                                        <li>• Auspicious Muhurat Selection</li>
                                        <li>• Aarthi & Blessing Prayers</li>
                                    </ul>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                                    <h4 className="text-xs font-black uppercase text-gray-700 flex items-center gap-1.5">
                                        <FaHands className="text-orange-500" /> Customer Preparation
                                    </h4>
                                    <ul className="text-xs font-semibold text-gray-600 space-y-1.5">
                                        <li>• Clean Pooja Venue/Mandap Space</li>
                                        <li>• Fresh Fruits, Flowers & Diya Oil</li>
                                        <li>• Seating Asanas for Family</li>
                                        <li>• Optional Bhojan Arrangement</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Customer Reviews Section */}
                        <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-sm space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">Devotee Reviews</h3>
                                    <p className="text-xs font-semibold text-gray-500 mt-0.5">Verified feedback for {pandit.name}</p>
                                </div>
                                <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200 text-sm font-black text-gray-900">
                                    <FaStar className="text-yellow-500" />
                                    <span>{pandit.rating?.average || 5.0}</span>
                                    <span className="text-xs text-gray-400">/ 5</span>
                                </div>
                            </div>

                            {pandit.reviews && pandit.reviews.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {pandit.reviews.map((rev) => (
                                        <div key={rev._id} className="p-4 bg-orange-50/30 rounded-2xl border border-orange-100 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-extrabold text-xs text-gray-900">{rev.userName}</span>
                                                <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                                                    <FaStar /> {rev.rating}/5
                                                </div>
                                            </div>
                                            {rev.comment && (
                                                <p className="text-xs text-gray-700 italic bg-white p-2.5 rounded-xl border border-gray-100">
                                                    "{rev.comment}"
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs font-semibold text-gray-500 text-center py-4">No devotee reviews submitted yet.</p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COL: Booking Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl border-2 border-orange-200 p-6 shadow-lg sticky top-24 space-y-6">
                            {/* Price & Duration */}
                            <div className="border-b border-orange-100 pb-4">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Service Price</span>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-3xl font-black text-gray-900">₹{service.price}</span>
                                    <span className="text-xs font-bold text-gray-500">/ ceremony</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-extrabold text-gray-600 mt-3">
                                    <span className="flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-lg">
                                        <FaClock className="text-orange-500" /> {service.duration || "1-2 Hours"}
                                    </span>
                                    <span className="flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-lg">
                                        <FaUtensils className="text-orange-500" /> Optional Bhojan
                                    </span>
                                </div>
                            </div>

                            {/* Assigned Pandit Summary Card */}
                            <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-100 flex items-center gap-3">
                                <img
                                    src={pandit.profileImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"}
                                    alt={pandit.name}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-xs shrink-0"
                                />
                                <div>
                                    <span className="text-[10px] font-black uppercase text-orange-600 tracking-wider">Assigned Acharya</span>
                                    <h4 className="text-sm font-black text-gray-900">{pandit.name}</h4>
                                    <p className="text-xs font-semibold text-gray-500 flex items-center gap-1 mt-0.5">
                                        <FaMapMarkerAlt className="text-orange-500" size={10} /> {pandit.city}, {pandit.state}
                                    </p>
                                </div>
                            </div>

                            {/* Book Now Button */}
                            <button
                                type="button"
                                onClick={() => setShowBookingModal(true)}
                                className="w-full py-3.5 rounded-2xl font-black text-sm text-white shadow-lg hover:opacity-95 transition duration-200 cursor-pointer min-h-[48px] flex items-center justify-center gap-2"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <FaCheckCircle /> Book {service.name} Now
                            </button>

                            <p className="text-[11px] font-semibold text-gray-400 text-center leading-normal">
                                Fast Instant or Scheduled booking available. Track Pandit Ji live on map upon request acceptance.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Booking Modal carrying this selected service */}
            {showBookingModal && (
                <BookingModal
                    pandit={pandit}
                    initialService={service}
                    onClose={() => setShowBookingModal(false)}
                />
            )}

            {/* Photo Lightbox */}
            {lightboxPhoto && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4"
                    onClick={() => setLightboxPhoto(null)}
                >
                    <div className="relative max-w-4xl w-full flex flex-col items-center">
                        <button
                            onClick={() => setLightboxPhoto(null)}
                            className="absolute -top-10 right-0 text-white hover:text-orange-400 text-xl font-bold cursor-pointer"
                        >
                            ✕ Close
                        </button>
                        <img
                            src={lightboxPhoto}
                            alt="Full Resolution Ritual View"
                            className="max-h-[80vh] w-auto object-contain rounded-2xl border-2 border-amber-400 shadow-2xl"
                        />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default ServiceDetails;

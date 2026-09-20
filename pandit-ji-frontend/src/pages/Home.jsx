import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import PanditCard from '../components/PanditCard';
import ServiceCard from '../components/ServiceCard';
import BookingModal from '../components/BookingModal';
import Footer from '../components/Footer';
import useGetAllPandits from '../hooks/useGetAllPandits';
import useCurrentLocation from '../hooks/useCurrentLocation';
import { categories } from '../category';
import { FaChevronCircleLeft, FaChevronCircleRight, FaPrayingHands, FaSearch, FaMapMarkerAlt, FaCrosshairs, FaShieldAlt, FaCalendarCheck, FaHands, FaStar } from 'react-icons/fa';

function Home() {
    const primaryColor = "#ff4d2d";

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("All Poojas");
    const [selectedPanditForBooking, setSelectedPanditForBooking] = useState(null);
    const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);

    const { location, loading: locLoading, detectLocation } = useCurrentLocation();
    useGetAllPandits(searchQuery, selectedCategory);

    const { panditsList } = useSelector(state => state.pandit);

    const cateScrollRef = useRef();

    const scrollCategories = (direction) => {
        if (cateScrollRef.current) {
            cateScrollRef.current.scrollBy({
                left: direction === "left" ? -250 : 250,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col justify-between bg-[#fff9f6]">
            <div>
                <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

                {searchQuery.trim() ? (() => {
                    const qLower = searchQuery.trim().toLowerCase();

                    // Keyword normalization map for transliteration & alternate spellings
                    const normalizeKeyword = (str) => {
                        let s = str.toLowerCase();
                        if (s.includes("satya") || s.includes("narayan")) return "satyanarayan";
                        if (s.includes("grih") || s.includes("pravesh") || s.includes("house")) return "griha pravesh";
                        if (s.includes("ganesh") || s.includes("ganpati") || s.includes("vinayak")) return "ganesh";
                        if (s.includes("havan") || s.includes("hawan") || s.includes("yagna") || s.includes("mrityunjaya")) return "havan";
                        if (s.includes("vivah") || s.includes("marriage") || s.includes("shadi")) return "vivah";
                        if (s.includes("vastu")) return "vastu";
                        if (s.includes("kuber") || s.includes("laxmi") || s.includes("lakshmi")) return "laxmi";
                        if (s.includes("rudra") || s.includes("shiva") || s.includes("shiv")) return "rudrabhishek";
                        return s;
                    };

                    const normQuery = normalizeKeyword(qLower);

                    // Collect all services offered across Pandits
                    const allServicesMap = new Map();
                    panditsList.forEach(p => {
                        if (p.services && Array.isArray(p.services)) {
                            p.services.forEach(s => {
                                if (s && s.name) {
                                    const key = s.name.toLowerCase();
                                    if (!allServicesMap.has(key)) {
                                        allServicesMap.set(key, { ...s, panditCount: 1, samplePandit: p });
                                    } else {
                                        const existing = allServicesMap.get(key);
                                        existing.panditCount += 1;
                                    }
                                }
                            });
                        }
                    });

                    // Filter matching services based on keyword or query substring
                    const matchingServices = Array.from(allServicesMap.values()).filter(s => {
                        const sNameNorm = normalizeKeyword(s.name);
                        return sNameNorm.includes(normQuery) || s.name.toLowerCase().includes(qLower) || (s.description && s.description.toLowerCase().includes(qLower));
                    });

                    // Pandits matching search query or matching services (if panditsList has API search result, keep them all)
                    const matchingPandits = panditsList.length > 0 ? panditsList : [];

                    const hasResults = matchingServices.length > 0 || matchingPandits.length > 0;

                    return (
                        <div className="w-full max-w-6xl mx-auto px-4 pt-[95px] pb-12 space-y-8">
                            {/* SEARCH HEADER */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-orange-200 pb-4">
                                <div>
                                    <span className="text-xs font-black uppercase text-[#ff4d2d] tracking-wider bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
                                        Smart Search System
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
                                        Results for "{searchQuery}"
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-[#ff4d2d] text-xs font-extrabold rounded-xl border border-orange-300 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                                >
                                    ✕ Clear Search / Back to Home
                                </button>
                            </div>

                            {!hasResults ? (
                                <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-orange-100 shadow-sm max-w-lg mx-auto my-8 space-y-3">
                                    <FaPrayingHands className="mx-auto text-orange-400 text-5xl mb-2" />
                                    <h3 className="text-lg sm:text-xl font-black text-gray-900">No Direct Match Found</h3>
                                    <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed">
                                        No Pandit Ji or service matched <strong className="text-gray-900">"{searchQuery}"</strong>. Try searching for <span className="text-[#ff4d2d] font-bold">Satyanarayan, Ganesh, Griha Pravesh, Havan</span>, or Pandit names like <span className="text-[#ff4d2d] font-bold">Ramesh</span>.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="mt-2 px-5 py-2.5 bg-[#ff4d2d] hover:bg-[#e64323] text-white text-xs font-black rounded-xl shadow-md cursor-pointer transition"
                                    >
                                        View All Pandits & Services
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-10">
                                    {/* 1. MATCHING SPECIFIC SERVICE RESULT CARDS (FULL SERVICE CARD CLICKABLE) */}
                                    {matchingServices.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">🕉️</span>
                                                <h3 className="text-xl font-black text-gray-900">
                                                    Matching Services ({matchingServices.length})
                                                </h3>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {matchingServices.map((service, idx) => (
                                                    <ServiceCard
                                                        key={service._id || idx}
                                                        service={service}
                                                        onBookService={() => {
                                                            setSelectedPanditForBooking(service.samplePandit || panditsList[0]);
                                                            setSelectedServiceForBooking(service);
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 2. MATCHING PANDITS AVAILABLE FOR SERVICE OR NAME */}
                                    {matchingPandits.length > 0 && (
                                        <div className="space-y-4 pt-4 border-t border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                                    <span>🙏</span>
                                                    <span>
                                                        {matchingServices.length > 0
                                                            ? `Pandits available for ${matchingServices[0].name} (${matchingPandits.length})`
                                                            : `Matching Pandits (${matchingPandits.length})`}
                                                    </span>
                                                </h3>
                                            </div>

                                            <div className="w-full flex flex-wrap gap-6 justify-start max-sm:grid max-sm:grid-cols-1">
                                                {matchingPandits.map((pandit) => (
                                                    <PanditCard
                                                        key={pandit._id}
                                                        pandit={pandit}
                                                        searchQuery={searchQuery}
                                                        onBookNow={(p, s) => {
                                                            setSelectedPanditForBooking(p);
                                                            setSelectedServiceForBooking(s || null);
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })() : (
                    <>
                        {/* HERO BANNER SECTION WITH LOCATION SEARCH BAR */}
                        <div className="w-full pt-[80px] md:pt-[95px]">
                            <div className="relative w-full min-h-[360px] sm:min-h-[420px] md:min-h-[460px] overflow-hidden flex items-center justify-center text-center">
                                <img
                                    src="/hero.jpg"
                                    alt="Book Verified Pandit Ji"
                                    className="absolute inset-0 w-full h-full object-cover filter brightness-[0.45]"
                                />
                                <div className="relative z-10 w-full max-w-4xl px-4 py-8 flex flex-col items-center justify-center">
                                    <span className="bg-[#ff4d2d] text-white text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3 shadow-md">
                                        🕉️ Authentic Vedic Ceremonies
                                    </span>
                                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md leading-tight">
                                        Book Verified Pandit Ji Instantly
                                    </h1>
                                    <p className="text-gray-200 text-sm sm:text-base max-w-xl mt-2 font-semibold">
                                        Complete Samagri, Authentic Rituals & Live Map Tracking at your home.
                                    </p>

                                    {/* HERO LOCATION BADGE */}
                                    <div className="w-full max-w-xs sm:max-w-md bg-white/95 backdrop-blur-md p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-2xl mt-5 sm:mt-6 border border-white/20 flex items-center justify-center">
                                        <div className="flex items-center gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-orange-50/90 border border-orange-200/90 rounded-xl sm:rounded-2xl w-full min-w-0">
                                            <FaMapMarkerAlt className="text-[#ff4d2d] shrink-0" size={16} />
                                            <div className="min-w-0 flex-1 text-left">
                                                <span className="text-[10px] font-extrabold uppercase text-[#ff4d2d] block truncate tracking-wider">Current Location</span>
                                                <span className="text-xs font-bold text-gray-800 truncate block">
                                                    {locLoading ? "Detecting GPS location..." : location.formattedAddress}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={detectLocation}
                                                title="Detect Current GPS Location"
                                                className="p-1.5 hover:bg-orange-200/60 rounded-xl transition text-[#ff4d2d] shrink-0 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                                            >
                                                <FaCrosshairs size={15} className={locLoading ? "animate-spin" : ""} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CATEGORIES SECTION */}
                        <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 items-start p-4 mt-6">
                            <h2 className="text-gray-900 text-xl sm:text-2xl font-black">
                                Select Pooja Category
                            </h2>

                            <div className="w-full relative">
                                <button
                                    onClick={() => scrollCategories("left")}
                                    className="absolute left-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-[#ff4d2d] text-white shadow-lg hover:bg-[#e64528] z-10 cursor-pointer"
                                >
                                    <FaChevronCircleLeft size={24} />
                                </button>

                                <div className="w-full flex overflow-x-auto gap-3 pb-2 scrollbar-none px-6" ref={cateScrollRef}>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.name)}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 border ${
                                                selectedCategory === cat.name
                                                    ? "bg-[#ff4d2d] text-white border-[#ff4d2d] shadow-md"
                                                    : "bg-white text-gray-700 border-gray-200 hover:border-[#ff4d2d]"
                                            }`}
                                        >
                                            <span className="text-base">{cat.icon}</span>
                                            <span>{cat.name}</span>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => scrollCategories("right")}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-[#ff4d2d] text-white shadow-lg hover:bg-[#e64528] z-10 cursor-pointer"
                                >
                                    <FaChevronCircleRight size={24} />
                                </button>
                            </div>
                        </div>

                        {/* PANDIT CARDS GRID */}
                        <div className="w-full max-w-6xl mx-auto flex flex-col gap-5 items-start p-4 mb-10">
                            <div className="flex items-center justify-between w-full">
                                <h2 className="text-gray-900 text-xl sm:text-2xl font-black">
                                    Verified Pandit Ji in {location.city || "Indore"} ({panditsList.length})
                                </h2>
                                {selectedCategory !== "All Poojas" && (
                                    <span className="text-xs font-bold text-[#ff4d2d] bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
                                        Filter: {selectedCategory}
                                    </span>
                                )}
                            </div>

                            {panditsList.length === 0 ? (
                                <div className="w-full bg-white rounded-3xl p-10 text-center border border-gray-200 shadow-xs">
                                    <FaPrayingHands className="mx-auto text-orange-400 text-5xl mb-3" />
                                    <h3 className="text-lg font-black text-gray-800">No Pandit Ji Available Right Now</h3>
                                    <p className="text-xs font-semibold text-gray-500 mt-1">Try selecting a different category or clearing search filters!</p>
                                </div>
                            ) : (
                                <div className="w-full flex flex-wrap gap-6 justify-start max-sm:grid max-sm:grid-cols-1">
                                    {panditsList.map((pandit) => (
                                        <PanditCard
                                            key={pandit._id}
                                            pandit={pandit}
                                            searchQuery={selectedCategory !== "All Poojas" ? selectedCategory : ""}
                                            onBookNow={(p, s) => {
                                                setSelectedPanditForBooking(p);
                                                setSelectedServiceForBooking(s || null);
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* TRUST & BENEFITS SECTION */}
                        <div className="w-full bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 px-4 border-y border-orange-100 mb-12">
                            <div className="max-w-6xl mx-auto text-center space-y-8">
                                <div>
                                    <span className="text-xs font-extrabold text-[#ff4d2d] uppercase tracking-wider bg-orange-100 px-3 py-1 rounded-full">
                                        Authentic Vedic Promise
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
                                        Why Book Pandit Ji Through Maharaj Ji?
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex flex-col items-center space-y-2">
                                        <div className="w-12 h-12 rounded-full bg-orange-100 text-[#ff4d2d] flex items-center justify-center font-bold">
                                            <FaShieldAlt size={22} />
                                        </div>
                                        <h4 className="font-extrabold text-sm text-gray-900">Verified Pandits</h4>
                                        <p className="text-xs text-gray-500">Gurukul trained scholars verified for authentic rituals.</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex flex-col items-center space-y-2">
                                        <div className="w-12 h-12 rounded-full bg-orange-100 text-[#ff4d2d] flex items-center justify-center font-bold">
                                            <FaCalendarCheck size={22} />
                                        </div>
                                        <h4 className="font-extrabold text-sm text-gray-900">Instant Booking</h4>
                                <p className="text-xs text-gray-500">Instant Pooja confirmation & real-time live map tracking.</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex flex-col items-center space-y-2">
                                <div className="w-12 h-12 rounded-full bg-orange-100 text-[#ff4d2d] flex items-center justify-center font-bold">
                                    <FaHands size={22} />
                                </div>
                                <h4 className="font-extrabold text-sm text-gray-900">Complete Samagri</h4>
                                <p className="text-xs text-gray-500">Hawan Kund & pure Pooja Samagri guidance included.</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex flex-col items-center space-y-2">
                                <div className="w-12 h-12 rounded-full bg-orange-100 text-[#ff4d2d] flex items-center justify-center font-bold">
                                    <FaStar size={22} />
                                </div>
                                <h4 className="font-extrabold text-sm text-gray-900">Transparent Dakshina</h4>
                                <p className="text-xs text-gray-500">Fixed upfront pricing with no hidden charges.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Booking Modal */}
            {selectedPanditForBooking && (
                <BookingModal
                    pandit={selectedPanditForBooking}
                    initialService={selectedServiceForBooking}
                    onClose={() => {
                        setSelectedPanditForBooking(null);
                        setSelectedServiceForBooking(null);
                    }}
                />
            )}

            {/* FOOTER */}
            <Footer />
        </div>
    );
}

export default Home;

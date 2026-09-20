import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaMapMarkerAlt, FaBriefcase, FaPrayingHands } from 'react-icons/fa';

function PanditCard({ pandit, onBookNow, searchQuery }) {
    const primaryColor = "#ff4d2d";
    const navigate = useNavigate();

    // Identify matched service if search query or category is active
    let matchedService = null;
    if (searchQuery && searchQuery.trim() && pandit?.services?.length > 0) {
        const qRaw = searchQuery.trim().toLowerCase();
        const qWords = qRaw.split(/\s+/).filter(w => w.length > 1);

        // 1. Exact or partial match on service name
        matchedService = pandit.services.find(s => s.name?.toLowerCase().includes(qRaw));

        // 2. Transliteration / alternate term keyword match
        if (!matchedService) {
            let altQuery = "";
            if (qRaw.includes("grih") || qRaw.includes("pravesh") || qRaw.includes("house")) altQuery = "griha";
            else if (qRaw.includes("satya") || qRaw.includes("narayan")) altQuery = "satyanarayan";
            else if (qRaw.includes("vivah") || qRaw.includes("shadi") || qRaw.includes("marriage")) altQuery = "marriage";
            else if (qRaw.includes("kundli") || qRaw.includes("astrology")) altQuery = "kundli";
            
            if (altQuery) {
                matchedService = pandit.services.find(s => s.name?.toLowerCase().includes(altQuery));
            }
        }

        // 3. Word match on service name
        if (!matchedService) {
            matchedService = pandit.services.find(s => s.name && qWords.some(w => s.name.toLowerCase().includes(w)));
        }

        // 4. Match on service description
        if (!matchedService) {
            matchedService = pandit.services.find(s => s.description && (s.description.toLowerCase().includes(qRaw) || qWords.some(w => s.description.toLowerCase().includes(w))));
        }
    }

    const startingPrice = pandit.services && pandit.services.length > 0
        ? Math.min(...pandit.services.map(s => s.price))
        : 500;

    const renderStars = (rating) => {
        const stars = [];
        const score = Math.round(rating || 4);
        for (let i = 1; i <= 5; i++) {
            stars.push(
                i <= score
                    ? <FaStar key={i} className='text-amber-500 text-sm' />
                    : <FaRegStar key={i} className='text-amber-500 text-sm' />
            );
        }
        return stars;
    };

    return (
        <div
            onClick={() => navigate(`/pandit/${pandit._id}`)}
            className='w-[270px] max-sm:w-full rounded-2xl border-2 border-[#ff4d2d] overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group cursor-pointer'
        >
            {/* Image Header - Clickable Photo */}
            <div className='bg-white relative w-full h-[190px] max-sm:h-[150px] flex justify-center items-center overflow-hidden group'>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs rounded-full px-2.5 py-1 shadow-md border border-black/5 z-10 flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-800">{pandit.rating?.average || 4.9}</span>
                    <FaStar className="text-amber-500 text-xs" />
                </div>

                {/* Online / Offline Status Badge */}
                <div className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-[11px] font-black z-10 shadow-md ${
                    pandit.isOnline !== false
                        ? "bg-green-500 text-white"
                        : "bg-gray-700 text-gray-200"
                }`}>
                    {pandit.isOnline !== false ? "🟢 ONLINE" : "⚪ OFFLINE"}
                </div>

                <img
                    src={pandit.profileImage || (pandit.photos && pandit.photos[0]) || "/logo.png"}
                    alt={pandit.name}
                    className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-108'
                />
            </div>

            {/* Content Body */}
            <div className='flex-1 flex flex-col p-4'>
                <h3 className='capitalize font-bold text-gray-900 text-lg truncate group-hover:text-[#ff4d2d] transition-colors'>
                    {pandit.name}
                </h3>

                <div className="flex items-center gap-3 text-xs font-medium text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-[#ff4d2d]" />
                        {pandit.city}
                    </span>
                    <span className="flex items-center gap-1">
                        <FaBriefcase className="text-[#ff4d2d]" />
                        {pandit.experienceYears || 5}+ Yrs Exp
                    </span>
                </div>

                {/* MATCHED SERVICE HIGHLIGHT BOX */}
                {matchedService ? (
                    <div className="mt-2.5 p-2.5 bg-orange-50/90 border border-orange-200 rounded-xl space-y-1 text-left shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#ff4d2d] bg-orange-100 px-2 py-0.5 rounded-md">
                                Matched Service
                            </span>
                            {matchedService.duration && (
                                <span className="text-[10px] font-bold text-gray-600">
                                    ⏱️ {matchedService.duration}
                                </span>
                            )}
                        </div>
                        <h4 className="font-extrabold text-xs text-gray-900 line-clamp-1 mt-1">
                            {matchedService.name}
                        </h4>
                        {matchedService.description && (
                            <p className="text-[11px] text-gray-600 line-clamp-2 leading-tight">
                                {matchedService.description}
                            </p>
                        )}
                        <div className="flex items-center justify-between pt-1 border-t border-orange-200/60 mt-1">
                            <span className="text-[11px] font-semibold text-gray-700">Pooja Fee:</span>
                            <span className="text-xs font-black text-[#ff4d2d]">₹{matchedService.price}</span>
                        </div>
                    </div>
                ) : (
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                        {pandit.description || "Experienced Acharya specializing in authentic rituals and Poojas."}
                    </p>
                )}

                {/* Rating stars */}
                <div className='flex items-center justify-between mt-3 pt-2 border-t border-gray-100'>
                    <div className='flex items-center gap-0.5'>
                        {renderStars(pandit.rating?.average || 5)}
                    </div>
                    <span className='bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-md'>
                        {pandit.rating?.count || 12} reviews
                    </span>
                </div>
            </div>

            {/* Footer */}
            <div className='flex items-center justify-between px-4 pt-2 pb-4 border-t border-gray-100 mt-auto'>
                <div>
                    <span className="text-[10px] text-gray-400 font-medium block">
                        {matchedService ? "Service Price" : "Starting at"}
                    </span>
                    <span className='font-bold text-gray-900 text-lg'>
                        ₹{matchedService ? matchedService.price : startingPrice}
                    </span>
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/pandit/${pandit._id}`);
                        }}
                        className="px-2.5 py-1.5 text-xs font-bold text-gray-700 hover:text-[#ff4d2d] bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
                    >
                        Profile
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onBookNow(pandit, matchedService);
                        }}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#ff4d2d] hover:bg-[#e64323] rounded-lg shadow-xs cursor-pointer transition"
                    >
                        {matchedService ? "Book Service" : "Book Now"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PanditCard;

import React, { useState } from 'react';
import { FaClock, FaTag, FaPrayingHands, FaImages, FaExpand } from 'react-icons/fa';

function ServiceCard({ service, onBookService }) {
    const primaryColor = "#ff4d2d";
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const photosList = [
        service.image,
        ...(service.photos || [])
    ].filter(Boolean);

    // Deduplicate photo URLs
    const uniquePhotos = Array.from(new Set(photosList));

    return (
        <div className="bg-white rounded-2xl border border-orange-100 p-5 shadow-sm hover:border-orange-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between">
            <div>
                {/* Header & Pricing */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#ff4d2d] flex items-center justify-center font-bold shrink-0">
                            <FaPrayingHands size={18} />
                        </div>
                        <h4 className="text-lg font-extrabold text-gray-900 leading-snug">{service.name}</h4>
                    </div>
                    <span className="text-xl font-black text-[#ff4d2d] shrink-0">₹{service.price}</span>
                </div>

                {/* Multiple Service Photo Gallery Grid */}
                {uniquePhotos.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {/* Primary Banner Photo */}
                        <div
                            onClick={() => setSelectedPhoto(uniquePhotos[0])}
                            className="relative h-40 w-full rounded-xl overflow-hidden bg-orange-50 border border-orange-100 cursor-pointer group"
                        >
                            <img
                                src={uniquePhotos[0]}
                                alt={service.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
                                <FaExpand size={10} /> View Gallery ({uniquePhotos.length})
                            </div>
                        </div>

                        {/* Thumbnail Strip if multiple photos */}
                        {uniquePhotos.length > 1 && (
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                                {uniquePhotos.map((pUrl, pIdx) => (
                                    <button
                                        type="button"
                                        key={pIdx}
                                        onClick={() => setSelectedPhoto(pUrl)}
                                        className="w-12 h-12 rounded-lg overflow-hidden border border-orange-200 shrink-0 cursor-pointer hover:ring-2 hover:ring-[#ff4d2d] transition"
                                    >
                                        <img src={pUrl} alt={`service-photo-${pIdx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <p className="text-xs text-gray-600 mt-3 leading-relaxed font-medium">
                    {service.description || "Authentic Vedic ceremony with complete Vidhi-Vidhan and Samagri guidance."}
                </p>

                <div className="flex items-center gap-3 text-xs font-bold text-gray-600 mt-4 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100">
                        <FaClock className="text-[#ff4d2d]" />
                        {service.duration || "1-2 Hours"}
                    </span>
                    <span className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100">
                        <FaTag className="text-[#ff4d2d]" />
                        Samagri List Included
                    </span>
                </div>
            </div>

            <button
                onClick={() => onBookService(service)}
                className="w-full mt-5 py-3 rounded-xl text-xs font-black text-white shadow-md hover:bg-[#e64323] transition duration-200 cursor-pointer min-h-[44px]"
                style={{ backgroundColor: primaryColor }}
            >
                Book This Service
            </button>

            {/* Photo Lightbox Modal */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <div className="relative max-w-2xl w-full flex flex-col items-center">
                        <button
                            onClick={() => setSelectedPhoto(null)}
                            className="absolute -top-10 right-0 text-white font-bold text-sm bg-white/20 px-3 py-1 rounded-full cursor-pointer hover:bg-white/40"
                        >
                            ✕ Close
                        </button>
                        <img
                            src={selectedPhoto}
                            alt="Service Photo Gallery"
                            className="max-h-[75vh] w-auto object-contain rounded-2xl border-2 border-orange-400 shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ServiceCard;

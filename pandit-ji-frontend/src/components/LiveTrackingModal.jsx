import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { socket } from '../socket';
import { FaTimes, FaPhone, FaCommentDots, FaBan, FaStar, FaChevronLeft } from 'react-icons/fa';
import axios from 'axios';

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";
const INDORE_FALLBACK = { lat: 22.7196, lng: 75.8577 };

function LiveTrackingModal({ booking, currentUserRole, onClose, onStatusUpdated }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const userMarkerRef = useRef(null);
    const panditMarkerRef = useRef(null);
    const polylineRef = useRef(null);
    const watchIdRef = useRef(null);

    // Initial coordinates from booking or Indore fallback
    const [userLoc, setUserLoc] = useState({
        lat: booking.userLocation?.latitude || INDORE_FALLBACK.lat,
        lng: booking.userLocation?.longitude || INDORE_FALLBACK.lng
    });

    const [panditLoc, setPanditLoc] = useState({
        lat: booking.panditLocation?.latitude || INDORE_FALLBACK.lat + 0.012,
        lng: booking.panditLocation?.longitude || INDORE_FALLBACK.lng + 0.012
    });

    const [distance, setDistance] = useState(booking.distanceKm || 2.5);
    const [eta, setEta] = useState(booking.etaMinutes || 12);
    const [bookingStatus, setBookingStatus] = useState(booking.status || "accepted");
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { sender: "pandit", text: "Namaste! I am on my way with all necessary Pooja Samagri." }
    ]);
    const [newMessage, setNewMessage] = useState("");

    // 1. Live Geolocation Detection with enableHighAccuracy & Indore Fallback
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    if (currentUserRole === "pandit") {
                        setPanditLoc({ lat, lng });
                    } else {
                        setUserLoc({ lat, lng });
                    }
                },
                (err) => {
                    console.warn("Geolocation warning fallback to Indore:", err.message);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }
    }, [currentUserRole]);

    // 2. Initialize Real Leaflet Map
    useEffect(() => {
        if (!mapRef.current) return;

        if (!mapInstanceRef.current) {
            const map = L.map(mapRef.current, {
                zoomControl: false
            }).setView([userLoc.lat, userLoc.lng], 14);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            // User Custom Leaflet Icon (📍 Red pin with glow)
            const userIcon = L.divIcon({
                className: 'custom-user-icon',
                html: `<div style="background-color: #ef4444; color: white; border: 3px solid white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; box-shadow: 0 4px 14px rgba(239,68,68,0.5);">📍</div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });

            // Pandit Ji Custom Leaflet Icon (🕉️ Sacred Vedic Badge)
            const panditIcon = L.divIcon({
                className: 'custom-pandit-icon',
                html: `<div style="background-color: #ff4d2d; color: white; border: 3px solid white; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 20px; box-shadow: 0 4px 16px rgba(255,77,45,0.6);">🕉️</div>`,
                iconSize: [44, 44],
                iconAnchor: [22, 22]
            });

            const uMarker = L.marker([userLoc.lat, userLoc.lng], { icon: userIcon }).addTo(map);
            const pMarker = L.marker([panditLoc.lat, panditLoc.lng], { icon: panditIcon }).addTo(map);

            const line = L.polyline([
                [panditLoc.lat, panditLoc.lng],
                [userLoc.lat, userLoc.lng]
            ], { color: '#ff4d2d', weight: 5, opacity: 0.8, dashArray: '8, 8' }).addTo(map);

            mapInstanceRef.current = map;
            userMarkerRef.current = uMarker;
            panditMarkerRef.current = pMarker;
            polylineRef.current = line;

            // Invalidate size to ensure container dimensions are updated inside modal
            setTimeout(() => {
                map.invalidateSize();
                const bounds = L.latLngBounds([
                    [userLoc.lat, userLoc.lng],
                    [panditLoc.lat, panditLoc.lng]
                ]);
                map.fitBounds(bounds.pad(0.3));
            }, 300);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // 3. Bidirectional Socket Stream & Pandit Location Watcher
    useEffect(() => {
        socket.emit("join_booking_room", booking._id);

        if (currentUserRole === "pandit" && navigator.geolocation) {
            watchIdRef.current = navigator.geolocation.watchPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    setPanditLoc({ lat, lng });

                    // Emit update_pandit_location
                    socket.emit("update_pandit_location", {
                        bookingId: booking._id,
                        lat,
                        lng
                    });
                },
                (err) => console.warn("Watch position error:", err.message),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
            );
        }

        // Socket Listeners
        const handleLocationUpdate = (data) => {
            if (data.bookingId !== booking._id) return;

            if (data.panditLocation) {
                const pLat = data.panditLocation.latitude;
                const pLng = data.panditLocation.longitude;
                setPanditLoc({ lat: pLat, lng: pLng });
                if (panditMarkerRef.current) panditMarkerRef.current.setLatLng([pLat, pLng]);
            }

            if (data.userLocation) {
                const uLat = data.userLocation.latitude;
                const uLng = data.userLocation.longitude;
                setUserLoc({ lat: uLat, lng: uLng });
                if (userMarkerRef.current) userMarkerRef.current.setLatLng([uLat, uLng]);
            }

            if (data.distanceKm !== undefined) setDistance(data.distanceKm);
            if (data.etaMinutes !== undefined) setEta(data.etaMinutes);

            // Update Polyline & Auto-fit bounds
            if (polylineRef.current && userMarkerRef.current && panditMarkerRef.current) {
                const uPos = userMarkerRef.current.getLatLng();
                const pPos = panditMarkerRef.current.getLatLng();
                polylineRef.current.setLatLngs([pPos, uPos]);

                if (mapInstanceRef.current) {
                    const bounds = L.latLngBounds([uPos, pPos]);
                    mapInstanceRef.current.fitBounds(bounds.pad(0.3));
                }
            }
        };

        const handleStatusUpdate = (updatedBooking) => {
            if (updatedBooking._id === booking._id) {
                setBookingStatus(updatedBooking.status);
                if (onStatusUpdated) onStatusUpdated(updatedBooking);
            }
        };

        const handleReceiveChatMessage = (data) => {
            if (data.bookingId === booking._id) {
                setChatMessages(prev => {
                    if (prev.some(m => m.id === data.id || (m.text === data.text && m.sender === data.senderRole))) return prev;
                    return [...prev, { id: data.id, sender: data.senderRole, text: data.text, createdAt: data.createdAt }];
                });
            }
        };

        const handleConnect = () => {
            console.log("[SOCKET RECONNECTED] Rejoining booking room:", booking._id);
            socket.emit("join_booking_room", booking._id);
        };

        socket.on("connect", handleConnect);
        socket.on("pandit_location_updated", handleLocationUpdate);
        socket.on("booking_location_updated", handleLocationUpdate);
        socket.on("booking_status_updated", handleStatusUpdate);
        socket.on("receive_chat_message", handleReceiveChatMessage);

        return () => {
            if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
            socket.off("connect", handleConnect);
            socket.off("pandit_location_updated", handleLocationUpdate);
            socket.off("booking_location_updated", handleLocationUpdate);
            socket.off("booking_status_updated", handleStatusUpdate);
            socket.off("receive_chat_message", handleReceiveChatMessage);
        };
    }, [booking._id, currentUserRole]);

    const handleCancelBooking = async () => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            const res = await axios.put(`${serverUrl}/api/booking/${booking._id}/status`, { status: "cancelled" }, { withCredentials: true });
            setBookingStatus("cancelled");
            if (onStatusUpdated) onStatusUpdated(res.data.booking);
            onClose();
        } catch (err) {
            alert("Failed to cancel booking.");
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        const msgText = newMessage.trim();

        const newMsg = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
            sender: currentUserRole,
            text: msgText,
            createdAt: new Date().toISOString()
        };

        setChatMessages(prev => [...prev, newMsg]);
        setNewMessage("");

        const recipientId = currentUserRole === "pandit"
            ? (booking.user?._id || booking.user)
            : (booking.pandit?.user?._id || booking.pandit?.user);

        socket.emit("send_chat_message", {
            bookingId: booking._id,
            text: msgText,
            senderRole: currentUserRole,
            recipientId
        });
    };

    const panditName = booking.pandit?.name || "Pandit Rajesh Shastri";
    const panditRating = typeof booking.pandit?.rating === 'object'
        ? (booking.pandit?.rating?.average || 4.8)
        : (booking.pandit?.rating || "4.8");
    const panditReviews = typeof booking.pandit?.rating === 'object'
        ? (booking.pandit?.rating?.count || 15)
        : (booking.pandit?.totalReviews || 15);
    const panditImage = booking.pandit?.profileImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400";
    const panditPhone = booking.pandit?.mobile || booking.userMobile || "9876543210";

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-orange-100 flex flex-col h-[92vh] max-h-[780px] relative">
                
                {/* BACK BUTTON TOP LEFT */}
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 z-[1000] w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-100 cursor-pointer min-h-[44px] min-w-[44px]"
                >
                    <FaChevronLeft size={16} />
                </button>

                {/* 1. FULL LEAFLET MAP VIEW WITH FLOATING TOP PILL (180154.jpg SCREEN 3) */}
                <div className="relative w-full h-[52%] bg-gray-100">
                    <div ref={mapRef} className="w-full h-full"></div>

                    {/* TOP FLOATING PILL (180154.jpg SCREEN 3 DESIGN) */}
                    <div className="absolute top-4 inset-x-12 z-[1000] flex justify-center pointer-events-none">
                        <div className="bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full shadow-xl border border-orange-200 flex items-center gap-3 text-center pointer-events-auto">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
                            <p className="text-xs sm:text-sm font-black text-gray-900">
                                Pandit is on the way <span className="text-gray-400 font-normal">•</span> Arriving in <span className="text-[#ff4d2d]">{eta} mins</span> <span className="text-gray-400 font-normal">•</span> <span className="text-gray-700">{distance} km</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. BOTTOM BOTTOM-SHEET / CARD (180154.jpg SCREEN 3 LAYOUT) */}
                <div className="flex-1 bg-white p-5 flex flex-col justify-between overflow-y-auto">
                    {/* PANDIT PROFILE & STATUS */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-3.5">
                            <img
                                src={panditImage}
                                alt={panditName}
                                className="w-14 h-14 rounded-full object-cover border-2 border-orange-400 shadow-md shrink-0"
                            />
                            <div>
                                <h3 className="text-base font-extrabold text-gray-900">{panditName}</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                        <FaStar size={12} className="text-amber-500" /> {panditRating} ({panditReviews})
                                    </span>
                                    <span className="text-[11px] font-black text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-200 uppercase">
                                        ● On the way
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* QUICK ACTION BUTTONS */}
                        <div className="flex items-center gap-2">
                            <a
                                href={`tel:${panditPhone}`}
                                className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-200 text-[#ff4d2d] flex items-center justify-center hover:bg-[#ff4d2d] hover:text-white transition shadow-xs cursor-pointer min-h-[44px] min-w-[44px]"
                                title="Call Pandit Ji"
                            >
                                <FaPhone size={16} />
                            </a>
                            <button
                                onClick={() => setChatOpen(!chatOpen)}
                                className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-200 text-[#ff4d2d] flex items-center justify-center hover:bg-[#ff4d2d] hover:text-white transition shadow-xs cursor-pointer min-h-[44px] min-w-[44px]"
                                title="Chat"
                            >
                                <FaCommentDots size={18} />
                            </button>
                            <button
                                onClick={handleCancelBooking}
                                className="px-3 py-2.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold hover:bg-red-600 hover:text-white transition shadow-xs cursor-pointer min-h-[44px] flex items-center gap-1"
                                title="Cancel Booking"
                            >
                                <FaBan size={14} />
                                <span className="hidden sm:inline">Cancel</span>
                            </button>
                        </div>
                    </div>

                    {/* IN-APP CHAT OVERLAY IF OPEN */}
                    {chatOpen ? (
                        <div className="my-3 p-3 bg-gray-50 rounded-2xl border border-gray-200 flex-1 flex flex-col justify-between max-h-[160px]">
                            <div className="overflow-y-auto space-y-2 pr-1 text-xs">
                                {chatMessages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-2.5 rounded-xl max-w-[80%] font-medium ${
                                            msg.sender === currentUserRole
                                                ? "bg-[#ff4d2d] text-white ml-auto rounded-br-none"
                                                : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-xs"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleSendMessage} className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#ff4d2d]"
                                />
                                <button type="submit" className="bg-[#ff4d2d] text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer">
                                    Send
                                </button>
                            </form>
                        </div>
                    ) : (
                        /* 5-STEP PROGRESS TIMELINE TRACKER (180154.jpg SCREEN 3) */
                        <div className="my-4 pt-2">
                            <div className="relative flex items-center justify-between px-2">
                                {/* Connecting Line */}
                                <div className="absolute top-3 left-6 right-6 h-1 bg-gray-200 z-0">
                                    <div
                                        className="h-full bg-[#ff4d2d] transition-all duration-500"
                                        style={{
                                            width: bookingStatus === 'completed' ? '100%' :
                                                   bookingStatus === 'accepted' ? '50%' : '25%'
                                        }}
                                    ></div>
                                </div>

                                {/* STEP 1 */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-6 h-6 rounded-full bg-[#ff4d2d] text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                                        ✓
                                    </div>
                                    <span className="text-[10px] font-extrabold text-gray-800 mt-1.5 text-center">Booking Confirmed</span>
                                    <span className="text-[9px] font-semibold text-gray-400">10:00 AM</span>
                                </div>

                                {/* STEP 2 */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-6 h-6 rounded-full bg-[#ff4d2d] text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                                        ✓
                                    </div>
                                    <span className="text-[10px] font-extrabold text-gray-800 mt-1.5 text-center">Pandit Assigned</span>
                                    <span className="text-[9px] font-semibold text-gray-400">10:02 AM</span>
                                </div>

                                {/* STEP 3 */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-6 h-6 rounded-full bg-[#ff4d2d] text-white flex items-center justify-center text-[10px] font-bold shadow-md animate-bounce">
                                        ●
                                    </div>
                                    <span className="text-[10px] font-extrabold text-[#ff4d2d] mt-1.5 text-center">On the way</span>
                                    <span className="text-[9px] font-semibold text-gray-400">10:05 AM</span>
                                </div>

                                {/* STEP 4 */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-[10px] font-bold">
                                        4
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 mt-1.5 text-center">Arriving Soon</span>
                                    <span className="text-[9px] font-medium text-gray-400">--</span>
                                </div>

                                {/* STEP 5 */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-[10px] font-bold">
                                        5
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 mt-1.5 text-center">Reached</span>
                                    <span className="text-[9px] font-medium text-gray-400">--</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="text-center pt-1 border-t border-gray-100 text-[11px] text-gray-400 font-semibold">
                        Service: <span className="text-gray-700 font-bold">{booking.serviceName}</span> • Address: <span className="text-gray-700 font-bold">{booking.address}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LiveTrackingModal;

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import useGetPanditBookings from '../hooks/useGetPanditBookings';
import PanditBookingRequestCard from './PanditBookingRequestCard';
import PanditActiveBookingCard from './PanditActiveBookingCard';
import LiveTrackingModal from './LiveTrackingModal';
import { setMyPanditProfile } from '../redux/panditSlice';
import { setUserData } from '../redux/userSlice';
import { 
    FaPrayingHands, FaPlus, FaCalendarCheck, FaTrash, FaUserEdit, 
    FaListAlt, FaBolt, FaRupeeSign, FaCog, FaSignOutAlt, FaBell, 
    FaPowerOff, FaUserCircle, FaCheckCircle, FaStar, FaHistory, FaTools, FaHome,
    FaCamera, FaImages, FaCloudUploadAlt, FaTimes
} from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

function PanditDashboard() {
    const primaryColor = "#ff4d2d";
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useGetPanditBookings();

    const { myPanditProfile, panditBookings } = useSelector(state => state.pandit);
    const { userData } = useSelector(state => state.user);

    const [activeTab, setActiveTab] = useState("requests");
    const [isOnline, setIsOnline] = useState(myPanditProfile?.isOnline !== false);
    const [togglingOnline, setTogglingOnline] = useState(false);
    const [selectedBookingForTracking, setSelectedBookingForTracking] = useState(null);

    // Profile state
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [name, setName] = useState(myPanditProfile?.name || '');
    const [experienceYears, setExperienceYears] = useState(myPanditProfile?.experienceYears || 5);
    const [mobile, setMobile] = useState(myPanditProfile?.mobile || '');
    const [city, setCity] = useState(myPanditProfile?.city || 'Indore');
    const [state, setState] = useState(myPanditProfile?.state || 'Madhya Pradesh');
    const [address, setAddress] = useState(myPanditProfile?.address || '');
    const [description, setDescription] = useState(myPanditProfile?.description || '');
    const [savingProfile, setSavingProfile] = useState(false);
    const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false);

    // Add Service state
    const [showAddService, setShowAddService] = useState(false);
    const [serviceName, setServiceName] = useState('');
    const [servicePrice, setServicePrice] = useState('');
    const [serviceDesc, setServiceDesc] = useState('');
    const [serviceDuration, setServiceDuration] = useState('2 Hours');
    const [serviceImageFile, setServiceImageFile] = useState(null);
    const [savingService, setSavingService] = useState(false);

    // Service Multi-Photo Management state
    const [uploadingServicePhotos, setUploadingServicePhotos] = useState({});
    const [photoToDelete, setPhotoToDelete] = useState(null); // { serviceId, photoUrl }
    const [serviceToDelete, setServiceToDelete] = useState(null); // serviceId

    React.useEffect(() => {
        if (myPanditProfile) {
            setName(myPanditProfile.name || '');
            setExperienceYears(myPanditProfile.experienceYears || 5);
            setCity(myPanditProfile.city || 'Indore');
            setState(myPanditProfile.state || 'Madhya Pradesh');
            setAddress(myPanditProfile.address || '');
            setDescription(myPanditProfile.description || '');
            setMobile(myPanditProfile.mobile || '');
        }
    }, [myPanditProfile]);

    const handleToggleOnline = async () => {
        try {
            setTogglingOnline(true);
            const newOnlineState = !isOnline;
            const res = await axios.put(`${serverUrl}/api/pandit/toggle-online`, { isOnline: newOnlineState }, { withCredentials: true });
            setIsOnline(newOnlineState);
            if (res.data?.pandit) dispatch(setMyPanditProfile(res.data.pandit));
            setTogglingOnline(false);
        } catch (error) {
            setIsOnline(!isOnline);
            setTogglingOnline(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(`${serverUrl}/api/auth/signout`, {}, { withCredentials: true });
            dispatch(setUserData(null));
            navigate("/signin");
        } catch (error) {
            dispatch(setUserData(null));
            navigate("/signin");
        }
    };

    // 1. Profile Photo Upload Handler
    const handleProfilePhotoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profileImage", file);

        try {
            setUploadingProfilePhoto(true);
            const res = await axios.post(`${serverUrl}/api/pandit/profile-photo`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });
            dispatch(setMyPanditProfile(res.data.pandit));
            if (res.data.user) {
                dispatch(setUserData(res.data.user));
            }
            setUploadingProfilePhoto(false);
            alert("Pandit Ji profile photo updated successfully!");
        } catch (err) {
            setUploadingProfilePhoto(false);
            console.error("Profile photo upload error:", err);
            alert(err?.response?.data?.message || "Failed to upload profile photo. Please try again.");
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            const res = await axios.post(`${serverUrl}/api/pandit/profile`, {
                name,
                experienceYears,
                city,
                state,
                address,
                mobile,
                description
            }, { withCredentials: true });

            dispatch(setMyPanditProfile(res.data.pandit));
            setSavingProfile(false);
            setShowEditProfile(false);
            alert("Pandit Ji profile updated successfully!");
        } catch (error) {
            setSavingProfile(false);
            alert(error?.response?.data?.message || "Failed to update profile.");
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        setSavingService(true);
        try {
            const formData = new FormData();
            formData.append("name", serviceName);
            formData.append("price", servicePrice);
            formData.append("description", serviceDesc);
            formData.append("duration", serviceDuration);
            if (serviceImageFile) {
                formData.append("image", serviceImageFile);
            }

            const res = await axios.post(`${serverUrl}/api/pandit/service`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });

            dispatch(setMyPanditProfile(res.data.pandit));
            setSavingService(false);
            setShowAddService(false);
            setServiceName('');
            setServicePrice('');
            setServiceDesc('');
            setServiceImageFile(null);
            alert("New Pooja service added successfully!");
        } catch (error) {
            setSavingService(false);
            console.error("Add Service Error:", error);
            alert(error?.response?.data?.message || "Failed to add service. Please try again.");
        }
    };

    // 2. Service Multiple Photos Upload Handler
    const handleUploadServicePhotos = async (serviceId, files) => {
        if (!files || files.length === 0) return;

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("photos", files[i]);
        }

        try {
            setUploadingServicePhotos(prev => ({ ...prev, [serviceId]: true }));
            const res = await axios.post(`${serverUrl}/api/pandit/service/${serviceId}/photos`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });
            dispatch(setMyPanditProfile(res.data.pandit));
            setUploadingServicePhotos(prev => ({ ...prev, [serviceId]: false }));
        } catch (err) {
            setUploadingServicePhotos(prev => ({ ...prev, [serviceId]: false }));
            alert("Failed to upload service photos.");
        }
    };

    // 3. Delete Service Photo Handler
    const confirmDeletePhoto = async () => {
        if (!photoToDelete) return;
        const { serviceId, photoUrl } = photoToDelete;
        try {
            const res = await axios.post(`${serverUrl}/api/pandit/service/${serviceId}/delete-photo`, { photoUrl }, { withCredentials: true });
            dispatch(setMyPanditProfile(res.data.pandit));
            setPhotoToDelete(null);
        } catch (err) {
            setPhotoToDelete(null);
            alert("Failed to remove photo.");
        }
    };

    // 4. Delete Service Handler
    const confirmDeleteService = async () => {
        if (!serviceToDelete) return;
        try {
            const res = await axios.delete(`${serverUrl}/api/pandit/service/${serviceToDelete}`, { withCredentials: true });
            dispatch(setMyPanditProfile(res.data.pandit));
            setServiceToDelete(null);
        } catch (err) {
            setServiceToDelete(null);
            alert("Failed to delete service.");
        }
    };

    const pendingRequests = panditBookings.filter(b => b.status === "pending");
    const activeBookings = panditBookings.filter(b => ["accepted", "on_the_way", "arriving", "reached", "started"].includes(b.status));
    const completedBookings = panditBookings.filter(b => b.status === "completed");
    const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    return (
        <div className="min-h-screen bg-[#fff9f6] flex flex-col justify-between pb-20 md:pb-8">
            {/* PANDIT DASHBOARD HEADER */}
            <header className="bg-white border-b border-orange-100 sticky top-0 z-30 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
                    {/* Left Brand / Profile Avatar Upload */}
                    <div className="flex items-center gap-3">
                        <div className="relative group cursor-pointer">
                            <img
                                src={myPanditProfile?.profileImage || "/logo.png"}
                                alt={myPanditProfile?.name || "Pandit Ji"}
                                className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-xs"
                            />
                            <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                {uploadingProfilePhoto ? <ClipLoader size={14} color="#fff" /> : <FaCamera size={14} />}
                                <input type="file" accept="image/*" className="hidden" onChange={handleProfilePhotoChange} />
                            </label>
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                                Namaste, {myPanditProfile?.name || "Pandit Ji"} 🙏
                            </h2>
                            <span className="text-[11px] font-bold text-gray-500 block">
                                Partner Service Provider Dashboard
                            </span>
                        </div>
                    </div>

                    {/* Right Actions: Online Toggle */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleToggleOnline}
                            disabled={togglingOnline}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-black transition shadow-xs cursor-pointer min-h-[44px] ${
                                isOnline
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-gray-700 text-gray-200 hover:bg-gray-800"
                            }`}
                        >
                            <FaPowerOff className={isOnline ? "animate-pulse" : ""} />
                            <span>{isOnline ? "ONLINE" : "OFFLINE"}</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            title="Logout"
                            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer min-h-[44px]"
                        >
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* DASHBOARD BODY CONTAINER */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* DESKTOP SIDEBAR NAVIGATION */}
                <aside className="hidden lg:block lg:col-span-1 space-y-4">
                    {/* Stats Card */}
                    <div className="bg-gradient-to-br from-[#1c1917] to-[#292524] text-white p-5 rounded-3xl shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-700 pb-3">
                            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Total Earnings</span>
                            <FaRupeeSign className="text-amber-400" />
                        </div>
                        <h3 className="text-3xl font-black text-white">₹{totalEarnings}</h3>
                        <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                            <div className="bg-stone-800/80 p-2 rounded-xl">
                                <span className="text-stone-400 block text-[10px]">Requests</span>
                                <span className="font-bold text-amber-400">{pendingRequests.length}</span>
                            </div>
                            <div className="bg-stone-800/80 p-2 rounded-xl">
                                <span className="text-stone-400 block text-[10px]">Active</span>
                                <span className="font-bold text-green-400">{activeBookings.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Nav Links */}
                    <div className="bg-white rounded-3xl p-3 border border-orange-100 shadow-sm space-y-1">
                        <button
                            onClick={() => setActiveTab("requests")}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black transition cursor-pointer min-h-[44px] ${
                                activeTab === "requests" ? "bg-[#ff4d2d] text-white shadow-md" : "text-gray-700 hover:bg-orange-50"
                            }`}
                        >
                            <span className="flex items-center gap-2.5"><FaBolt /> Booking Requests</span>
                            {pendingRequests.length > 0 && (
                                <span className="bg-white text-[#ff4d2d] px-2 py-0.5 rounded-full text-[10px] font-black">{pendingRequests.length}</span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab("active")}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black transition cursor-pointer min-h-[44px] ${
                                activeTab === "active" ? "bg-[#ff4d2d] text-white shadow-md" : "text-gray-700 hover:bg-orange-50"
                            }`}
                        >
                            <span className="flex items-center gap-2.5"><FaPrayingHands /> Active Booking</span>
                            {activeBookings.length > 0 && (
                                <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black">{activeBookings.length}</span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab("bookings")}
                            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black transition cursor-pointer min-h-[44px] ${
                                activeTab === "bookings" ? "bg-[#ff4d2d] text-white shadow-md" : "text-gray-700 hover:bg-orange-50"
                            }`}
                        >
                            <FaHistory /> Booking History ({completedBookings.length})
                        </button>

                        <button
                            onClick={() => setActiveTab("services")}
                            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black transition cursor-pointer min-h-[44px] ${
                                activeTab === "services" ? "bg-[#ff4d2d] text-white shadow-md" : "text-gray-700 hover:bg-orange-50"
                            }`}
                        >
                            <FaTools /> Services & Photos ({(myPanditProfile?.services || []).length})
                        </button>

                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black transition cursor-pointer min-h-[44px] ${
                                activeTab === "profile" ? "bg-[#ff4d2d] text-white shadow-md" : "text-gray-700 hover:bg-orange-50"
                            }`}
                        >
                            <FaUserCircle /> Pandit Profile
                        </button>
                    </div>
                </aside>

                {/* MAIN DASHBOARD CONTENT AREA */}
                <main className="lg:col-span-3 space-y-6">
                    {/* TAB: REQUESTS */}
                    {activeTab === "requests" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-gray-900">
                                    Incoming Booking Requests ({pendingRequests.length})
                                </h3>
                                <span className="text-xs font-bold text-gray-500">Real-Time Socket Active</span>
                            </div>

                            {pendingRequests.length === 0 ? (
                                <div className="bg-white rounded-3xl p-10 text-center border border-orange-100 shadow-xs">
                                    <FaBell className="mx-auto text-orange-300 text-5xl mb-3" />
                                    <h4 className="text-lg font-black text-gray-800">No Pending Requests</h4>
                                    <p className="text-xs text-gray-500 mt-1">New booking requests will trigger audio/popup alerts automatically.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {pendingRequests.map((booking) => (
                                        <PanditBookingRequestCard
                                            key={booking._id}
                                            booking={booking}
                                            onAcceptSuccess={() => setActiveTab("active")}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: ACTIVE BOOKING */}
                    {activeTab === "active" && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-gray-900">
                                Active Accepted Booking ({activeBookings.length})
                            </h3>

                            {activeBookings.length === 0 ? (
                                <div className="bg-white rounded-3xl p-10 text-center border border-orange-100 shadow-xs">
                                    <FaPrayingHands className="mx-auto text-green-300 text-5xl mb-3" />
                                    <h4 className="text-lg font-black text-gray-800">No Active Booking Currently</h4>
                                    <p className="text-xs text-gray-500 mt-1">Accept an incoming request to start live route tracking.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {activeBookings.map((booking) => (
                                        <PanditActiveBookingCard
                                            key={booking._id}
                                            booking={booking}
                                            onViewMap={() => setSelectedBookingForTracking(booking)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: BOOKING HISTORY */}
                    {activeTab === "bookings" && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-gray-900">
                                Completed Booking History ({completedBookings.length})
                            </h3>

                            {completedBookings.length === 0 ? (
                                <div className="bg-white rounded-3xl p-10 text-center border border-orange-100 shadow-xs">
                                    <FaHistory className="mx-auto text-gray-300 text-5xl mb-3" />
                                    <h4 className="text-lg font-black text-gray-800">No Completed Bookings Yet</h4>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {completedBookings.map((b) => (
                                        <div key={b._id} className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 flex items-center justify-between">
                                            <div>
                                                <span className="text-[10px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✓ COMPLETED</span>
                                                <h4 className="font-extrabold text-base text-gray-900 mt-1">{b.serviceName}</h4>
                                                <p className="text-xs text-gray-500">Customer: {b.userName} • {b.date}</p>
                                            </div>
                                            <span className="text-lg font-black text-gray-900">₹{b.totalAmount}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: SERVICES & PHOTO GALLERIES */}
                    {activeTab === "services" && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">My Offered Services & Photo Galleries</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Upload photos for Havan, Hawan Kund, and ritual arrangements.</p>
                                </div>
                                <button
                                    onClick={() => setShowAddService(!showAddService)}
                                    className="px-4 py-2.5 bg-[#ff4d2d] text-white text-xs font-black rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 min-h-[44px]"
                                >
                                    <FaPlus /> Add New Service
                                </button>
                            </div>

                            {/* Add Service Form */}
                            {showAddService && (
                                <form onSubmit={handleAddService} className="bg-white p-5 rounded-3xl border border-orange-200 space-y-3 shadow-md">
                                    <h4 className="font-extrabold text-sm text-gray-900">Add New Pooja Service</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="Service Name (e.g. Satyanarayan Katha)"
                                            required
                                            value={serviceName}
                                            onChange={(e) => setServiceName(e.target.value)}
                                            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-xs font-semibold min-h-[44px]"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Price in ₹"
                                            required
                                            value={servicePrice}
                                            onChange={(e) => setServicePrice(e.target.value)}
                                            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-xs font-semibold min-h-[44px]"
                                        />
                                    </div>
                                    <textarea
                                        placeholder="Service Description & Samagri guidance..."
                                        rows={2}
                                        value={serviceDesc}
                                        onChange={(e) => setServiceDesc(e.target.value)}
                                        className="w-full border border-gray-300 rounded-xl p-3 text-xs font-semibold"
                                    />
                                    <div>
                                        <label className="block text-[11px] font-extrabold text-gray-600 mb-1">
                                            Service Cover Image (Optional)
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setServiceImageFile(e.target.files?.[0] || null)}
                                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-[#ff4d2d]"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={savingService}
                                        className="w-full py-3 bg-green-600 text-white font-black text-xs rounded-xl shadow-md min-h-[44px] cursor-pointer"
                                    >
                                        {savingService ? <ClipLoader size={16} color="#fff" /> : "Save Service"}
                                    </button>
                                </form>
                            )}

                            {/* Services List with Multi-Photo Gallery Controls */}
                            <div className="space-y-6">
                                {(myPanditProfile?.services || []).map((s) => {
                                    const servicePhotos = Array.from(new Set([s.image, ...(s.photos || [])].filter(Boolean)));
                                    const isUploading = uploadingServicePhotos[s._id];

                                    return (
                                        <div key={s._id} className="bg-white p-5 rounded-3xl border border-orange-100 shadow-sm space-y-4">
                                            {/* Service Header */}
                                            <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                                                <div>
                                                    <h4 className="font-black text-base text-gray-900">{s.name}</h4>
                                                    <p className="text-xs text-gray-500 mt-0.5">{s.description || "Authentic Vedic ritual"}</p>
                                                    <span className="text-xs font-bold text-gray-400 mt-1 block">Duration: {s.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl font-black text-[#ff4d2d]">₹{s.price}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setServiceToDelete(s._id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                                                        title="Delete Service"
                                                    >
                                                        <FaTrash size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Service Photo Gallery Grid */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-extrabold text-gray-700 flex items-center gap-1.5">
                                                        <FaImages className="text-[#ff4d2d]" /> Service Photos Gallery ({servicePhotos.length})
                                                    </span>

                                                    {/* Upload Multi-Photos Button */}
                                                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#ff4d2d] text-xs font-bold rounded-xl border border-orange-200 cursor-pointer min-h-[44px]">
                                                        {isUploading ? <ClipLoader size={12} color="#ff4d2d" /> : <FaCloudUploadAlt size={16} />}
                                                        <span>{isUploading ? "Uploading..." : "+ Add Photos"}</span>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => handleUploadServicePhotos(s._id, e.target.files)}
                                                        />
                                                    </label>
                                                </div>

                                                {servicePhotos.length === 0 ? (
                                                    <div className="p-4 bg-orange-50/50 rounded-2xl border border-dashed border-orange-200 text-center text-xs text-gray-500 font-semibold">
                                                        No photos added yet. Click "+ Add Photos" to upload multiple ritual images.
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                                                        {servicePhotos.map((pUrl, pIdx) => (
                                                            <div key={pIdx} className="relative group rounded-xl overflow-hidden border border-gray-200 h-24 bg-gray-50">
                                                                <img src={pUrl} alt="service" className="w-full h-full object-cover" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setPhotoToDelete({ serviceId: s._id, photoUrl: pUrl })}
                                                                    className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-80 hover:opacity-100 transition shadow-md cursor-pointer"
                                                                    title="Remove Photo"
                                                                >
                                                                    <FaTimes size={12} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* TAB: PROFILE */}
                    {activeTab === "profile" && (
                        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <h3 className="text-lg font-black text-gray-900">Pandit Ji Profile Details</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowEditProfile(!showEditProfile)}
                                    className="px-3.5 py-2 text-xs font-extrabold text-[#ff4d2d] bg-orange-50 hover:bg-orange-100 rounded-xl border border-orange-200 cursor-pointer min-h-[44px] flex items-center gap-1.5"
                                >
                                    <FaUserEdit /> {showEditProfile ? "Cancel Editing" : "Edit Profile"}
                                </button>
                            </div>

                            {/* Profile Photo Display & Upload Box */}
                            <div className="flex items-center gap-4 bg-orange-50/60 p-4 rounded-2xl border border-orange-100">
                                <div className="relative group cursor-pointer">
                                    <img
                                        src={myPanditProfile?.profileImage || "/logo.png"}
                                        alt={myPanditProfile?.name}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-orange-400 shadow-md"
                                    />
                                    <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                        {uploadingProfilePhoto ? <ClipLoader size={16} color="#fff" /> : <FaCamera size={16} />}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleProfilePhotoChange} />
                                    </label>
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-gray-900">Profile Photo</h4>
                                    <p className="text-xs text-gray-500">Click photo icon to update your public profile picture.</p>
                                </div>
                            </div>

                            {/* EDIT PROFILE FORM */}
                            {showEditProfile ? (
                                <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-extrabold text-gray-700 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-bold min-h-[44px]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-extrabold text-gray-700 mb-1">Experience (Years)</label>
                                            <input
                                                type="number"
                                                required
                                                value={experienceYears}
                                                onChange={(e) => setExperienceYears(e.target.value)}
                                                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-bold min-h-[44px]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-extrabold text-gray-700 mb-1">Mobile Number</label>
                                            <input
                                                type="text"
                                                required
                                                value={mobile}
                                                onChange={(e) => setMobile(e.target.value)}
                                                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-bold min-h-[44px]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-extrabold text-gray-700 mb-1">City</label>
                                            <input
                                                type="text"
                                                required
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-bold min-h-[44px]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-extrabold text-gray-700 mb-1">State</label>
                                            <input
                                                type="text"
                                                required
                                                value={state}
                                                onChange={(e) => setState(e.target.value)}
                                                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-bold min-h-[44px]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-extrabold text-gray-700 mb-1">Local Address</label>
                                            <input
                                                type="text"
                                                required
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-bold min-h-[44px]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-extrabold text-gray-700 mb-1">About / Bio</label>
                                        <textarea
                                            rows={3}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full border border-gray-300 rounded-xl p-3 text-xs font-semibold"
                                            placeholder="Experienced Gurukul Pandit Ji specializing in authentic Vedic rituals..."
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowEditProfile(false)}
                                            className="w-1/2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs rounded-xl min-h-[44px] cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={savingProfile}
                                            className="w-1/2 py-3 bg-[#ff4d2d] hover:bg-[#e64323] text-white font-black text-xs rounded-xl shadow-md min-h-[44px] cursor-pointer flex items-center justify-center"
                                        >
                                            {savingProfile ? <ClipLoader size={16} color="#fff" /> : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-gray-700 pt-2">
                                    <div>
                                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Full Name</span>
                                        <span className="text-sm font-black text-gray-900">{myPanditProfile?.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Experience</span>
                                        <span className="text-sm font-black text-gray-900">{myPanditProfile?.experienceYears || 5} Years</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Location</span>
                                        <span className="text-sm font-black text-gray-900">{myPanditProfile?.address}, {myPanditProfile?.city}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Mobile</span>
                                        <span className="text-sm font-black text-gray-900">{myPanditProfile?.mobile}</span>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <span className="text-gray-400 block text-[10px] uppercase font-bold">About / Bio</span>
                                        <span className="text-xs font-medium text-gray-700 mt-1 block leading-relaxed">{myPanditProfile?.description || "Experienced Pandit Ji offering authentic Vedic ceremonies."}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* DELETE PHOTO CONFIRMATION MODAL */}
            {photoToDelete && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl border border-orange-100">
                        <h3 className="text-lg font-black text-gray-900">Remove Photo?</h3>
                        <p className="text-xs text-gray-600">Are you sure you want to delete this photo from the service gallery?</p>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setPhotoToDelete(null)}
                                className="w-1/2 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl cursor-pointer min-h-[44px]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeletePhoto}
                                className="w-1/2 py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer min-h-[44px]"
                            >
                                Delete Photo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE SERVICE CONFIRMATION MODAL */}
            {serviceToDelete && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl border border-orange-100">
                        <h3 className="text-lg font-black text-gray-900">Delete Service?</h3>
                        <p className="text-xs text-gray-600">Are you sure you want to permanently delete this service?</p>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setServiceToDelete(null)}
                                className="w-1/2 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl cursor-pointer min-h-[44px]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteService}
                                className="w-1/2 py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer min-h-[44px]"
                            >
                                Delete Service
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MOBILE BOTTOM NAVIGATION BAR */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40 px-2 py-1.5 flex items-center justify-around">
                <button
                    type="button"
                    onClick={() => setActiveTab("requests")}
                    className={`flex flex-col items-center justify-center min-h-[44px] min-w-[60px] cursor-pointer ${
                        activeTab === "requests" ? "text-[#ff4d2d] font-black" : "text-gray-500 font-semibold"
                    }`}
                >
                    <div className="relative">
                        <FaBolt size={18} />
                        {pendingRequests.length > 0 && (
                            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                                {pendingRequests.length}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] mt-0.5">Requests</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("active")}
                    className={`flex flex-col items-center justify-center min-h-[44px] min-w-[60px] cursor-pointer ${
                        activeTab === "active" ? "text-[#ff4d2d] font-black" : "text-gray-500 font-semibold"
                    }`}
                >
                    <div className="relative">
                        <FaPrayingHands size={18} />
                        {activeBookings.length > 0 && (
                            <span className="absolute -top-1 -right-2 bg-green-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                                {activeBookings.length}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] mt-0.5">Active</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("bookings")}
                    className={`flex flex-col items-center justify-center min-h-[44px] min-w-[60px] cursor-pointer ${
                        activeTab === "bookings" ? "text-[#ff4d2d] font-black" : "text-gray-500 font-semibold"
                    }`}
                >
                    <FaHistory size={18} />
                    <span className="text-[10px] mt-0.5">History</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("services")}
                    className={`flex flex-col items-center justify-center min-h-[44px] min-w-[60px] cursor-pointer ${
                        activeTab === "services" ? "text-[#ff4d2d] font-black" : "text-gray-500 font-semibold"
                    }`}
                >
                    <FaTools size={18} />
                    <span className="text-[10px] mt-0.5">Services</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("profile")}
                    className={`flex flex-col items-center justify-center min-h-[44px] min-w-[60px] cursor-pointer ${
                        activeTab === "profile" ? "text-[#ff4d2d] font-black" : "text-gray-500 font-semibold"
                    }`}
                >
                    <FaUserCircle size={18} />
                    <span className="text-[10px] mt-0.5">Profile</span>
                </button>
            </nav>

            {/* LIVE TRACKING MODAL */}
            {selectedBookingForTracking && (
                <LiveTrackingModal
                    booking={selectedBookingForTracking}
                    currentUserRole="pandit"
                    onClose={() => setSelectedBookingForTracking(null)}
                />
            )}
        </div>
    );
}

export default PanditDashboard;

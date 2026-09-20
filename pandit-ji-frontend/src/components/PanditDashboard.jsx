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
import { useNavigate, useLocation } from 'react-router-dom';

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

function PanditDashboard() {
    const primaryColor = "#ff4d2d";
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const locationState = useLocation();
    useGetPanditBookings();

    const { myPanditProfile, panditBookings } = useSelector(state => state.pandit);
    const { userData } = useSelector(state => state.user);

    const [activeTab, setActiveTab] = useState("requests");
    const [isOnline, setIsOnline] = useState(myPanditProfile?.isOnline !== false);
    const [togglingOnline, setTogglingOnline] = useState(false);
    const [selectedBookingForTracking, setSelectedBookingForTracking] = useState(null);

    const targetBookingId = locationState.state?.bookingId;

    React.useEffect(() => {
        if (targetBookingId && panditBookings && panditBookings.length > 0) {
            const found = panditBookings.find(b => b._id === targetBookingId);
            if (found) {
                setSelectedBookingForTracking(found);
            }
        }
    }, [targetBookingId, panditBookings]);

    // Notifications State
    const [notifications, setNotifications] = useState([]);
    const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
    const [loadingNotifications, setLoadingNotifications] = useState(false);

    const fetchNotifications = async () => {
        try {
            setLoadingNotifications(true);
            const token = localStorage.getItem("pandit_ji_token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await axios.get(`${serverUrl}/api/notifications`, { headers, withCredentials: true });
            if (Array.isArray(res.data)) {
                setNotifications(res.data);
            } else if (res.data?.notifications) {
                setNotifications(res.data.notifications);
            }
            setLoadingNotifications(false);
        } catch (error) {
            setLoadingNotifications(false);
        }
    };

    React.useEffect(() => {
        fetchNotifications();
    }, []);

    const markAllNotificationsRead = async () => {
        try {
            const token = localStorage.getItem("pandit_ji_token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            await axios.put(`${serverUrl}/api/notifications/read-all`, {}, { headers, withCredentials: true });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark notifications read", error);
        }
    };

    const handlePanditDismissNotification = async (e, notifId) => {
        e.stopPropagation();
        setNotifications(prev => prev.filter(n => (n._id || n.id) !== notifId));
        try {
            const token = localStorage.getItem("pandit_ji_token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            await axios.delete(`${serverUrl}/api/notifications/${notifId}`, { headers, withCredentials: true });
        } catch (err) {
            console.error("Failed to delete notification from DB:", err.message);
        }
    };

    const handlePanditNotificationClick = async (notif) => {
        const notifId = notif._id || notif.id;
        if (!notif.isRead && notifId) {
            try {
                const token = localStorage.getItem("pandit_ji_token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                await axios.put(`${serverUrl}/api/notifications/${notifId}/read`, {}, { headers, withCredentials: true });
                setNotifications(prev => prev.map(n => (n._id || n.id) === notifId ? { ...n, isRead: true } : n));
            } catch (err) {
                console.error("Error marking notification read:", err.message);
            }
        }
        setShowNotificationsDropdown(false);

        const targetBookingId = notif.bookingId || notif.data?.bookingId;
        if (targetBookingId && panditBookings && panditBookings.length > 0) {
            const found = panditBookings.find(b => b._id === targetBookingId);
            if (found) {
                setSelectedBookingForTracking(found);
                return;
            }
        }

        if (notif.type === "booking_request") {
            setActiveTab("requests");
        } else {
            setActiveTab("active");
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

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
    const [editingServiceId, setEditingServiceId] = useState(null);
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
        } catch (error) {
            console.warn("Signout API call completed with warning:", error.message);
        } finally {
            localStorage.removeItem("pandit_ji_token");
            sessionStorage.clear();
            dispatch(setUserData(null));
            dispatch(setMyPanditProfile(null));
            navigate("/signin", { replace: true });
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
            const token = localStorage.getItem("pandit_ji_token");
            const requestHeaders = {};
            if (token) {
                requestHeaders["Authorization"] = `Bearer ${token}`;
            }

            const res = await axios.post(`${serverUrl}/api/pandit/profile-photo`, formData, {
                headers: requestHeaders,
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
            console.error("Profile photo upload error details:", err);
            const errorMsg = err?.response?.data?.message || err?.message || "Failed to upload profile photo. Please check network connection and try again.";
            alert(`⚠️ Profile Photo Upload Failed: ${errorMsg}`);
        }
    };

    // 1B. Profile Background Cover Upload Handler
    const handleBackgroundPhotoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("backgroundImage", file);

        try {
            const token = localStorage.getItem("pandit_ji_token");
            const requestHeaders = {};
            if (token) requestHeaders["Authorization"] = `Bearer ${token}`;

            const res = await axios.post(`${serverUrl}/api/pandit/background-photo`, formData, {
                headers: requestHeaders,
                withCredentials: true
            });

            dispatch(setMyPanditProfile(res.data.pandit));
            alert("Pandit Ji profile background hero image updated successfully!");
        } catch (err) {
            alert(`⚠️ Background Image Upload Failed: ${err?.response?.data?.message || err?.message}`);
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
            if (editingServiceId) {
                formData.append("serviceId", editingServiceId);
            }
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
            setEditingServiceId(null);
            setServiceName('');
            setServicePrice('');
            setServiceDesc('');
            setServiceImageFile(null);
            alert(editingServiceId ? "Pooja service updated successfully!" : "New Pooja service added successfully!");
        } catch (error) {
            setSavingService(false);
            console.error("Save Service Error:", error);
            alert(error?.response?.data?.message || "Failed to save service. Please try again.");
        }
    };

    const handleStartEditService = (service) => {
        setEditingServiceId(service._id);
        setServiceName(service.name || '');
        setServicePrice(service.price || '');
        setServiceDesc(service.description || '');
        setServiceDuration(service.duration || '2 Hours');
        setServiceImageFile(null);
        setShowAddService(true);
    };

    const handleResetServiceForm = () => {
        setEditingServiceId(null);
        setServiceName('');
        setServicePrice('');
        setServiceDesc('');
        setServiceDuration('2 Hours');
        setServiceImageFile(null);
        setShowAddService(!showAddService);
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

    const [showAccountDropdown, setShowAccountDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-[#fff9f6] flex flex-col justify-between pb-20 md:pb-8">
            {/* PANDIT DASHBOARD STANDARDIZED NAVBAR */}
            <header className="bg-[#fff9f6] border-b border-orange-100 sticky top-0 z-[9999] shadow-sm h-[75px] md:h-[85px] flex items-center px-3 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    {/* Left Brand - Maharaj Ji Logo */}
                    <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => navigate("/")}>
                        <img
                            src="/logo.png"
                            alt="Maharaj Ji Partner"
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover aspect-square shadow-sm border-2 border-orange-400"
                        />
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl sm:text-2xl font-black text-[#ff4d2d] tracking-tight">Maharaj Ji</h1>
                            <span className="hidden sm:inline-block bg-orange-100 text-[#ff4d2d] text-[10px] font-black px-2 py-0.5 rounded-md border border-orange-200">
                                PARTNER
                            </span>
                        </div>
                    </div>

                    {/* Right Actions: Online/Offline Toggle, Bell Icon, Account Control Dropdown */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Compact Online/Offline Toggle Button */}
                        <button
                            type="button"
                            onClick={handleToggleOnline}
                            disabled={togglingOnline}
                            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-black transition shadow-xs cursor-pointer min-h-[40px] ${
                                isOnline
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-gray-700 text-gray-200 hover:bg-gray-800"
                            }`}
                            title="Toggle Online Status"
                        >
                            <FaPowerOff className={isOnline ? "animate-pulse" : ""} size={12} />
                            <span className="hidden sm:inline">{isOnline ? "ONLINE" : "OFFLINE"}</span>
                            <span className="sm:hidden text-[10px]">{isOnline ? "ON" : "OFF"}</span>
                        </button>

                        {/* Notification Bell Dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowNotificationsDropdown(!showNotificationsDropdown);
                                    setShowAccountDropdown(false);
                                    if (!showNotificationsDropdown) fetchNotifications();
                                }}
                                className="relative p-2 sm:p-2.5 rounded-full text-gray-700 hover:bg-orange-100 hover:text-[#ff4d2d] transition cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center border border-orange-200 bg-white shadow-xs"
                                title="Notifications"
                            >
                                <FaBell size={16} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notification Popup Modal / Dropdown */}
                            {showNotificationsDropdown && (
                                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-orange-100 z-[99999] overflow-hidden">
                                    <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FaBell size={16} />
                                            <h4 className="font-extrabold text-sm">Notifications ({notifications.length})</h4>
                                        </div>
                                        {unreadCount > 0 && (
                                            <button
                                                type="button"
                                                onClick={markAllNotificationsRead}
                                                className="text-[10px] font-black underline bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg cursor-pointer"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>

                                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 p-2">
                                        {notifications.length === 0 ? (
                                            <div className="p-6 text-center text-xs text-gray-500 font-semibold">
                                                No notifications yet.
                                            </div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div
                                                    key={n._id || n.id}
                                                    onClick={() => handlePanditNotificationClick(n)}
                                                    className={`p-3 rounded-2xl text-xs transition space-y-1 cursor-pointer group border ${
                                                        !n.isRead ? "bg-orange-50/90 border-orange-200 shadow-xs" : "bg-white border-gray-100 hover:bg-gray-50 text-gray-600"
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex items-center gap-1.5 min-w-0">
                                                            {!n.isRead && (
                                                                <span className="w-2 h-2 rounded-full bg-[#ff4d2d] shrink-0 animate-pulse"></span>
                                                            )}
                                                            <span className="font-extrabold text-gray-900 truncate">{n.title || "Booking Alert"}</span>
                                                        </div>

                                                        {/* ✕ DISMISS BUTTON */}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handlePanditDismissNotification(e, n._id || n.id)}
                                                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition shrink-0 ml-1"
                                                            title="Dismiss notification"
                                                        >
                                                            <FaTimes size={14} />
                                                        </button>
                                                    </div>

                                                    <p className="text-gray-700 leading-snug break-words">{n.message || n.text}</p>
                                                    
                                                    <div className="flex items-center justify-between pt-1 border-t border-gray-100/60">
                                                        <span className="text-[9px] text-gray-400 font-semibold">
                                                            {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                                                        </span>
                                                        <span className="text-[9px] font-black text-[#ff4d2d] group-hover:underline">
                                                            Tap to view →
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile / Account Control Dropdown Trigger */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAccountDropdown(!showAccountDropdown);
                                    setShowNotificationsDropdown(false);
                                }}
                                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-orange-200 bg-white hover:bg-orange-50 transition cursor-pointer min-h-[40px] shadow-xs"
                            >
                                <img
                                    src={myPanditProfile?.profileImage || "/logo.png"}
                                    alt={myPanditProfile?.name || "Pandit Ji"}
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-orange-400 aspect-square"
                                />
                                <span className="hidden md:inline-block text-xs font-black text-gray-800 max-w-[100px] truncate">
                                    {myPanditProfile?.name || userData?.fullName || "Pandit Ji"}
                                </span>
                            </button>

                            {/* Account Dropdown Menu */}
                            {showAccountDropdown && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-orange-100 z-[99999] overflow-hidden p-2">
                                    <div className="p-3 bg-orange-50 rounded-xl mb-1 border border-orange-100 flex items-center gap-3">
                                        <img
                                            src={myPanditProfile?.profileImage || "/logo.png"}
                                            alt={myPanditProfile?.name || "Pandit Ji"}
                                            className="w-10 h-10 rounded-full object-cover border border-orange-400"
                                        />
                                        <div>
                                            <h4 className="font-extrabold text-xs text-gray-900 truncate">
                                                {myPanditProfile?.name || userData?.fullName || "Pandit Ji"}
                                            </h4>
                                            <span className="text-[10px] text-gray-500 font-bold block">
                                                Vedic Acharya / Partner
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-0.5 text-xs font-bold text-gray-700">
                                        <button
                                            type="button"
                                            onClick={() => { setActiveTab("requests"); setShowAccountDropdown(false); }}
                                            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-orange-50 hover:text-[#ff4d2d] flex items-center gap-2 transition"
                                        >
                                            <FaBolt className="text-amber-500" /> Booking Requests ({pendingRequests.length})
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setActiveTab("active"); setShowAccountDropdown(false); }}
                                            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-orange-50 hover:text-[#ff4d2d] flex items-center gap-2 transition"
                                        >
                                            <FaPrayingHands className="text-green-600" /> Active Booking ({activeBookings.length})
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setActiveTab("services"); setShowAccountDropdown(false); }}
                                            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-orange-50 hover:text-[#ff4d2d] flex items-center gap-2 transition"
                                        >
                                            <FaTools className="text-[#ff4d2d]" /> Manage Services & Pricing
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setActiveTab("profile"); setShowAccountDropdown(false); }}
                                            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-orange-50 hover:text-[#ff4d2d] flex items-center gap-2 transition"
                                        >
                                            <FaUserEdit className="text-blue-600" /> Profile / Edit Profile
                                        </button>
                                        <div className="border-t border-gray-100 pt-1 mt-1">
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="w-full text-left px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 flex items-center gap-2 transition font-extrabold"
                                            >
                                                <FaSignOutAlt /> Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* DASHBOARD HERO BANNER (CLEAN & MODERN) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
                <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white p-6 sm:p-8 shadow-xl border-2 border-orange-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-xl z-10">
                        <span className="bg-white/20 backdrop-blur-md text-yellow-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
                            🕉️ Partner Acharya Portal
                        </span>
                        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md leading-tight">
                            Namaste, {myPanditProfile?.name || userData?.fullName || "Ritwik Dubey"} 🙏
                        </h1>
                        <p className="text-orange-100 text-xs sm:text-sm font-semibold leading-relaxed">
                            Ready to serve your devotees today? Manage your incoming booking requests, active ritual ceremonies, and service prices easily.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 w-full md:w-auto z-10">
                        <div className="bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center">
                            <span className="text-[10px] uppercase font-bold text-orange-200 block">Earnings</span>
                            <span className="text-lg sm:text-xl font-black text-white">₹{totalEarnings}</span>
                        </div>
                        <div className="bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center">
                            <span className="text-[10px] uppercase font-bold text-orange-200 block">Requests</span>
                            <span className="text-lg sm:text-xl font-black text-yellow-300">{pendingRequests.length}</span>
                        </div>
                        <div className="bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center">
                            <span className="text-[10px] uppercase font-bold text-orange-200 block">Active</span>
                            <span className="text-lg sm:text-xl font-black text-green-300">{activeBookings.length}</span>
                        </div>
                    </div>
                </div>
            </div>

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

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-black text-red-600 hover:bg-red-50 transition cursor-pointer min-h-[44px] border border-red-100 mt-2"
                        >
                            <FaSignOutAlt /> Logout
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
                                    onClick={handleResetServiceForm}
                                    className="px-4 py-2.5 bg-[#ff4d2d] text-white text-xs font-black rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 min-h-[44px]"
                                >
                                    <FaPlus /> {showAddService && !editingServiceId ? "Close Form" : "+ Add New Service"}
                                </button>
                            </div>

                            {/* Add / Edit Service Form */}
                            {showAddService && (
                                <form onSubmit={handleAddService} className="bg-white p-5 rounded-3xl border border-orange-200 space-y-3 shadow-md">
                                    <div className="flex items-center justify-between border-b border-orange-100 pb-2">
                                        <h4 className="font-extrabold text-sm text-gray-900">
                                            {editingServiceId ? "✏️ Edit Pooja Service" : "Add New Pooja Service"}
                                        </h4>
                                        {editingServiceId && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingServiceId(null);
                                                    setServiceName('');
                                                    setServicePrice('');
                                                    setServiceDesc('');
                                                    setShowAddService(false);
                                                }}
                                                className="text-xs text-red-500 hover:underline font-bold"
                                            >
                                                Cancel Edit
                                            </button>
                                        )}
                                    </div>
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
                                        {savingService ? <ClipLoader size={16} color="#fff" /> : (editingServiceId ? "Update Service" : "Save Service")}
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
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl font-black text-[#ff4d2d]">₹{s.price}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStartEditService(s)}
                                                        className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#ff4d2d] border border-orange-200 rounded-xl text-xs font-bold transition cursor-pointer min-h-[44px] flex items-center gap-1"
                                                        title="Edit Service Details"
                                                    >
                                                        <FaUserEdit size={14} /> <span>Edit Service</span>
                                                    </button>
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
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-orange-100 shadow-sm space-y-6 max-w-3xl mx-auto">
                            <div className="flex flex-col items-center text-center border-b border-gray-100 pb-6 space-y-4">
                                {/* CENTERED PROFILE PHOTO WITH EDIT PHOTO BUTTON */}
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <div className="relative group">
                                        <img
                                            src={myPanditProfile?.profileImage || "/logo.png"}
                                            alt={myPanditProfile?.name || "Pandit Ji"}
                                            className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-[#ff4d2d] shadow-xl aspect-square"
                                        />
                                        <label
                                            className="absolute bottom-1 right-1 bg-[#ff4d2d] hover:bg-[#e64323] text-white p-3 rounded-full shadow-lg cursor-pointer transition flex items-center justify-center border-2 border-white"
                                            title="Change Profile Photo"
                                        >
                                            {uploadingProfilePhoto ? (
                                                <ClipLoader size={18} color="#fff" />
                                            ) : (
                                                <FaCamera size={18} />
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleProfilePhotoChange}
                                                disabled={uploadingProfilePhoto}
                                            />
                                        </label>
                                    </div>

                                    {/* EXPLICIT CENTERED UPLOAD BUTTON */}
                                    <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-50 hover:bg-orange-100 text-[#ff4d2d] border-2 border-orange-200 rounded-2xl text-xs font-black cursor-pointer transition shadow-xs min-h-[44px]">
                                        {uploadingProfilePhoto ? (
                                            <>
                                                <ClipLoader size={14} color="#ff4d2d" />
                                                <span>Uploading Photo...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaCamera size={15} />
                                                <span>📷 UPLOAD NEW PROFILE PHOTO</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleProfilePhotoChange}
                                            disabled={uploadingProfilePhoto}
                                        />
                                    </label>
                                </div>

                                <div>
                                    <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                                        {myPanditProfile?.name || "Pandit Ji"}
                                    </h3>
                                    <p className="text-xs text-gray-500 font-semibold mt-0.5">
                                        {myPanditProfile?.city}, {myPanditProfile?.state} • {myPanditProfile?.experienceYears || 5}+ Yrs Experience
                                    </p>
                                </div>

                                <div className="flex items-center justify-center gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditProfile(!showEditProfile)}
                                        className="px-6 py-2.5 text-xs font-black text-white bg-[#ff4d2d] hover:bg-[#e64323] shadow-md rounded-xl transition cursor-pointer min-h-[44px] flex items-center gap-2"
                                    >
                                        <FaUserEdit size={16} /> {showEditProfile ? "Cancel Editing" : "Edit Profile Details"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="px-4 py-2.5 text-xs font-extrabold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 cursor-pointer min-h-[44px] flex items-center gap-1.5"
                                    >
                                        <FaSignOutAlt size={14} /> Logout
                                    </button>
                                </div>
                            </div>

                            {/* EDIT PROFILE FORM */}
                            {showEditProfile ? (
                                <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
                                    {/* Centered Photo Upload inside Form */}
                                    <div className="flex flex-col items-center justify-center p-4 bg-orange-50/60 rounded-2xl border border-orange-200 mb-4 text-center space-y-2">
                                        <span className="text-xs font-black text-gray-800">Update Pandit Ji Profile Photo</span>
                                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff4d2d] hover:bg-[#e64323] text-white rounded-xl text-xs font-black cursor-pointer transition shadow-md min-h-[44px]">
                                            {uploadingProfilePhoto ? <ClipLoader size={14} color="#fff" /> : <FaCamera size={14} />}
                                            <span>{uploadingProfilePhoto ? "Uploading..." : "📷 Choose Photo from Device"}</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleProfilePhotoChange}
                                                disabled={uploadingProfilePhoto}
                                            />
                                        </label>
                                    </div>
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
                    {myPanditProfile?.profileImage ? (
                        <img
                            src={myPanditProfile.profileImage}
                            alt="Profile"
                            className="w-5 h-5 rounded-full object-cover border border-amber-400 overflow-hidden aspect-square"
                        />
                    ) : (
                        <FaUserCircle size={18} />
                    )}
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

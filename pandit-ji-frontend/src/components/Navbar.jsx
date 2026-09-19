import React, { useState } from "react";
import axios from "axios";
import { IoLocationSharp, IoClose } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { FaSearch, FaBars, FaBell, FaVolumeUp, FaVolumeMute, FaCheckDouble } from "react-icons/fa";
import { LuReceiptIndianRupee } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { setUserData, markNotificationReadInState, markAllNotificationsReadInState, setSoundEnabledState } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import useNotifications from "../hooks/useNotifications";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

function Navbar({ searchQuery = "", setSearchQuery = () => {}, onSearchSubmit = () => {} }) {
  const { userData, currentCity, notifications, unreadCount, soundEnabled } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Initialize notifications & real-time listeners
  useNotifications();

  const isUser = userData?.role === "user";
  const isPandit = userData?.role === "pandit";

  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleLogOut = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/auth/signout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem("pandit_ji_token");
      sessionStorage.clear();
      dispatch(setUserData(null));
      setShowMenu(false);
      navigate("/signin", { replace: true });
    }
  };

  const handleMarkAsRead = async (notifId) => {
    try {
      await axios.put(`${serverUrl}/api/notifications/${notifId}/read`, {}, { withCredentials: true });
      dispatch(markNotificationReadInState(notifId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.put(`${serverUrl}/api/notifications/read-all`, {}, { withCredentials: true });
      dispatch(markAllNotificationsReadInState());
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSound = () => {
    dispatch(setSoundEnabledState(!soundEnabled));
  };

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit(searchQuery);
    if (showMobileSearch) setShowMobileSearch(false);
  };

  return (
    <div className="w-full h-[75px] md:h-[85px] flex items-center px-3 sm:px-6 md:px-8 fixed top-0 z-[9999] bg-[#fff9f6] border-b border-orange-100 shadow-sm">
      
      {/* ================= MOBILE VIEW (< md) ================= */}
      <div className="relative flex w-full items-center justify-between md:hidden px-1 h-full">
        {/* LOGO & BRAND (w-11 h-11 sm:w-12 sm:h-12) */}
        <div className="flex items-center gap-2.5 cursor-pointer shrink-0" onClick={() => navigate("/")}>
          <img
            src="/logo.png"
            alt="Maharaj Ji"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover overflow-hidden aspect-square shadow-sm border-2 border-orange-400"
          />
          <h1 className="text-xl sm:text-2xl font-black text-[#ff4d2d] tracking-tight">Maharaj Ji</h1>
        </div>

        {/* SEARCH OVERLAY FOR MOBILE */}
        {showMobileSearch && (
          <form
            onSubmit={handleSearchFormSubmit}
            className="absolute left-0 top-0 w-full h-full bg-white flex items-center gap-2 px-3 z-[99999] shadow-md"
          >
            <div className="flex items-center gap-1 border-r pr-2 text-gray-700 font-bold text-[11px] shrink-0">
              <IoLocationSharp size={18} className="text-[#ff4d2d]" />
              <span className="truncate max-w-[70px]">{currentCity || "Indore"}</span>
            </div>

            <div className="flex-1 flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
              <input
                autoFocus
                placeholder="Search Pandit Ji, Hawan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full outline-none text-xs font-semibold bg-transparent"
              />
              <button type="submit" className="text-[#ff4d2d] cursor-pointer p-1">
                <FaSearch size={14} />
              </button>
            </div>

            <IoClose
              size={26}
              className="text-[#ff4d2d] cursor-pointer p-1 shrink-0"
              onClick={() => setShowMobileSearch(false)}
            />
          </form>
        )}

        {/* RIGHT SIDE MOBILE CONTROLS */}
        <div className="flex items-center gap-1.5">
          {/* SEARCH BUTTON */}
          <button
            type="button"
            onClick={() => setShowMobileSearch(true)}
            className="p-2 text-[#ff4d2d] hover:bg-orange-50 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Search"
          >
            <IoIosSearch size={24} />
          </button>

          {/* NOTIFICATION BELL ICON WITH BADGE */}
          {userData && (
            <div className="relative">
              <button
                type="button"
                onClick={() => { setShowNotifications(!showNotifications); setShowMenu(false); }}
                className="p-2 text-gray-700 hover:text-[#ff4d2d] rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer relative"
                aria-label="Notifications"
              >
                <FaBell size={20} className="text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#ff4d2d] text-white text-[10px] font-black flex items-center justify-center shadow-xs animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* SINGLE PROFILE / MENU DROPDOWN TRIGGER */}
          <div className="relative">
            <button
              onClick={() => { setShowMenu(!showMenu); setShowNotifications(false); }}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#ff4d2d] text-white cursor-pointer text-sm font-bold shadow-md min-h-[44px] min-w-[44px]"
            >
              {userData ? (
                userData?.fullName?.charAt(0)?.toUpperCase() || "U"
              ) : (
                <FaBars size={18} />
              )}
            </button>

            {showMenu && (
              <div className="absolute right-0 top-14 bg-white shadow-2xl rounded-2xl p-4 w-[230px] z-50 border border-orange-100">
                {userData ? (
                  <>
                    <div className="border-b border-gray-100 pb-3 mb-2">
                      <div className="text-sm font-black text-gray-900">{userData?.fullName}</div>
                      <div className="text-[11px] font-extrabold uppercase text-[#ff4d2d] mt-0.5">{userData?.role}</div>
                    </div>

                    {isUser && (
                      <button
                        className="w-full flex items-center gap-2 text-gray-800 hover:text-[#ff4d2d] py-2.5 px-2 rounded-xl text-sm font-bold cursor-pointer hover:bg-orange-50 min-h-[44px]"
                        onClick={() => { setShowMenu(false); navigate("/my-bookings"); }}
                      >
                        <LuReceiptIndianRupee className="text-[#ff4d2d]" size={18} />
                        <span>My Bookings</span>
                      </button>
                    )}

                    {isPandit && (
                      <button
                        className="w-full flex items-center gap-2 text-gray-800 hover:text-[#ff4d2d] py-2.5 px-2 rounded-xl text-sm font-bold cursor-pointer hover:bg-orange-50 min-h-[44px]"
                        onClick={() => { setShowMenu(false); navigate("/pandit-dashboard"); }}
                      >
                        <LuReceiptIndianRupee className="text-[#ff4d2d]" size={18} />
                        <span>Pandit Dashboard</span>
                      </button>
                    )}

                    <button
                      className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 py-2.5 px-2 rounded-xl text-sm font-bold cursor-pointer hover:bg-red-50 mt-2 border-t border-gray-100 min-h-[44px]"
                      onClick={handleLogOut}
                    >
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => { setShowMenu(false); navigate("/signin"); }}
                      className="w-full py-2.5 text-center text-sm font-extrabold text-gray-800 hover:text-[#ff4d2d] bg-gray-50 rounded-xl min-h-[44px] cursor-pointer"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { setShowMenu(false); navigate("/signup"); }}
                      className="w-full py-2.5 text-center text-sm font-extrabold text-white bg-[#ff4d2d] rounded-xl shadow-md hover:bg-[#e64323] min-h-[44px] cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= DESKTOP VIEW (>= md) ================= */}
      <div className="hidden md:flex w-full items-center justify-between gap-4">
        {/* BRAND LOGO (DESKTOP SIZE w-12 h-12 / w-14 h-14) */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => navigate("/")}>
          <img
            src="/logo.png"
            alt="Maharaj Ji"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover shadow-md border-2 border-orange-200"
          />
          <h1 className="text-3xl font-black text-[#ff4d2d] tracking-tight">Maharaj Ji</h1>
        </div>

        {/* SINGLE FUNCTIONAL NAVBAR SEARCH BAR WITH VISIBLE SEARCH ICON BUTTON */}
        <form onSubmit={handleSearchFormSubmit} className="flex-1 flex justify-center max-w-[580px]">
          <div className="w-full h-[52px] bg-white shadow-md rounded-2xl flex items-center border border-gray-200 overflow-hidden focus-within:border-[#ff4d2d] transition">
            <div className="px-4 border-r border-gray-200 flex items-center gap-1.5 text-sm font-bold text-gray-700 bg-gray-50/50 h-full shrink-0">
              <IoLocationSharp className="text-[#ff4d2d] text-lg" />
              <span>{currentCity || "Indore"}</span>
            </div>

            <div className="flex items-center gap-2 px-4 flex-1 h-full">
              <input
                type="text"
                placeholder="Search Pandit Ji, Hawan, Satyanarayan Puja..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-sm font-semibold text-gray-800"
              />
              <button
                type="submit"
                className="p-2 text-gray-400 hover:text-[#ff4d2d] transition cursor-pointer min-h-[44px] flex items-center justify-center"
                title="Search"
              >
                <FaSearch size={16} />
              </button>
            </div>
          </div>
        </form>

        {/* RIGHT SIDE DESKTOP ACTIONS */}
        <div className="flex items-center gap-3 shrink-0">
          {/* NOTIFICATION BELL ICON WITH DROPDOWN */}
          {userData && (
            <div className="relative">
              <button
                type="button"
                onClick={() => { setShowNotifications(!showNotifications); setShowMenu(false); }}
                className="p-2.5 rounded-xl bg-orange-50/80 border border-orange-200/80 text-gray-700 hover:text-[#ff4d2d] transition cursor-pointer relative min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Notifications"
              >
                <FaBell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ff4d2d] text-white text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {isUser ? (
            <button
              className="px-4 py-2.5 rounded-xl bg-[#ff4d2d]/10 text-[#ff4d2d] font-extrabold text-sm hover:bg-[#ff4d2d]/20 transition cursor-pointer flex items-center gap-2 min-h-[44px]"
              onClick={() => navigate("/my-bookings")}
            >
              <LuReceiptIndianRupee size={16} />
              <span>My Bookings</span>
            </button>
          ) : isPandit ? (
            <button
              className="px-4 py-2.5 rounded-xl bg-[#ff4d2d]/10 text-[#ff4d2d] font-extrabold text-sm hover:bg-[#ff4d2d]/20 transition cursor-pointer flex items-center gap-2 min-h-[44px]"
              onClick={() => navigate("/pandit-dashboard")}
            >
              <LuReceiptIndianRupee size={16} />
              <span>Pandit Dashboard</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/signin")}
                className="px-4 py-2.5 text-sm font-extrabold text-gray-700 hover:text-[#ff4d2d] cursor-pointer min-h-[44px]"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2.5 text-sm font-extrabold text-white bg-[#ff4d2d] rounded-xl shadow-md hover:bg-[#e64323] cursor-pointer transition min-h-[44px]"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* USER PROFILE AVATAR */}
          {userData && (
            <div className="relative">
              <button
                onClick={() => { setShowMenu(!showMenu); setShowNotifications(false); }}
                className="w-11 h-11 rounded-full bg-[#ff4d2d] text-white flex items-center justify-center cursor-pointer font-extrabold text-base shadow-md min-h-[44px] min-w-[44px]"
              >
                {userData?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </button>

              {showMenu && (
                <div className="absolute right-0 top-14 bg-white shadow-2xl rounded-2xl p-4 w-[200px] border border-orange-100 z-50">
                  <div className="font-black text-gray-900 text-sm">{userData?.fullName}</div>
                  <div className="text-xs text-[#ff4d2d] font-extrabold uppercase mt-0.5">{userData?.role}</div>
                  <button
                    onClick={handleLogOut}
                    className="w-full text-left text-red-500 font-bold cursor-pointer mt-3 pt-2 border-t border-gray-100 text-sm hover:underline"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ================= NOTIFICATION DROPDOWN PANEL ================= */}
      {showNotifications && (
        <div className="absolute right-3 sm:right-10 top-16 md:top-20 bg-white shadow-2xl rounded-3xl p-4 w-[92vw] max-w-[380px] z-[99999] border border-orange-100 max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-gray-900 text-base">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-[#ff4d2d] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Sound Toggle Button */}
              <button
                type="button"
                onClick={toggleSound}
                className="p-1.5 text-gray-600 hover:text-[#ff4d2d] transition rounded-lg border border-gray-200 cursor-pointer text-xs flex items-center gap-1"
                title={soundEnabled ? "Mute Notification Sound" : "Enable Notification Sound"}
              >
                {soundEnabled ? <FaVolumeUp className="text-green-600" /> : <FaVolumeMute className="text-gray-400" />}
              </button>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-bold text-[#ff4d2d] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <FaCheckDouble size={11} /> Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto py-2 space-y-2 max-h-[360px] divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-400 font-semibold text-xs">
                No notifications yet 🕉️
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleMarkAsRead(notif._id)}
                  className={`pt-2.5 pb-2 px-2.5 rounded-2xl cursor-pointer transition ${
                    !notif.isRead ? "bg-orange-50/80 border border-orange-100" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-black text-gray-900">{notif.title}</h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#ff4d2d] shrink-0 mt-1"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-600 font-medium mt-0.5 leading-snug">{notif.message}</p>
                  <span className="text-[9px] font-semibold text-gray-400 block mt-1">
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;

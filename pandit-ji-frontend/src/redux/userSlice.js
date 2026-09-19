import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        currentCity: "Indore",
        myBookings: [],
        notifications: [],
        unreadCount: 0,
        soundEnabled: localStorage.getItem("pandit_ji_sound_enabled") !== "false",
        arrivalPopup: null
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setCurrentCity: (state, action) => {
            state.currentCity = action.payload;
        },
        setMyBookings: (state, action) => {
            state.myBookings = action.payload;
        },
        addBooking: (state, action) => {
            state.myBookings = [action.payload, ...state.myBookings];
        },
        updateBookingStatusInState: (state, action) => {
            const updatedBooking = action.payload;
            const index = state.myBookings.findIndex(b => b._id === updatedBooking._id);
            if (index !== -1) {
                state.myBookings[index] = updatedBooking;
            }
        },
        setNotifications: (state, action) => {
            state.notifications = action.payload.notifications || [];
            state.unreadCount = action.payload.unreadCount || 0;
        },
        addNotification: (state, action) => {
            const notif = action.payload;
            const exists = state.notifications.some(n => n._id === notif._id);
            if (!exists) {
                state.notifications = [notif, ...state.notifications];
                if (!notif.isRead) {
                    state.unreadCount += 1;
                }
            }
        },
        markNotificationReadInState: (state, action) => {
            const id = action.payload;
            const notif = state.notifications.find(n => n._id === id);
            if (notif && !notif.isRead) {
                notif.isRead = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        markAllNotificationsReadInState: (state) => {
            state.notifications.forEach(n => { n.isRead = true; });
            state.unreadCount = 0;
        },
        setSoundEnabledState: (state, action) => {
            state.soundEnabled = action.payload;
            localStorage.setItem("pandit_ji_sound_enabled", action.payload ? "true" : "false");
        },
        setArrivalPopup: (state, action) => {
            state.arrivalPopup = action.payload;
        },
        clearArrivalPopup: (state) => {
            state.arrivalPopup = null;
        }
    }
});

export const {
    setUserData,
    setCurrentCity,
    setMyBookings,
    addBooking,
    updateBookingStatusInState,
    setNotifications,
    addNotification,
    markNotificationReadInState,
    markAllNotificationsReadInState,
    setSoundEnabledState,
    setArrivalPopup,
    clearArrivalPopup
} = userSlice.actions;

export default userSlice.reducer;

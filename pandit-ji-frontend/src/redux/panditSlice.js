import { createSlice } from "@reduxjs/toolkit";

const panditSlice = createSlice({
    name: "pandit",
    initialState: {
        panditsList: [],
        selectedPandit: null,
        myPanditProfile: null,
        panditBookings: []
    },
    reducers: {
        setPanditsList: (state, action) => {
            state.panditsList = action.payload;
        },
        setSelectedPandit: (state, action) => {
            state.selectedPandit = action.payload;
        },
        setMyPanditProfile: (state, action) => {
            state.myPanditProfile = action.payload;
        },
        setPanditBookings: (state, action) => {
            state.panditBookings = action.payload;
        },
        addPanditBooking: (state, action) => {
            state.panditBookings = [action.payload, ...state.panditBookings];
        },
        updatePanditBookingStatusInState: (state, action) => {
            const updatedBooking = action.payload;
            const index = state.panditBookings.findIndex(b => b._id === updatedBooking._id);
            if (index !== -1) {
                state.panditBookings[index] = updatedBooking;
            }
        }
    }
});

export const {
    setPanditsList,
    setSelectedPandit,
    setMyPanditProfile,
    setPanditBookings,
    addPanditBooking,
    updatePanditBookingStatusInState
} = panditSlice.actions;

export default panditSlice.reducer;

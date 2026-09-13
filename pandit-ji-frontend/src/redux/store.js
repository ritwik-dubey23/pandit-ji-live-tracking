import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import panditReducer from "./panditSlice.js";

const store = configureStore({
    reducer: {
        user: userReducer,
        pandit: panditReducer
    }
});

export default store;

import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js"

import ownerSlice from "./owner.slice.js"
import mapSlice from "./mapSlice.js"


// main ye jha sab lana pdta 

export const store = configureStore({

    reducer: {
        user: userSlice,
        owner: ownerSlice,
        map: mapSlice
    }

})
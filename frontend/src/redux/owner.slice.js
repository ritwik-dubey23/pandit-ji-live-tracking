import { createSlice } from "@reduxjs/toolkit";

const owerSlice = createSlice({

    name: "owner",
    initialState: {
        myShopData: null,

    },

    /// data to update krne wla function
    reducers: {
        setMyShopData: (state,
            action) => {

            //action.playod===  se ayega data jo hame fronend se bejaa h
            //payload == useerDATA
            //state  ==== CURRENT WLA USERDATA   jise ham intail value jo pass krii h  usko change krengee




            // action.payload = jo data frontend se bheja
            // state = current redux state (initial value ko update karte hain)
            state.myShopData = action.payload



        },

        // $$$$   USER KI CITYY KE LIYYYE

        setCity: (state,
            action) => {

            //action.playod===  se ayega data jo hame fronend se bejaa h
            //payload == useerDATA
            //state  ==== CURRENT WLA USERDATA   jise ham intail value jo pass krii h  usko change krengee




            // action.payload = jo data frontend se bheja
            // state = current redux state (initial value ko update karte hain)
            state.city = action.payload



        }
    }

})





export const { setMyShopData, setCity } = owerSlice.actions;

export default owerSlice.reducer
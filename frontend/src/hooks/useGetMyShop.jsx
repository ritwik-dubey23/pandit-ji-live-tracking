// import { useEffect } from 'react';
// import axios from "axios";
// import { serverUrl } from '../App';
// import { useDispatch, useSelector } from 'react-redux';
// import { setShopInMyCity, setUserData } from '../redux/userSlice.js';

// function useGetMyshop() {
//  //  redux update  ke liye dispatcch lana pdega
// const    dispatch =useDispatch();
//     useEffect(() => {



//         const fetchShop= async () => {
            
       
//             try {
// //user login /signUp hone ke bd uska token cookie me store krenege

//                 const result = await axios.get(
//                     `${serverUrl}/api/shop/get-my`,
//                     { withCredentials: true }
//                 );
//    // data save in reduxx
//             //REDUXXXX
//                dispatch(setShopInMyCity(result.data))
//                 console.log(result.data);

//             } catch (error) {
//                 console.log(error);
             
//             }
//         };

//         fetchShop(); // function call

//     }, []);

// }

// export default useGetMyshop;


import { useEffect } from 'react';
import axios from "axios";
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setMyShopData } from '../redux/owner.slice.js';

function useGetMyShop() {

    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

    useEffect(() => {

        if (!userData) {
            dispatch(setMyShopData(null));
            return;
        }

        const fetchShop = async () => {

            try {

                const result = await axios.get(
                    `${serverUrl}/api/shop/get-my`,
                    { withCredentials: true }
                );

                dispatch(setMyShopData(result.data));

                console.log("MY SHOP DATA:", result.data);

            } catch (error) {

                console.log("GET MY SHOP ERROR:", error);
                dispatch(setMyShopData(null));

            }

        };

        fetchShop();

    }, [userData, dispatch]);

}

export default useGetMyShop;
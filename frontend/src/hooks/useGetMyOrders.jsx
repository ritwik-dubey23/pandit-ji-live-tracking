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
import { setMyOrders, setShopInMyCity } from '../redux/userSlice.js';

function useGetMyOrders() {

    const dispatch = useDispatch();

    const { currentCity } = useSelector(state => state.user);
const     {userData}=useSelector(state=>state.user);


    useEffect(() => {


 if (!userData) return; // login hone tak wait karo

   
        const fetchOrders= async () => {

            try {

                const result = await axios.get(
                    `${serverUrl}/api/order/my-orders`,
                    {
                        withCredentials: true
                    }
                );

                dispatch(setMyOrders(result.data));

                console.log( result.data);

            } catch (error) {

                console.log("GET SHOP BY CITY ERROR:", error);

            }
         
        };

        fetchOrders();

    }, [ userData]);

}

export default useGetMyOrders;
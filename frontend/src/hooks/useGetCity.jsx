import { useEffect } from 'react';
import axios from "axios";
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentAddress, setCurrentCity, setCurrentState } from '../redux/userSlice';
import { setAddress, setLocation } from '../redux/mapSlice';


function useGetCity() {
const  dispatch=useDispatch()

const  {userData}=useSelector(state=>state.user)

useEffect(()=>{
    // ye ek oobj print krega jisme apni location ke latitude and longitude h
    
    navigator.geolocation.getCurrentPosition(async(position)=>{
        
        console.log(position);

        const  apiKey=import.meta.env.VITE_GEOAPIKEY_API_KEY                
        const  latitude=position.coords.latitude
        const  longitude=position.coords.longitude;

dispatch(setLocation({lat:latitude,lon:longitude}))
// ham axios use krenge APIs se location niklane ke liyyye


const result   =await   axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`)
 
// console.log(result.data.results[0].city)
 
 
 // CITY MIL JYEGI YHAA SEE
 
 dispatch(setCurrentCity(result?.data?.results[0].city||result?.data?.results[0].county))
 
 
 // STATE MIL JYEGI YHAA SE
 dispatch(setCurrentState(result?.data?.results[0].state))
 console.log(result?.data.results[0].state)
    


  dispatch(setCurrentAddress(result?.data?.results[0].address_line1||address_line2

    
                       
))
             
 dispatch(setAddress(result?.data?.results[0].address_line2))

})



    }, [userData]);

}

export default useGetCity;
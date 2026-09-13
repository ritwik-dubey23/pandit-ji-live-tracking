import { useEffect } from 'react';
import axios from "axios";
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentAddress, setCurrentCity, setCurrentState } from '../redux/userSlice';
import { setAddress, setLocation } from '../redux/mapSlice';


function useUpdateLocation() {
const  dispatch=useDispatch()

const  {userData}=useSelector(state=>state.user)

useEffect(()=>{
    // ye ek oobj print krega jisme apni location ke latitude and longitude h

const updateLocation = async (lat,lon) => {
    try {
        const result = await axios.post(
            `${serverUrl}/api/user/update-location`,
            { lat,lon },
            { withCredentials: true }
        );
        console.log(result);
    } catch (error) {
        console.log("UPDATE LOCATION ERROR:", error.response?.data);
    }
}
navigator.geolocation.watchPosition((position)=>{
    
    updateLocation(position.coords.latitude, position.coords.longitude);
})
    }, [userData]);

}

export default useUpdateLocation;
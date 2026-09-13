import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice.js'
import { setShopInMyCity } from '../redux/userSlice.js';
function UseGetShopByCity() {

  const dispatch = useDispatch()

  
  //Cuurent City ke liyye
  const {currentCity} =useSelector(state=>state.user)
  
  
  //APIS CALLS KE LIYE USE EFFECET USE  HOTA H
  
  useEffect(() => {

    if (!currentCity) return;
    const fetchShops = async () => {

      try {

        // user login / signup hone ke baad
        // token cookie me store hoga

// SAHI:
const result = await axios.get(
  `${serverUrl}/api/shop/get-by-city/${currentCity}`,
  { withCredentials: true }
)
dispatch(setShopInMyCity(result.data)) 



        console.log(result.data)

      } catch (error) {
        console.log(error)
      }

    }

    fetchShops()

  }, [currentCity])

}

export default UseGetShopByCity
import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setItemsInMyCity, setUserData } from '../redux/userSlice.js'

function UseGetItemsByCity() {

  const dispatch = useDispatch()

  
  //Cuurent City ke liyye
  const {currentCity} =useSelector(state=>state.user)
  
  
  //APIS CALLS KE LIYE USE EFFECET USE  HOTA H
  
  useEffect(() => {

    const fetchItems = async () => {

      try {

        // user login / signup hone ke baad
        // token cookie me store hoga

// SAHI:
const result = await axios.get(
  `${serverUrl}/api/item/get-by-city/${currentCity}`,
  { withCredentials: true }
)
dispatch(setItemsInMyCity(result.data)) 



        console.log(result.data)

      } catch (error) {
        console.log(error)
      }

    }


    fetchItems()

  }, [currentCity])

}

export default  UseGetItemsByCity





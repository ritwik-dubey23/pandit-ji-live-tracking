import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice.js'

function useGetCurrUser() {

  const dispatch = useDispatch()

  useEffect(() => {

    const fetchUser = async () => {

      try {

        // user login / signup hone ke baad
        // token cookie me store hoga

        const result = await axios.get(
          `${serverUrl}/api/user/current`,
          { withCredentials: true }
        )

        // Redux me user data save
        dispatch(setUserData(result.data))

        console.log(result.data)

      } catch (error) {
        console.log(error)
      }

    }

    fetchUser()

  }, [])

}

export default useGetCurrUser
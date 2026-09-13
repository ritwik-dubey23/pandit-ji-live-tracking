import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { socket } from "../socket";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

const useGetCurrUser = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const savedToken = localStorage.getItem("pandit_ji_token");
        if (savedToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        }

        const fetchUser = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/auth/me`, { withCredentials: true });
                if (res.data && res.data.token) {
                    localStorage.setItem("pandit_ji_token", res.data.token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                }
                dispatch(setUserData(res.data));

                // Join Socket room
                if (res.data && res.data._id) {
                    if (res.data.role === "pandit") {
                        socket.emit("join_pandit_room", res.data._id);
                    } else {
                        socket.emit("join_user_room", res.data._id);
                    }
                }
            } catch (error) {
                dispatch(setUserData(null));
            }
        };

        fetchUser();
    }, [dispatch]);
};

export default useGetCurrUser;

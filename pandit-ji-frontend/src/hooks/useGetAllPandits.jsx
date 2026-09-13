import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setPanditsList } from "../redux/panditSlice";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

const useGetAllPandits = (searchQuery = "", selectedCategory = "") => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchPandits = async () => {
            try {
                let url = `${serverUrl}/api/pandit`;
                const params = [];
                if (searchQuery) params.push(`search=${encodeURIComponent(searchQuery)}`);
                if (selectedCategory && selectedCategory !== "All Poojas") {
                    params.push(`search=${encodeURIComponent(selectedCategory)}`);
                }
                if (params.length > 0) {
                    url += `?${params.join("&")}`;
                }

                const res = await axios.get(url, { withCredentials: true });
                dispatch(setPanditsList(res.data));
            } catch (error) {
                console.error("Error fetching pandits:", error);
            }
        };

        fetchPandits();
    }, [dispatch, searchQuery, selectedCategory]);
};

export default useGetAllPandits;

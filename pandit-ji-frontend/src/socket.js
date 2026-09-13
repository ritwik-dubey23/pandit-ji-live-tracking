import { io } from "socket.io-client";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

export const socket = io(serverUrl, {
    autoConnect: true,
    withCredentials: true
});

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import connectDb from "./config/db.js";
import { initSocket } from "./socket.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import panditRouter from "./routes/pandit.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import notificationRouter from "./routes/notification.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;

// Initialize Socket.IO with HTTP server
initSocket(server);

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/pandit", panditRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/notifications", notificationRouter);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "pandit-ji-backend server running with Socket.IO" });
});

app.get("/", (req, res) => {
    res.status(200).json({ status: "OK", message: "Maharaj Ji Backend API is Live" });
});

const startServer = async () => {
    try {
        await connectDb();
        if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
            server.listen(port, () => {
                console.log(`[SERVER] Pandit Ji Backend running on port ${port}`);
            });
        }
    } catch (err) {
        console.error("[SERVER ERROR] Failed to start server:", err.message);
    }
};

startServer();

export default app;

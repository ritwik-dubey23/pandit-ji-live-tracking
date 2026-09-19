import express from "express";
import {
    createBooking,
    getUserBookings,
    getPanditBookings,
    updateBookingStatus,
    acceptBooking,
    rejectBooking,
    submitBookingReview,
    confirmUserArrival
} from "../controllers/booking.controller.js";
import isAuth from "../middlewares/isAuth.js";

const bookingRouter = express.Router();

bookingRouter.post("/create", isAuth, createBooking);
bookingRouter.get("/user-bookings", isAuth, getUserBookings);
bookingRouter.get("/pandit-bookings", isAuth, getPanditBookings);

// Support both POST & PUT and both /status/:id and /:id/status
bookingRouter.post("/accept/:id", isAuth, acceptBooking);
bookingRouter.put("/accept/:id", isAuth, acceptBooking);

bookingRouter.post("/reject/:id", isAuth, rejectBooking);
bookingRouter.put("/reject/:id", isAuth, rejectBooking);

bookingRouter.post("/status/:id", isAuth, updateBookingStatus);
bookingRouter.put("/status/:id", isAuth, updateBookingStatus);
bookingRouter.post("/:id/status", isAuth, updateBookingStatus);
bookingRouter.put("/:id/status", isAuth, updateBookingStatus);

// User Arrival Confirmation route
bookingRouter.post("/:id/confirm-arrival", isAuth, confirmUserArrival);
bookingRouter.put("/:id/confirm-arrival", isAuth, confirmUserArrival);

// Rating & Review route
bookingRouter.post("/:id/rate", isAuth, submitBookingReview);
bookingRouter.put("/:id/rate", isAuth, submitBookingReview);

export default bookingRouter;

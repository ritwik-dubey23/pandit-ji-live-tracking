import express from "express";
import { googleAuth } from "../controllers/auth.controllers.js";
import {
    sendOtp,
    signIn,
    signOut,
    signUp,
    verifyOtp,
    resetPassword
} from "../controllers/auth.controllers.js";
// Router fn use kr re h express ke



// jo logic udhar controller me likha h uska route create jr rhe  h

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
// authRouter.post("/forgot-password", forgot - password);
authRouter.post("/signout", signOut);


//   routes for the forgot password functionility

authRouter.post("/send-otp", sendOtp);

authRouter.post("/verify-otp", verifyOtp);


authRouter.post("/reset-password", resetPassword);



authRouter.post("/google-auth", googleAuth);



export default authRouter;
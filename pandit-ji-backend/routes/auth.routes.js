import express from "express";
import { signUp, signIn, signOut, getMe, sendOtp, verifyOtp, resetPassword, googleAuth } from "../controllers/auth.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.post("/signout", signOut);
authRouter.get("/me", isAuth, getMe);
authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/google", googleAuth);
authRouter.post("/google-auth", googleAuth);

export default authRouter;


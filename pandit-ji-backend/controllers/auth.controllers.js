import User from "../models/user.models.js";
import Pandit from "../models/pandit.model.js";
import bcrypt from "bcryptjs";
import gentoken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";

export const signUp = async (req, res) => {
    try {
        const { fullName, email, password, mobile, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already registered. Please login or use a different email." });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        if (!fullName || fullName.trim().length < 3) {
            return res.status(400).json({ message: "Full Name must be at least 3 characters long." });
        }

        if (!mobile || mobile.trim().length < 10) {
            return res.status(400).json({ message: "Mobile number must be at least 10 digits." });
        }

        const validRoles = ["user", "pandit"];
        const selectedRole = validRoles.includes(role) ? role : "user";

        const hashPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            fullName,
            email,
            password: hashPassword,
            mobile,
            role: selectedRole
        });

        if (selectedRole === "pandit") {
            const defaultServices = [
                { name: "Satyanarayan Puja", description: "Complete Katha, Hawan & Puja Samagri consultation", price: 1100, duration: "2 Hours" },
                { name: "Griha Pravesh", description: "Auspicious home entry ceremony with Vastu Shanti", price: 2100, duration: "3 Hours" },
                { name: "Ganesh Puja", description: "Removal of obstacles and auspicious beginnings", price: 750, duration: "1 Hour" },
                { name: "Hawan", description: "Sacred fire ritual for purity and prosperity", price: 1500, duration: "2 Hours" },
                { name: "Bhojan Seva", description: "Preparation & blessing for Brahman Bhojan", price: 500, duration: "1 Hour" }
            ];

            await Pandit.create({
                user: user._id,
                name: fullName,
                description: "Experienced Pandit Ji offering authentic Vedic rituals and Poojas.",
                experienceYears: 5,
                city: "Delhi",
                state: "Delhi",
                address: "Local Address",
                mobile,
                email,
                profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
                photos: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"],
                services: defaultServices
            });
        }

        const token = await gentoken(user._id);

        res.cookie("token", token, {
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true
        });

        const userObj = user.toObject();
        delete userObj.password;

        return res.status(201).json(userObj);
    } catch (error) {
        console.error("SignUp Error:", error);
        return res.status(500).json({ message: "Internal server error during registration." });
    }
};

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Account does not exist with this email." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password. Please try again." });
        }

        const token = await gentoken(user._id);

        res.cookie("token", token, {
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true
        });

        const userObj = user.toObject();
        delete userObj.password;

        return res.status(200).json(userObj);
    } catch (error) {
        console.error("SignIn Error:", error);
        return res.status(500).json({ message: "Internal server error during login." });
    }
};

export const signOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Logout error." });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching user data" });
    }
};

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist." });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        user.isotpVerified = false;
        await user.save();

        await sendOtpMail(email, otp);
        return res.status(200).json({ message: "OTP sent to your email successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Error sending OTP." });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        user.isotpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        await user.save();

        return res.status(200).json({ message: "OTP verified successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Error verifying OTP." });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.isotpVerified) {
            return res.status(400).json({ message: "OTP verification required prior to password reset." });
        }

        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        user.isotpVerified = false;
        await user.save();

        return res.status(200).json({ message: "Password reset successfully. Please login." });
    } catch (error) {
        return res.status(500).json({ message: "Error resetting password." });
    }
};

export const googleAuth = async (req, res) => {
    try {
        const { token, credential, idToken, name, email: reqEmail, picture, firebaseUid } = req.body;
        let email = reqEmail;
        let fullName = name || "Google User";
        let googleSub = firebaseUid || "";
        let profilePic = picture || "";

        const googleToken = credential || token || idToken;

        if (googleToken) {
            try {
                const { OAuth2Client } = await import("google-auth-library");
                const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
                const ticket = await client.verifyIdToken({
                    idToken: googleToken,
                    audience: process.env.GOOGLE_CLIENT_ID || undefined
                }).catch(() => null);

                if (ticket) {
                    const payload = ticket.getPayload();
                    email = payload.email || email;
                    fullName = payload.name || fullName;
                    googleSub = payload.sub || googleSub;
                    profilePic = payload.picture || profilePic;
                }
            } catch (vErr) {
                console.log("Google token verification fallback:", vErr.message);
            }
        }

        if (!email) {
            return res.status(400).json({ message: "Invalid Google authorization data." });
        }

        let user = await User.findOne({ email });

        if (!user) {
            // Role Security Rule: Default new Google signups to "user" role strictly
            const defaultRole = "user";
            const randomPassword = Math.random().toString(36).slice(-10) + "Pj#1";
            const hashPassword = await bcrypt.hash(randomPassword, 10);

            user = await User.create({
                fullName,
                email,
                password: hashPassword,
                mobile: "9999999999",
                role: defaultRole,
                firebaseUid: googleSub
            });
        } else {
            // Existing user: Preserve existing role in MongoDB
            if (googleSub && !user.firebaseUid) {
                user.firebaseUid = googleSub;
                await user.save();
            }
        }

        const jwtToken = await gentoken(user._id);

        res.cookie("token", jwtToken, {
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true
        });

        const userObj = user.toObject();
        delete userObj.password;

        return res.status(200).json(userObj);
    } catch (error) {
        console.error("Google Auth Error:", error);
        return res.status(500).json({ message: "Google authentication failed." });
    }
};


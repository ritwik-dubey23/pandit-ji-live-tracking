import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUserData } from '../redux/userSlice';
import { FaEye, FaEyeSlash, FaUser, FaUserShield, FaCheckCircle, FaStar } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { ClipLoader } from 'react-spinners';
import { GoogleOAuthProvider } from '@react-oauth/google';

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "1029384756-demo.apps.googleusercontent.com";

function SignUpContent() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [role, setRole] = useState("user");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(true);

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        setErr("");

        if (fullName.trim().length < 3) {
            setErr("Enter a valid full name (at least 3 letters).");
            return;
        }

        if (mobile.trim().length < 10) {
            setErr("Mobile number must be at least 10 digits.");
            return;
        }

        if (password.length < 6) {
            setErr("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setErr("Passwords do not match.");
            return;
        }

        if (!agreeTerms) {
            setErr("Please agree to the Terms & Conditions.");
            return;
        }

        setLoading(true);

        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`, {
                fullName,
                email,
                mobile,
                password,
                role
            }, { withCredentials: true });

            dispatch(setUserData(result.data));
            setLoading(false);

            if (result.data.role === "pandit") {
                navigate("/pandit-dashboard");
            } else {
                navigate("/");
            }
        } catch (error) {
            setLoading(false);
            setErr(error?.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    const handleSimulatedGoogleSignUp = async () => {
        try {
            setLoading(true);
            setErr("");
            const { auth, googleProvider } = await import('../config/firebase');
            const { signInWithPopup } = await import('firebase/auth');

            const res = await signInWithPopup(auth, googleProvider);
            const user = res.user;
            const idToken = await user.getIdToken();

            const response = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                idToken,
                email: user.email,
                name: user.displayName,
                picture: user.photoURL,
                firebaseUid: user.uid,
                role
            }, { withCredentials: true });

            dispatch(setUserData(response.data));
            setLoading(false);
            if (response.data.role === "pandit") {
                navigate("/pandit-dashboard");
            } else {
                navigate("/");
            }
        } catch (error) {
            setLoading(false);
            console.error("Google Auth Error:", error);
            const errStr = String(error?.message || "") + " " + String(error?.code || "") + " " + JSON.stringify(error || {});
            if (errStr.includes("API key not valid") || errStr.includes("API_KEY_INVALID") || errStr.includes("invalid-api-key") || error?.code === "auth/invalid-api-key") {
                setErr("Invalid Firebase API Key in .env. Please register using Email & Password or provide a valid Firebase API Key in .env.");
            } else {
                setErr(error?.message || "Google registration failed. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#fff9f5] flex items-center justify-center p-3 sm:p-6 md:p-10">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100 grid grid-cols-1 lg:grid-cols-2 min-h-[640px]">
                
                {/* LEFT COLUMN: AUTH FORM CARD */}
                <div className="p-6 sm:p-10 flex flex-col justify-center bg-white order-2 lg:order-1">
                    {/* MOBILE TOP BRANDING (180153.jpg) */}
                    <div className="lg:hidden flex flex-col items-center mb-6">
                        <img src="/logo.png" alt="Maharaj Ji" className="w-16 h-16 rounded-full border-2 border-orange-400 shadow-md mb-2 object-cover" />
                        <h2 className="text-2xl font-extrabold text-[#ff4d2d]">Maharaj Ji</h2>
                        <p className="text-xs font-semibold text-gray-500">Trusted Pandit Booking Platform</p>
                    </div>

                    <div className="mb-6 text-center lg:text-left">
                        <h2 className="text-2xl font-black text-gray-900">Create Account</h2>
                        <p className="text-xs text-gray-500 mt-1">Sign up to book trusted pandits instantly</p>
                    </div>

                    {/* ROLE SELECTOR */}
                    <div className="grid grid-cols-2 gap-2 p-1.5 bg-orange-50 rounded-2xl mb-5 border border-orange-100">
                        <button
                            type="button"
                            onClick={() => setRole("user")}
                            className={`py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-2 min-h-[44px] ${
                                role === "user"
                                    ? "bg-[#ff4d2d] text-white shadow-md"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            <FaUser /> Register as User
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("pandit")}
                            className={`py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-2 min-h-[44px] ${
                                role === "pandit"
                                    ? "bg-[#ff4d2d] text-white shadow-md"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            <FaUserShield /> Register as Pandit Ji
                        </button>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSignUp} className="space-y-3.5">
                        <div>
                            <label className="block text-xs font-extrabold text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder={role === "pandit" ? "e.g., Acharya Sharma" : "e.g., Ritwik Dubey"}
                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff4d2d] min-h-[44px]"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-extrabold text-gray-700 mb-1">Mobile Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    placeholder="10-digit number"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff4d2d] min-h-[44px]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff4d2d] min-h-[44px]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-extrabold text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min 6 characters"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff4d2d] min-h-[44px]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                                    >
                                        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold text-gray-700 mb-1">Confirm Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter password"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff4d2d] min-h-[44px]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                className="w-4 h-4 text-[#ff4d2d] rounded border-gray-300 focus:ring-[#ff4d2d]"
                            />
                            <label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer font-medium">
                                I agree to the <span className="text-[#ff4d2d] font-bold">Terms & Conditions</span>
                            </label>
                        </div>

                        {err && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold text-center border border-red-200">
                                ⚠️ {err}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full font-black py-3.5 rounded-xl text-sm text-white bg-gradient-to-r from-[#ff4d2d] to-[#e64323] shadow-lg hover:shadow-orange-200 transition duration-200 cursor-pointer min-h-[44px] flex items-center justify-center"
                        >
                            {loading ? <ClipLoader size={20} color="#fff" /> : `Sign Up as ${role === "pandit" ? "Pandit Ji" : "User"}`}
                        </button>
                    </form>

                    {/* DIVIDER */}
                    <div className="relative my-5 text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <span className="relative bg-white px-3 text-xs font-bold text-gray-400 uppercase">
                            or continue with
                        </span>
                    </div>

                    {/* GOOGLE OAUTH BUTTON */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={handleSimulatedGoogleSignUp}
                            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-xl font-bold text-xs text-gray-700 hover:bg-gray-50 transition shadow-xs min-h-[44px] cursor-pointer"
                        >
                            <FcGoogle size={20} />
                            <span>Continue with Google</span>
                        </button>
                    </div>

                    {/* TOGGLE TO SIGNIN */}
                    <p className="text-center text-xs text-gray-600 mt-5">
                        Already have an account?{" "}
                        <span onClick={() => navigate("/signin")} className="text-[#ff4d2d] font-black cursor-pointer hover:underline">
                            Login
                        </span>
                    </p>
                </div>

                {/* RIGHT COLUMN: WHY CHOOSE MAHARAJ JI (DESKTOP VIEW 180153.jpg) */}
                <div className="hidden lg:flex flex-col justify-between p-10 bg-orange-50/60 text-gray-800 relative overflow-hidden order-1 lg:order-2 border-l border-orange-100">
                    <div>
                        {/* BRAND HEADER */}
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                            <img src="/logo.png" alt="Maharaj Ji Logo" className="w-12 h-12 rounded-full object-cover border-2 border-orange-400 shadow-md" />
                            <h2 className="text-2xl font-extrabold text-[#ff4d2d]">Maharaj Ji</h2>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-2xl font-black text-gray-900">Why Choose Maharaj Ji?</h2>
                            <p className="text-xs text-gray-500 mt-1">Experience seamless Vedic ritual bookings at your doorstep.</p>

                            <div className="mt-6 space-y-4">
                                <div className="p-4 bg-white rounded-2xl shadow-xs border border-orange-100 flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ff4d2d] flex items-center justify-center font-bold text-lg shrink-0">
                                        ⚡
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-extrabold text-gray-900">Instant Booking</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">Book pandits instantly for any pooja or religious service near you.</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl shadow-xs border border-orange-100 flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ff4d2d] flex items-center justify-center font-bold text-lg shrink-0">
                                        📍
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-extrabold text-gray-900">Live Map Tracking</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">Track your assigned pandit in real-time with live ETA & distance updates.</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl shadow-xs border border-orange-100 flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ff4d2d] flex items-center justify-center font-bold text-lg shrink-0">
                                        🕉️
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-extrabold text-gray-900">Verified Pandits</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">All pandits are background verified, experienced, and highly rated.</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-2xl shadow-xs border border-orange-100 flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ff4d2d] flex items-center justify-center font-bold text-lg shrink-0">
                                        🔒
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-extrabold text-gray-900">Secure Payments</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">100% safe & transparent pricing with multiple payment options.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center pt-4">
                        <img src="/logo.png" alt="Kalash" className="w-20 h-20 opacity-80" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function SignUp() {
    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <SignUpContent />
        </GoogleOAuthProvider>
    );
}

export default SignUp;

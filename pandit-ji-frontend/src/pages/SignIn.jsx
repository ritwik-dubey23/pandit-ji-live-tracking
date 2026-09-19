import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUserData } from '../redux/userSlice';
import { FaEye, FaEyeSlash, FaUser, FaUserShield, FaCheckCircle, FaStar } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { ClipLoader } from 'react-spinners';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

function SignInContent() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [role, setRole] = useState("user");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const handleSignIn = async (e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);

        try {
            const result = await axios.post(`${serverUrl}/api/auth/signin`, {
                email,
                password
            }, { withCredentials: true });

            if (result.data?.token) {
                localStorage.setItem("pandit_ji_token", result.data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;
            }
            dispatch(setUserData(result.data));
            setLoading(false);

            if (result.data.role === "pandit") {
                navigate("/pandit-dashboard");
            } else {
                navigate("/");
            }
        } catch (error) {
            setLoading(false);
            setErr(error?.response?.data?.message || "Invalid credentials. Please try again.");
        }
    };

    const handleFirebaseGoogleLogin = async () => {
        try {
            setLoading(true);
            setErr("");

            const res = await signInWithPopup(auth, googleProvider);
            const user = res.user;
            const idToken = await user.getIdToken();

            const response = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                idToken,
                email: user.email,
                name: user.displayName,
                picture: user.photoURL,
                firebaseUid: user.uid
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
            console.error("Firebase Google Auth Error:", error);
            const errStr = String(error?.message || "") + " " + String(error?.code || "") + " " + JSON.stringify(error || {});
            if (errStr.includes("API key not valid") || errStr.includes("API_KEY_INVALID") || errStr.includes("invalid-api-key") || error?.code === "auth/invalid-api-key") {
                setErr("Invalid Firebase API Key in .env. Please sign in using Email & Password below (e.g. pandit.ramesh@panditji.com / pandit123) or provide a valid Firebase API Key in .env.");
            } else if (error?.code === "auth/configuration-not-found" || errStr.includes("configuration-not-found")) {
                setErr("Firebase Google Sign-In not enabled: Please enable Google Provider in Firebase Console -> Authentication -> Sign-in method -> Google. You can also log in directly using Email & Password.");
            } else if (error?.code === "auth/unauthorized-domain" || errStr.includes("unauthorized-domain")) {
                setErr("Firebase Domain Unauthorized: Please add your current domain (e.g. localhost or 127.0.0.1) to Firebase Console -> Authentication -> Settings -> Authorized domains.");
            } else if (error?.code === "auth/invalid-continue-uri" || errStr.includes("invalid-continue-uri")) {
                setErr(`Firebase URL Error (auth/invalid-continue-uri): The domain '${window.location.origin}' is not authorized in Firebase Console. Please add '${window.location.origin}' to Firebase Console -> Authentication -> Settings -> Authorized domains. You can also log in directly using Email & Password.`);
            } else {
                setErr(error?.message || "Google authentication failed. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#fff9f5] flex items-center justify-center p-3 sm:p-6 md:p-10">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-100 grid grid-cols-1 lg:grid-cols-2 min-h-[640px]">
                
                {/* LEFT COLUMN: RITUAL BANNER (DESKTOP VIEW 180153.jpg) */}
                <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-[#1c1917] via-[#292524] to-[#44403c] text-white relative overflow-hidden">
                    <img
                        src="/hero.jpg"
                        alt="Maharaj Ji Ritual"
                        className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay"
                    />
                    
                    <div className="relative z-10">
                        {/* BRAND HEADER */}
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                            <img src="/logo.png" alt="Maharaj Ji Logo" className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-md" />
                            <h2 className="text-2xl font-extrabold text-amber-400 tracking-wide">Maharaj Ji</h2>
                        </div>

                        <div className="mt-10 space-y-4">
                            <h1 className="text-3xl font-extrabold leading-tight">
                                Book Trusted Pandits Instantly for <span className="text-amber-400">Any Pooja</span>
                            </h1>
                            
                            <ul className="space-y-3 pt-2">
                                <li className="flex items-center gap-2.5 text-sm font-semibold text-gray-200">
                                    <FaCheckCircle className="text-amber-400 shrink-0" size={16} /> Verified & Experienced Pandits
                                </li>
                                <li className="flex items-center gap-2.5 text-sm font-semibold text-gray-200">
                                    <FaCheckCircle className="text-amber-400 shrink-0" size={16} /> Instant Booking & Live Map Tracking
                                </li>
                                <li className="flex items-center gap-2.5 text-sm font-semibold text-gray-200">
                                    <FaCheckCircle className="text-amber-400 shrink-0" size={16} /> Authentic Vedic Rituals & Samagri
                                </li>
                                <li className="flex items-center gap-2.5 text-sm font-semibold text-gray-200">
                                    <FaCheckCircle className="text-amber-400 shrink-0" size={16} /> Secure & Reliable Online Payments
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* TESTIMONIAL CARD */}
                    <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mt-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex -space-x-2">
                                <img className="w-7 h-7 rounded-full border border-amber-400" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="user" />
                                <img className="w-7 h-7 rounded-full border border-amber-400" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="user" />
                            </div>
                            <span className="text-xs font-bold text-amber-300">10,000+ Happy Customers</span>
                        </div>
                        <p className="text-xs text-gray-200 italic">
                            "Very easy to find and book trusted pandits. Highly recommended!"
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-amber-400 text-xs">
                            <span className="font-bold text-white mr-1">- Rahul Sharma</span>
                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: AUTH FORM CARD */}
                <div className="p-6 sm:p-10 flex flex-col justify-center bg-white">
                    {/* MOBILE TOP BRANDING (MOBILE VIEW 180153.jpg) */}
                    <div className="lg:hidden flex flex-col items-center mb-6">
                        <img src="/logo.png" alt="Maharaj Ji" className="w-16 h-16 rounded-full border-2 border-orange-400 shadow-md mb-2 object-cover" />
                        <h2 className="text-2xl font-extrabold text-[#ff4d2d]">Maharaj Ji</h2>
                        <p className="text-xs font-semibold text-gray-500">Trusted Pandit Booking Platform</p>
                    </div>

                    <div className="mb-6 text-center lg:text-left">
                        <h2 className="text-2xl font-black text-gray-900">Welcome Back!</h2>
                        <p className="text-xs text-gray-500 mt-1">Login to continue to your account</p>
                    </div>

                    {/* ROLE SELECTOR */}
                    <div className="grid grid-cols-2 gap-2 p-1.5 bg-orange-50 rounded-2xl mb-6 border border-orange-100">
                        <button
                            type="button"
                            onClick={() => setRole("user")}
                            className={`py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-2 min-h-[44px] ${
                                role === "user"
                                    ? "bg-[#ff4d2d] text-white shadow-md"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            <FaUser /> Login as User
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
                            <FaUserShield /> Login as Pandit Ji
                        </button>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div>
                            <label className="block text-xs font-extrabold text-gray-700 mb-1">Email or Mobile Number</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff4d2d] focus:ring-1 focus:ring-[#ff4d2d] min-h-[44px]"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-xs font-extrabold text-gray-700">Password</label>
                                <span onClick={() => navigate("/forgot-password")} className="text-xs font-bold text-[#ff4d2d] hover:underline cursor-pointer">
                                    Forgot Password?
                                </span>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff4d2d] focus:ring-1 focus:ring-[#ff4d2d] min-h-[44px]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                                >
                                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>
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
                            {loading ? <ClipLoader size={20} color="#fff" /> : `Login as ${role === "pandit" ? "Pandit Ji" : "User"}`}
                        </button>
                    </form>

                    {/* DIVIDER */}
                    <div className="relative my-6 text-center">
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
                            onClick={handleFirebaseGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-xl font-bold text-xs text-gray-700 hover:bg-gray-50 transition shadow-xs min-h-[44px] cursor-pointer"
                        >
                            <FcGoogle size={20} />
                            <span>Continue with Google</span>
                        </button>
                    </div>

                    {/* TOGGLE TO SIGNUP */}
                    <p className="text-center text-xs text-gray-600 mt-6">
                        Don't have an account?{" "}
                        <span onClick={() => navigate("/signup")} className="text-[#ff4d2d] font-black cursor-pointer hover:underline">
                            Sign Up
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

function SignIn() {
    return <SignInContent />;
}

export default SignIn;

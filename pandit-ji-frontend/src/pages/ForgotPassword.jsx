import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHands, FaArrowLeft } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

function ForgotPassword() {
    const primaryColor = "#ff4d2d";
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [err, setErr] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setErr('');
        setMessage('');
        setLoading(true);
        try {
            const res = await axios.post(`${serverUrl}/api/auth/send-otp`, { email });
            setMessage(res.data.message);
            setStep(2);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setErr(error?.response?.data?.message || "Failed to send OTP.");
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setErr('');
        setMessage('');
        setLoading(true);
        try {
            const res = await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp });
            setMessage(res.data.message);
            setStep(3);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setErr(error?.response?.data?.message || "Invalid OTP.");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setErr('');
        setMessage('');
        setLoading(true);
        try {
            const res = await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword });
            setMessage(res.data.message);
            setLoading(false);
            setTimeout(() => navigate("/signin"), 1500);
        } catch (error) {
            setLoading(false);
            setErr(error?.response?.data?.message || "Failed to reset password.");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#fff9f9]">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-200">
                <button
                    onClick={() => navigate("/signin")}
                    className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-orange-600 mb-4 cursor-pointer"
                >
                    <FaArrowLeft /> Back to Login
                </button>

                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl shadow-sm" style={{ backgroundColor: primaryColor }}>
                        <FaHands />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold" style={{ color: primaryColor }}>Reset Password</h1>
                        <p className="text-xs text-gray-500 font-medium">Pandit Ji Booking Platform</p>
                    </div>
                </div>

                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-4 mt-6">
                        <p className="text-xs text-gray-600">Enter your registered email address to receive a 4-digit verification code.</p>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 rounded-xl font-bold text-sm text-white shadow-sm hover:opacity-90 cursor-pointer"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {loading ? <ClipLoader size={18} color="#fff" /> : "Send Verification OTP"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-4 mt-6">
                        <p className="text-xs text-gray-600">Enter the 4-digit OTP sent to <strong className="text-gray-800">{email}</strong>.</p>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Enter 4-Digit OTP</label>
                            <input
                                type="text"
                                required
                                maxLength="4"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="e.g. 1234"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-center font-extrabold tracking-widest focus:outline-none focus:border-orange-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 rounded-xl font-bold text-sm text-white shadow-sm hover:opacity-90 cursor-pointer"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {loading ? <ClipLoader size={18} color="#fff" /> : "Verify OTP Code"}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-4 mt-6">
                        <p className="text-xs text-gray-600">Create a new password for your account.</p>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                required
                                minLength="6"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password (min 6 chars)"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 rounded-xl font-bold text-sm text-white shadow-sm hover:opacity-90 cursor-pointer"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {loading ? <ClipLoader size={18} color="#fff" /> : "Reset & Save Password"}
                        </button>
                    </form>
                )}

                {message && (
                    <p className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-xs font-semibold text-center border border-green-200 mt-4">
                        ✅ {message}
                    </p>
                )}

                {err && (
                    <p className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs font-semibold text-center border border-red-200 mt-4">
                        ⚠️ {err}
                    </p>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;

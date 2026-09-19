import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaShieldAlt, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

export function AboutPage() {
    return (
        <div className="min-h-screen bg-[#fff9f5] flex flex-col justify-between">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 pt-[100px] pb-16 text-gray-800 space-y-6">
                <div className="flex items-center justify-between border-b border-orange-200 pb-4">
                    <h1 className="text-2xl sm:text-4xl font-black text-[#ff4d2d]">About Maharaj Ji</h1>
                    <Link
                        to="/"
                        className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-[#ff4d2d] text-xs font-extrabold rounded-xl border border-orange-300 transition flex items-center gap-1.5"
                    >
                        <FaArrowLeft /> Back to Home
                    </Link>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-orange-100 space-y-4 text-sm leading-relaxed">
                    <p className="font-medium text-gray-700">
                        Maharaj Ji is India's dedicated digital platform designed to bring authentic Vedic rituals, Poojas, and Hawans right to your doorstep. We bridge the gap between traditional spirituality and modern convenience.
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 pt-2">Why Choose Maharaj Ji?</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2.5 font-semibold text-gray-700">
                            <FaCheckCircle className="text-orange-500 shrink-0 text-base" /> 100% Verified Gurukul-Trained Pandits
                        </li>
                        <li className="flex items-center gap-2.5 font-semibold text-gray-700">
                            <FaCheckCircle className="text-orange-500 shrink-0 text-base" /> Instant Booking & Live Location Tracking
                        </li>
                        <li className="flex items-center gap-2.5 font-semibold text-gray-700">
                            <FaCheckCircle className="text-orange-500 shrink-0 text-base" /> Transparent Samagri & Dakshina Pricing
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export function TermsPage() {
    return (
        <div className="min-h-screen bg-[#fff9f5] flex flex-col justify-between">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 pt-[100px] pb-16 text-gray-800 space-y-6">
                <div className="flex items-center justify-between border-b border-orange-200 pb-4">
                    <h1 className="text-2xl sm:text-4xl font-black text-gray-900">Terms & Conditions</h1>
                    <Link
                        to="/"
                        className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-[#ff4d2d] text-xs font-extrabold rounded-xl border border-orange-300 transition flex items-center gap-1.5"
                    >
                        <FaArrowLeft /> Back to Home
                    </Link>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-orange-100 space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
                    <h3 className="font-bold text-gray-900 text-base">1. Platform Services</h3>
                    <p>Maharaj Ji acts as a facilitation platform connecting users (devotees) with independent Pandit service providers.</p>
                    <h3 className="font-bold text-gray-900 text-base">2. Booking & Cancellation</h3>
                    <p>Users may request Instant or Scheduled bookings. Instant bookings notify Pandits immediately. Cancellations may be initiated prior to Pandit arrival.</p>
                    <h3 className="font-bold text-gray-900 text-base">3. Live Location Tracking</h3>
                    <p>Live GPS tracking is enabled strictly during active accepted bookings for safety and estimation accuracy.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#fff9f5] flex flex-col justify-between">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 pt-[100px] pb-16 text-gray-800 space-y-6">
                <div className="flex items-center justify-between border-b border-orange-200 pb-4">
                    <h1 className="text-2xl sm:text-4xl font-black text-gray-900">Privacy Policy</h1>
                    <Link
                        to="/"
                        className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-[#ff4d2d] text-xs font-extrabold rounded-xl border border-orange-300 transition flex items-center gap-1.5"
                    >
                        <FaArrowLeft /> Back to Home
                    </Link>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-orange-100 space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
                    <h3 className="font-bold text-gray-900 text-base">Data Protection & Privacy</h3>
                    <p>We prioritize your data privacy. Location coordinates are collected solely during active booking sessions to enable live map tracking between user and Pandit.</p>
                    <p>Personal information such as mobile numbers and addresses are shared securely with the assigned Pandit for booking completion only.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export function ContactPage() {
    return (
        <div className="min-h-screen bg-[#fff9f5] flex flex-col justify-between">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 pt-[100px] pb-16 text-gray-800 space-y-6">
                <div className="flex items-center justify-between border-b border-orange-200 pb-4">
                    <h1 className="text-2xl sm:text-4xl font-black text-[#ff4d2d]">Contact & Support</h1>
                    <Link
                        to="/"
                        className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-[#ff4d2d] text-xs font-extrabold rounded-xl border border-orange-300 transition flex items-center gap-1.5"
                    >
                        <FaArrowLeft /> Back to Home
                    </Link>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-orange-100 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-2">
                        <FaPhoneAlt className="mx-auto text-[#ff4d2d]" size={24} />
                        <h4 className="font-bold text-sm text-gray-900">Phone</h4>
                        <a href="tel:+919669834243" className="text-sm font-extrabold text-[#ff4d2d] hover:underline block">
                            +91 9669834243
                        </a>
                        <span className="text-[10px] text-gray-500 font-bold block">(Tap to Call)</span>
                    </div>
                    <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-2">
                        <FaEnvelope className="mx-auto text-[#ff4d2d]" size={24} />
                        <h4 className="font-bold text-sm text-gray-900">Email</h4>
                        <a href="mailto:support@maharajji.com" className="text-xs font-bold text-gray-800 hover:text-[#ff4d2d] block">
                            support@maharajji.com
                        </a>
                    </div>
                    <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-2">
                        <FaMapMarkerAlt className="mx-auto text-[#ff4d2d]" size={24} />
                        <h4 className="font-bold text-sm text-gray-900">Address</h4>
                        <p className="text-xs font-black text-gray-900">Khargone, M.P.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

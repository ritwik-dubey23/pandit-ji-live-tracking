import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaShieldAlt, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

export function AboutPage() {
    return (
        <div className="min-h-screen bg-[#fff9f5] flex flex-col justify-between">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-16 text-gray-800 space-y-6">
                <div className="text-center space-y-3">
                    <h1 className="text-3xl sm:text-4xl font-black text-[#ff4d2d]">About Maharaj Ji</h1>
                    <p className="text-sm font-semibold text-gray-600">Connecting Devotees with Verified Vedic Pandits Instantly</p>
                </div>
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-orange-100 space-y-4 text-sm leading-relaxed">
                    <p>
                        Maharaj Ji is India's dedicated digital platform designed to bring authentic Vedic rituals, Poojas, and Hawans right to your doorstep. We bridge the gap between traditional spirituality and modern convenience.
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 pt-2">Why Choose Maharaj Ji?</h3>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-2 font-semibold text-gray-700">
                            <FaCheckCircle className="text-orange-500 shrink-0" /> 100% Verified Gurukul-Trained Pandits
                        </li>
                        <li className="flex items-center gap-2 font-semibold text-gray-700">
                            <FaCheckCircle className="text-orange-500 shrink-0" /> Instant Booking & Live Location Tracking
                        </li>
                        <li className="flex items-center gap-2 font-semibold text-gray-700">
                            <FaCheckCircle className="text-orange-500 shrink-0" /> Transparent Samagri & Dakshina Pricing
                        </li>
                    </ul>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export function TermsPage() {
    return (
        <div className="min-h-screen bg-[#fff9f5] flex flex-col justify-between">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-16 text-gray-800 space-y-6">
                <h1 className="text-3xl font-black text-gray-900 text-center">Terms & Conditions</h1>
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
            <div className="max-w-4xl mx-auto px-4 py-16 text-gray-800 space-y-6">
                <h1 className="text-3xl font-black text-gray-900 text-center">Privacy Policy</h1>
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
            <div className="max-w-4xl mx-auto px-4 py-16 text-gray-800 space-y-6">
                <h1 className="text-3xl font-black text-[#ff4d2d] text-center">Contact & Support</h1>
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-orange-100 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-2">
                        <FaPhoneAlt className="mx-auto text-[#ff4d2d]" size={24} />
                        <h4 className="font-bold text-sm text-gray-900">Phone</h4>
                        <p className="text-xs text-gray-600">+91 98260 11111</p>
                    </div>
                    <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-2">
                        <FaEnvelope className="mx-auto text-[#ff4d2d]" size={24} />
                        <h4 className="font-bold text-sm text-gray-900">Email</h4>
                        <p className="text-xs text-gray-600">support@maharajji.com</p>
                    </div>
                    <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-2">
                        <FaMapMarkerAlt className="mx-auto text-[#ff4d2d]" size={24} />
                        <h4 className="font-bold text-sm text-gray-900">Address</h4>
                        <p className="text-xs text-gray-600">Vijay Nagar, Indore, M.P.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

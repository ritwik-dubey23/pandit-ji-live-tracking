import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';

function Footer() {
    const navigate = useNavigate();

    return (
        <footer className="bg-[#1c1917] text-gray-300 pt-12 pb-8 border-t border-amber-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                
                {/* BRAND COL */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <img src="/logo.png" alt="Maharaj Ji Logo" className="w-10 h-10 rounded-full border-2 border-amber-400 object-cover" />
                        <span className="text-xl font-extrabold text-amber-400 tracking-wide">Maharaj Ji</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        India’s premier platform connecting devotees with verified, experienced Pandits for authentic Vedic Pujas, Hawans, and ceremonies.
                    </p>
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/40 w-fit">
                        <FaShieldAlt size={14} /> 100% Verified & Experienced Pandits
                    </div>
                </div>

                {/* QUICK LINKS */}
                <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-amber-500/20 pb-2">Quick Navigation</h4>
                    <ul className="space-y-2 text-xs font-semibold">
                        <li><Link to="/" className="hover:text-amber-400 transition">Home</Link></li>
                        <li><Link to="/" className="hover:text-amber-400 transition">Browse Pandits</Link></li>
                        <li><Link to="/my-bookings" className="hover:text-amber-400 transition">My Bookings & Live Tracking</Link></li>
                        <li><Link to="/signin" className="hover:text-amber-400 transition">Pandit Ji Partner Portal</Link></li>
                    </ul>
                </div>

                {/* PLATFORM POLICIES */}
                <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-amber-500/20 pb-2">Platform Policies</h4>
                    <ul className="space-y-2 text-xs font-semibold">
                        <li><Link to="/about" className="hover:text-amber-400 transition">About Maharaj Ji</Link></li>
                        <li><Link to="/terms" className="hover:text-amber-400 transition">Terms & Conditions</Link></li>
                        <li><Link to="/privacy" className="hover:text-amber-400 transition">Privacy Policy</Link></li>
                        <li><Link to="/contact" className="hover:text-amber-400 transition">Contact & Support</Link></li>
                    </ul>
                </div>

                {/* CONTACT INFO */}
                <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-amber-500/20 pb-2">Connect With Us</h4>
                    <ul className="space-y-3 text-xs">
                        <li className="flex items-start gap-2.5">
                            <FaMapMarkerAlt className="text-amber-400 mt-0.5 shrink-0" size={14} />
                            <span className="font-bold text-gray-200">Khargone, M.P.</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <FaPhoneAlt className="text-amber-400 shrink-0" size={13} />
                            <a href="tel:+919669834243" className="font-extrabold text-amber-400 hover:underline">+91 9669834243</a>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <FaEnvelope className="text-amber-400 shrink-0" size={13} />
                            <a href="mailto:support@maharajji.com" className="hover:text-amber-400">support@maharajji.com</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-stone-800 text-center text-xs text-gray-500">
                © {new Date().getFullYear()} Maharaj Ji Platform. All rights reserved. Authentic Vedic Services.
            </div>
        </footer>
    );
}

export default Footer;

import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import useGetCurrUser from './hooks/useGetCurrUser';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import PanditDetails from './pages/PanditDetails';
import MyBookings from './pages/MyBookings';
import PanditDashboard from './components/PanditDashboard';
import { AboutPage, TermsPage, PrivacyPage, ContactPage } from './pages/StaticPages';

import ServiceDetails from './pages/ServiceDetails';

function App() {
    useGetCurrUser();
    const { userData } = useSelector(state => state.user);
    const isPandit = userData && userData.role === "pandit";

    return (
        <>
            <ScrollToTop />
            <Routes>
            {/* User Routes (Redirect Pandit to /pandit-dashboard) */}
            <Route path='/' element={isPandit ? <Navigate to="/pandit-dashboard" /> : <Home />} />
            <Route path='/signin' element={!userData ? <SignIn /> : (isPandit ? <Navigate to="/pandit-dashboard" /> : <Navigate to="/" />)} />
            <Route path='/signup' element={!userData ? <SignUp /> : (isPandit ? <Navigate to="/pandit-dashboard" /> : <Navigate to="/" />)} />
            <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to="/" />} />

            <Route path='/pandit/:id' element={isPandit ? <Navigate to="/pandit-dashboard" /> : <PanditDetails />} />
            <Route path='/service/:serviceId' element={<ServiceDetails />} />
            <Route path='/my-bookings' element={isPandit ? <Navigate to="/pandit-dashboard" /> : (userData ? <MyBookings /> : <Navigate to="/signin" />)} />

            {/* Static Policy Pages */}
            <Route path='/about' element={<AboutPage />} />
            <Route path='/terms' element={<TermsPage />} />
            <Route path='/privacy' element={<PrivacyPage />} />
            <Route path='/contact' element={<ContactPage />} />

            {/* Dedicated Pandit Dashboard Application */}
            <Route path='/pandit-dashboard' element={
                isPandit ? <PanditDashboard /> : <Navigate to="/signin" />
            } />
            <Route path='/pandit/*' element={
                isPandit ? <PanditDashboard /> : <Navigate to="/signin" />
            } />
        </Routes>
        </>
    );
}

export default App;

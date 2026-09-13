# Product Requirements Document (PRD) — Pandit Ji Booking & Pooja Service Platform

## 1. Project Overview
The **Pandit Ji Booking & Pooja Service Platform** is a MERN-stack web application designed to connect users seeking authentic Vedic rituals, Poojas, and ceremonies with verified Pandit Jis / Acharyas. The platform enables both scheduled ceremony bookings and instant booking requests with real-time Socket.IO notifications between users and Pandit Jis.

---

## 2. Target Audience
1. **Users / Devotees**: Individuals or families looking to book experienced Pandit Jis for domestic or corporate religious ceremonies (e.g., *Satyanarayan Puja, Griha Pravesh, Hawan, Ganesh Puja, Marriage ceremonies, Mundan, Bhojan Seva*).
2. **Pandit Jis / Acharyas**: Vedic priests who offer ceremony services, manage their own schedule, list service packages with transparent pricing, and receive real-time booking requests.

---

## 3. Core Features

### 3.1 User Features
- **Authentication**: JWT & Cookie-based registration and login with explicit role selection (**User** vs **Pandit Ji**). Forgot password recovery with 4-digit OTP email verification.
- **Home Page Browsing**: Search Pandit Jis by name, city, or ceremony. Filter by ceremony categories (*Ganesh Puja, Satyanarayan Puja, Griha Pravesh, Hawan, Shiv Puja, Marriage Puja, Bhojan Seva, Custom Pooja*).
- **Pandit Ji Profile & Photo Gallery**: View Pandit Ji details, experience years, city/location, ratings, bio, photo gallery carousel, and available Pooja services.
- **Dual Booking Modes**:
  - **Instant Booking**: Immediate Pandit Ji request for urgent rituals with live location and venue details.
  - **Scheduled Booking**: Select custom date, time slot, predefined Pooja package OR describe a custom requirement in a text box.
- **Bhojan Seva Add-on**: Option to include Brahman Bhojan arrangement with guest count selection.
- **Real-Time Booking Tracking**: `MyBookings` page with live status badges (`pending`, `accepted`, `rejected`, `completed`, `cancelled`) updated in real-time via Socket.IO without page refresh.

### 3.2 Pandit Ji Features
- **Pandit Ji Dashboard**: Comprehensive portal featuring:
  - **Live Booking Requests**: Audio/visual real-time notification alerts when new bookings arrive. Action buttons to **Accept**, **Reject**, or **Mark Completed**.
  - **Profile Setup & Photo Gallery**: Upload multiple photos, update experience years, city, state, address, and bio.
  - **Pooja Services Manager**: Add, edit, or delete custom Pooja listings (Title, Price in ₹, Duration, Description).

---

## 4. Non-Functional Requirements
- **Real-Time Responsiveness**: Instant Socket.IO event emission for `new_booking` and `booking_status_updated`.
- **Security**: Password hashing using BcryptJS, HTTP-Only JWT cookies, and protected Express routes (`isAuth` middleware).
- **Design & UI**: Premium modern aesthetic retaining reference color palette (`#ff4d2d`), smooth Tailwind v4 utilities, responsive flex/grid layouts, and clean typography.

# Implementation Phases — Pandit Ji Platform

## Phase 1: Environment & Database Verification
- [x] Configure MongoDB Atlas database user and connection URI (`panditji` database).
- [x] Integrate Windows DNS fallback (`8.8.8.8`) in `config/db.js`.
- [x] Run automated read/write empirical connection tests.

---

## Phase 2: Backend Architecture & Core Schemas
- [x] Setup `pandit-ji-backend` directory with ES modules.
- [x] Create Mongoose schemas: `User` (`user` / `pandit` roles), `Pandit` (gallery photos & services array), `Booking` (Instant vs Scheduled).
- [x] Implement JWT authentication, cookie management, and password hashing.
- [x] Build Express controllers & routes for Auth, User, Pandit, and Booking.

---

## Phase 3: Real-Time Socket.IO Integration
- [x] Wrap Express HTTP server with `socket.io`.
- [x] Implement socket connection handlers and room join events (`user_<userId>`, `pandit_<panditUserId>`).
- [x] Trigger `new_booking` event on booking creation and `booking_status_updated` event on status changes.

---

## Phase 4: Frontend Development & UI Adaptation
- [x] Setup `pandit-ji-frontend` Vite + React 19 project.
- [x] Implement Redux Toolkit slices (`userSlice`, `panditSlice`) and store.
- [x] Create core components: `Navbar`, `PanditCard`, `ServiceCard`, `BookingModal`, `UserBookingCard`, `PanditBookingCard`, `PanditDashboard`.
- [x] Build pages: `Home`, `PanditDetails`, `SignIn`, `SignUp`, `ForgotPassword`, `MyBookings`.
- [x] Add role-switcher tabs (User vs Pandit Ji) on authentication pages.

---

## Phase 5: Testing, Debugging & Polish
- [x] Resolve auto-creation of Pandit profile documents on service addition.
- [x] Configure Cloudinary environment variables and safe upload error wrappers.
- [x] Execute production build (`npx vite build`) with zero syntax or bundling errors.
- [x] Launch both local servers and verify full end-to-end user & pandit workflows.

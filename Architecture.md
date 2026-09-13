# Architecture Document — Pandit Ji Booking Platform

## 1. System Architecture Diagram

```
[ React 19 Frontend (Vite) ] <---> [ Socket.IO Client / Axios ]
                                           │
                                    HTTP / WebSocket
                                           │
                                           ▼
                              [ Express 5 ESM Backend ]
                                           │
                                   Mongoose ODM
                                           │
                                           ▼
                             [ MongoDB Atlas (panditji) ]
```

---

## 2. Technology Stack

### Frontend (`pandit-ji-frontend`)
- **Core Framework**: React 19 + Vite v8
- **State Management**: Redux Toolkit (`userSlice`, `panditSlice`)
- **Styling**: Tailwind CSS v4
- **Real-Time Client**: Socket.IO Client v4
- **HTTP Client**: Axios v1 (with credentials support)
- **Routing**: React Router DOM v7
- **UI Components**: React Icons, React Spinners

### Backend (`pandit-ji-backend`)
- **Runtime**: Node.js (ESM modules)
- **Web Framework**: Express v5
- **Database**: MongoDB Atlas (`panditji` database via Mongoose v9)
- **Real-Time Engine**: Socket.IO Server v4
- **Authentication**: JWT (`jsonwebtoken`), Cookie Parser (`cookie-parser`), Password Hashing (`bcryptjs`)
- **Media Storage**: Cloudinary SDK + Multer for file uploads
- **Email Utilities**: Nodemailer for OTP mails

---

## 3. Directory Structure

```
pandit-ji-live-tracking/
├── pandit-ji-backend/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── auth.controllers.js
│   │   ├── user.controllers.js
│   │   ├── pandit.controller.js
│   │   └── booking.controller.js
│   ├── middlewares/
│   │   ├── isAuth.js
│   │   └── multer.js
│   ├── models/
│   │   ├── user.models.js
│   │   ├── pandit.model.js
│   │   └── booking.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── pandit.routes.js
│   │   └── booking.routes.js
│   ├── utils/
│   │   ├── token.js
│   │   └── mail.js
│   ├── socket.js
│   ├── index.js
│   ├── package.json
│   └── .env
│
├── pandit-ji-frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PanditCard.jsx
│   │   │   ├── ServiceCard.jsx
│   │   │   ├── BookingModal.jsx
│   │   │   ├── UserBookingCard.jsx
│   │   │   ├── PanditBookingCard.jsx
│   │   │   └── PanditDashboard.jsx
│   │   ├── hooks/
│   │   │   ├── useGetCurrUser.jsx
│   │   │   ├── useGetAllPandits.jsx
│   │   │   ├── useGetMyBookings.jsx
│   │   │   └── useGetPanditBookings.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── PanditDetails.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── MyBookings.jsx
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   ├── userSlice.js
│   │   │   └── panditSlice.js
│   │   ├── category.js
│   │   ├── socket.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── .env
```

---

## 4. Socket.IO Event & Room Architecture

### Rooms
- **User Room**: `user_<userId>`
- **Pandit Room**: `pandit_<panditUserId>`

### Events
- `new_booking`: Server $\rightarrow$ `pandit_<panditUserId>` (Triggers live card addition and alert sound).
- `booking_status_updated`: Server $\rightarrow$ `user_<userId>` & `pandit_<panditUserId>` (Triggers status badge update).

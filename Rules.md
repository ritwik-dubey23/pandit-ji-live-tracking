# Rules & Boundaries — Pandit Ji Platform

## 1. Project Boundaries & Constraints
- **Role Restrictions**: Allowed roles are strictly `user` and `pandit`. Never introduce `deliveryBoy` or `owner` roles into schemas or frontend code.
- **Database Rules**: Connect strictly to MongoDB Atlas database `panditji`. Never hardcode connection strings inside source code; always consume `process.env.MONGO_URI`. Never expose passwords in terminal logs or natural language responses.
- **Reference Preservation**: Maintain exact reference design styling (primary color `#ff4d2d`, rounded cards, clean typography, responsive structures). Do NOT redesign the application from scratch or introduce heavy third-party UI libraries like Tailwind v3/v2 or Bootstrap.

---

## 2. Technical Code Rules
1. **ESM Imports**: Backend must strictly use ES module syntax (`import ... from ...` and `"type": "module"` in `package.json`).
2. **Error Handling**:
   - Always wrap async controller routes in `try/catch` blocks.
   - Return clean JSON error responses (`res.status(400/404/500).json({ message: "..." })`).
   - Wrap Cloudinary upload loops in isolated `try/catch` blocks so image upload errors do not crash profile saving or service creation.
3. **Socket.IO Room Integrity**:
   - Private event routing: Broadcast `new_booking` ONLY to `pandit_<panditUserId>` room.
   - Broadcast status updates ONLY to `user_<userId>` and `pandit_<panditUserId>` rooms. Never broadcast private booking data to all connected sockets.
4. **Auto-Creation Scopes**:
   - If a Pandit Ji signs up or attempts to add a service before saving their full profile, auto-initialize their `Pandit` document in MongoDB using their `User` data.

---

## 3. Environment Variable Requirements
Required variables in `pandit-ji-backend/.env`:
- `PORT=8000`
- `MONGO_URI="mongodb+srv://..."`
- `JWT_SECRET="PANDIT_JI_SECRET_KEY"`
- `CLOUDINARY_CLOUD_NAME="..."`
- `CLOUDINARY_API_KEY="..."`
- `CLOUDINARY_API_SECRET="..."`

Required variables in `pandit-ji-frontend/.env`:
- `VITE_SERVER_URL="http://localhost:8000"`

# Design System Document — Pandit Ji Platform

## 1. Color Palette

### Primary & Brand Colors
- **Primary Saffron/Orange**: `#ff4d2d` (Main brand color, call-to-action buttons, active navigation indicators)
- **Primary Hover**: `#e64323`
- **Gradient Banner**: `from-orange-600 via-amber-600 to-orange-700`

### Backgrounds & Cards
- **Page Background**: `#fff9f9` (Soft warm off-white background)
- **Card Background**: `#ffffff` (Pure white cards with border `#f3f4f6`)
- **Accent Background**: `#fff7ed` (Orange-50 warm subtle highlights)

### Typography & Neutrals
- **Primary Text**: `#111827` (Gray-900 for headings & titles)
- **Secondary Text**: `#4b5563` (Gray-600 for descriptions & subtext)
- **Muted Text**: `#9ca3af` (Gray-400 for timestamps & labels)
- **Borders**: `#e5e7eb` (Gray-200)

---

## 2. Status Badges & Indicators

- **Pending**: `bg-amber-100 text-amber-800 border-amber-300` ⏳
- **Accepted**: `bg-green-100 text-green-800 border-green-300` ✅
- **Completed**: `bg-blue-100 text-blue-800 border-blue-300` 🎉
- **Rejected**: `bg-red-100 text-red-800 border-red-300` ❌
- **Cancelled**: `bg-gray-100 text-gray-700 border-gray-300` 🚫

---

## 3. Typography & Icons
- **Font Family**: System UI, `-apple-system`, `Segoe UI`, `Roboto`, `sans-serif`
- **Icon Library**: `react-icons/fa` (Font Awesome icons: `FaHands`, `FaPrayingHands`, `FaStar`, `FaCalendarAlt`, `FaClock`, `FaMapMarkerAlt`, `FaUtensils`, `FaUsers`)

---

## 4. Component Design Patterns

### Cards
- **Pandit Ji Card**: Rounded-2xl (`rounded-2xl`), shadow-md (`shadow-md`), smooth hover scale, rating pill in top-right corner, available Pooja category pills, starting price display.
- **Service Card**: Border-gray-200 with hover border-orange-300, shadow-xs to shadow-md transition, duration tag, included samagri indicator, "Book This Service" CTA.

### Buttons & Controls
- **Primary Buttons**: Background `#ff4d2d`, font-bold, rounded-xl (`rounded-xl`), text-white, hover opacity 90%.
- **Role Selector Tabs**: Segmented dual-button control with white active background, orange text, and subtle ring shadow.

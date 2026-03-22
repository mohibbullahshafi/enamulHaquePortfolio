# Dr. Md Enamul Haque — Professional Portfolio

A full-stack professional portfolio and consultation booking platform for **Dr. Md Enamul Haque**, Associate Professor at Deakin University, Australia. Built with Node.js/Express backend and React/Vite frontend.

---

## Features

### Public Website (7 Pages)
- **Home** — Hero section, stats (citations, h-index, i10-index), featured research areas, services overview
- **About** — Full academic bio, education, experience, skills, awards
- **Projects** — 24 real publications from Google Scholar + 6 research areas with tags
- **Courses** — Academic courses taught
- **Consultancy** — Services overview with "Book a Consultation" link
- **Book Consultation** — 6-step booking wizard (select service → pick date → choose time → enter details → billing summary → confirmation)
- **Contact** — Contact form with message submission to backend

### Admin Panel (8 Sections)
- **Dashboard** — Overview with quick stats (publications, research areas, services, messages, bookings)
- **Profile** — Edit name, title, bio, photo, Google Scholar stats
- **Publications** — Full CRUD for 24+ publications
- **Research Areas** — Manage research areas with titles, descriptions, tags
- **Services** — Add/edit/delete consultancy services
- **Messages** — View and manage contact form submissions
- **Bookings** — Manage all bookings with:
  - Filter by status (pending, confirmed, completed, cancelled)
  - Approve/reject/complete actions
  - Click any booking → **full detail page** with:
    - Client info (name, email, phone)
    - Consultation details (type, date, time, price, duration)
    - Client's notes from booking form
    - Admin notes & activity log (add notes, view status change history)
    - Quick actions sidebar (confirm, cancel, complete, reopen, delete)
    - Summary & activity stats
  - Earnings tracker
- **Settings** — System status, content overview, Google Scholar stats editor

### Booking/Consultation System
- Custom calendar with availability management
- Weekly schedule toggles (Mon–Sun, open/close, start/end times)
- Blocked dates (holidays, travel)
- Consultation types with pricing (Research $150, Industry $250, Academic Mentoring $100, Training Workshop $400)
- Slot-based scheduling with double-booking prevention
- Multi-currency support (AUD, USD, EUR, GBP, BDT)
- Admin notes & activity logs per booking

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 6, Tailwind CSS v4, React Router v6, React Icons |
| **Backend** | Node.js, Express, JSON file storage |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **Styling** | Tailwind CSS v4 via `@tailwindcss/vite` plugin |
| **Fonts** | Inter + Plus Jakarta Sans (Google Fonts) |

---

## Project Structure

```
personal-portfolio/
├── backend/
│   ├── data/
│   │   ├── content.json          # Profile, publications, research areas, services, messages
│   │   ├── bookings.json         # Booking settings, availability, bookings
│   │   └── admin.json            # Admin credentials (hashed)
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js               # Login endpoint
│   │   ├── content.js            # CRUD for all portfolio content
│   │   └── bookings.js           # Booking system (public + admin)
│   ├── index.js                  # Express server entry point
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── profile.jpg           # Profile photo
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx        # Main layout with navbar
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   └── Footer.jsx        # Dynamic footer
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth context with JWT & apiFetch
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── Consultancy.jsx
│   │   │   ├── BookConsultation.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── App.jsx           # Route definitions
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminProfile.jsx
│   │   │       ├── AdminPublications.jsx
│   │   │       ├── AdminResearchAreas.jsx
│   │   │       ├── AdminServices.jsx
│   │   │       ├── AdminMessages.jsx
│   │   │       ├── AdminBookings.jsx
│   │   │       ├── AdminBookingDetail.jsx
│   │   │       └── AdminSettings.jsx
│   │   ├── index.css             # Tailwind v4 theme tokens
│   │   └── main.jsx              # App entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm

### 1. Backend
```bash
cd backend
npm install
node index.js
# Runs on http://localhost:5001
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3005
```

### 3. Admin Access
- URL: `http://localhost:3005/admin`
- Username: `admin`
- Password: `admin123`

> ⚠️ Change admin credentials in `backend/data/admin.json` for production.

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/content/profile` | Get profile data |
| GET | `/api/content/services` | Get all services |
| GET | `/api/content/publications` | Get all publications |
| GET | `/api/content/research-areas` | Get research areas |
| GET | `/api/content/all` | Get all content |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/bookings/settings` | Get booking availability & types |
| GET | `/api/bookings/available-slots?date=YYYY-MM-DD` | Get available time slots |
| POST | `/api/bookings` | Create a booking |
| POST | `/api/auth/login` | Admin login |

### Admin (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/content/profile` | Update profile |
| POST/PUT/DELETE | `/api/content/publications` | CRUD publications |
| POST/PUT/DELETE | `/api/content/research-areas` | CRUD research areas |
| PUT | `/api/content/services` | Update services |
| GET/DELETE | `/api/content/messages` | Manage messages |
| GET | `/api/bookings/all` | Get all bookings |
| PUT | `/api/bookings/:id/status` | Update booking status |
| POST | `/api/bookings/:id/notes` | Add admin note to booking |
| DELETE | `/api/bookings/:id/notes/:index` | Delete a log entry |
| DELETE | `/api/bookings/:id` | Delete booking |
| GET/PUT | `/api/bookings/admin-settings` | Get/update booking settings |

---

## Design Tokens

| Token | Value |
|-------|-------|
| Primary | `#0f172a` |
| Accent | `#3b82f6` |
| Font Heading | Plus Jakarta Sans |
| Font Body | Inter |

---

## Screenshots

| Page | Route |
|------|-------|
| Home | `/` |
| About | `/about` |
| Projects | `/projects` |
| Courses | `/courses` |
| Consultancy | `/consultancy` |
| Book Consultation | `/book` |
| Contact | `/contact` |
| Admin Dashboard | `/admin` |
| Admin Bookings | `/admin/bookings` |
| Booking Detail | `/admin/bookings/:id` |

---

## License

This project is for **Dr. Md Enamul Haque's** professional use.

---

Built with ❤️ using React, Node.js, and Tailwind CSS.

<<<<<<< HEAD
# Servire Backend Platform API

A complete, production-ready backend built using Node.js, Express, and MongoDB. Mirrors the exact workflows expected by the Servire React frontend.

---

## Features

- **Authentication System**:
  - Secure passwords hashing with `bcrypt` (12 rounds).
  - Short-lived Access Token JWT (15 mins) & long-lived Refresh Token JWT (7 days).
  - Pre-save security structures for email verification tokens and password resets.
- **Database Architecture**:
  - Handled using **Mongoose** and **MongoDB** models.
  - Complete schemas matching required models: `users`, `workers`, `bookings`, `reviews`, `favorites`, `categories`, `emergency_requests`, `admin_logs`.
- **Security & Integrity Filters**:
  - Implements `Helmet` headers, `CORS` origins, rate limits (100 req/min auth, 1000 req/min API), NoSQL query sanitization (`mongo-sanitize`), and XSS protection (`xss-clean`).
- **Data Validation**:
  - Request validators written using `Joi` (validates Pakistan mobile formats, rating bounds, future date schedules, and address lengths).
- **Mock Data Seeding**:
  - Populates 105 realistic worker records and mock analytics with a simple seed script.

---

## Installation & Setup

### 1. Configure Environment Variables
Copy `.env.example` into a new `.env` file and adjust properties if needed:
```bash
cp .env.example .env
```

### 2. Install Packages
Navigate to the `backend/` folder and run npm installation:
```bash
npm install
```

### 3. Initialize Seeding
Migrate default records (105 workers, categories, reviews, default admin) into your local MongoDB:
```bash
npm run seed
# or
node src/seeds/runSeed.js
```

Default Admin credentials:
- **Email**: `admin@servire.pk`
- **Password**: `Admin@123`

### 4. Boot Up Server
Start Node server in development hot-reloading mode:
```bash
npm run dev
```
The server will run on `http://localhost:5000/api`.

---

## API Endpoints List

### Authentication (`/api/auth`)
- `POST /register` — Register a new user/admin.
- `POST /login` — Authenticate credentials.
- `POST /logout` — Clear session tokens.
- `POST /refresh-token` — Request new access token using refresh tokens.
- `POST /forgot-password` — Generate password reset links in system console logs.
- `POST /reset-password` — Verify reset tokens and save new password parameters.
- `GET /verify-email/:token` — Email verification link.

### Users Profile (`/api/users`)
- `GET /profile` — Fetch profile details.
- `PUT /profile` — Update details or change passwords.
- `GET /bookings` — Fetch booking logs linked to user.
- `GET /favorites` — Fetch list of saved workers.
- `POST /favorites/:workerId` — Save worker to favorites list.
- `DELETE /favorites/:workerId` — Remove worker from favorites.

### Workers Directory (`/api/workers`)
- `GET /` — Search and filter workers list (by text search, city, ratings, skills, verified, availability, sorting limits).
- `GET /:id` — Details of a worker by numeric ID.
- `PUT /profile` — Update worker information.
- `PUT /availability` — Update availability (available/busy).
- `GET /:id/portfolio` — Fetch portfolio images.

### Bookings (`/api/bookings`)
- `POST /` — Create booking.
- `GET /:id` — Details of a booking.
- `PUT /:id/cancel` — Cancel booking.
- `PUT /:id/status` — Modify booking status (pending/confirmed/completed/cancelled).
- `GET /worker/:workerId` — Bookings associated with a worker.

### Reviews (`/api/reviews`)
- `POST /` — Create worker review.
- `GET /worker/:workerId` — Worker reviews list.
- `PUT /:id` — Edit review text or ratings.
- `DELETE /:id` — Delete review.

### Emergency Dispatch (`/api/emergency`)
- `POST /request` — Submit emergency request category to start scans.
- `GET /nearby` — Get nearby available workers.
- `POST /dispatch/:workerId` — Dispatch worker to request location.
- `GET /status/:requestId` — Current emergency scan status.

### Admin Tools (`/api/admin`)
- `GET /stats` — Total users/workers/bookings counts and platform revenue statistics.
- `GET /analytics/cities` — Worker distribution by cities.
- `GET /analytics/workers` — Worker stats.
- `GET /analytics/bookings` — Booking records.
- `GET /users` — Admin view of all user entries.
- `PUT /users/:id/role` — Update user permissions (user/admin).
- `PUT /workers/:id/verify` — Update verification badges.
- `DELETE /users/:id` — Delete user account.

### Categories (`/api/categories`)
- `GET /` — List service categories.
- `GET /:id` — Details of a category.
- `GET /:id/workers` — List workers of a category.
=======
# 🌊 SERVIRE - Home Service Platform

> A complete, production-ready React application connecting verified professionals with customers across Pakistan. Built with React Router, Context API, and modern UI/UX practices.

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![React Router](https://img.shields.io/badge/React_Router-6.x-CA4245?logo=react-router)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Live Demo

**[View Live Application](https://your-vercel-url.vercel.app)**

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Deployment](#deployment)
- [Assignment Requirements](#assignment-requirements)
- [What I Learned](#what-i-learned)
- [Author](#author)

---

## 🎯 Project Overview

**Servire** (derived from "Service" + "Fire" - symbolizing passionate service) is a comprehensive home service platform that connects customers with verified professionals including electricians, plumbers, cleaners, AC technicians, carpenters, and many more.

This project was developed as a React assignment demonstrating multi-page application architecture, client-side routing, and dynamic data fetching.

---

## ✨ Features

### Core Features (Assignment Requirements)
| Feature | Status | Description |
|---------|--------|-------------|
| Multi-page React App | ✅ | Complete SPA with 12+ routes |
| React Router Navigation | ✅ | Navbar, Links, Dynamic routes |
| User List Page | ✅ | Workers directory with 105+ professionals |
| User Details Page | ✅ | Full profile with portfolio & reviews |
| Loading States | ✅ | Spinners, Skeleton cards, Shimmer effects |
| Error States | ✅ | Error boundaries, fallback UI, retry buttons |
| API Integration | ✅ | Mock API with loading simulation |
| Deployment | ✅ | Ready for Vercel/Netlify |

### Bonus Features (Exceeded Expectations)
- 🤖 **Hoori AI Chatbot** - Smart assistant for navigation and FAQs
- 🌓 **Dark/Light Theme** - Smooth theme switching with localStorage
- 🚨 **Emergency SOS System** - 24/7 emergency response simulation
- 💖 **Favorites/Wishlist** - Save and manage favorite professionals
- 📊 **Smart City Analytics** - Real-time platform statistics dashboard
- 👑 **Admin Panel** - Employee and worker management
- 🎨 **Portfolio Gallery** - Masonry layout with before/after slider
- 📱 **Fully Responsive** - Mobile-first design
- 🎉 **Confetti & Animations** - Celebratory effects on booking

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **React Router DOM v6** | Navigation & routing |
| **Context API** | State management (theme, auth, favorites) |
| **CSS-in-JS** | Dynamic styling with theme variables |
| **Custom Hooks** | useDebounce, useApp, useTheme |
| **Error Boundaries** | Graceful error handling |

---

## 💻 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/servire-app.git
cd servire-app

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
Dependencies to Install
bash
npm install react-router-dom
main.jsx Setup
jsx
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)
🚀 Deployment
Deploy to Vercel (Recommended)
Option 1: Vercel CLI

bash
npm install -g vercel
vercel --prod
Option 2: GitHub + Vercel

Push code to GitHub

Go to vercel.com

Import your repository

Framework preset: Create React App (or Vite)

Build command: npm run build

Output directory: build or dist

Click Deploy

vercel.json (for SPA routing)
json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
Deploy to Netlify
bash
npm run build
# Drag and drop the build folder to Netlify
📚 Assignment Requirements Checklist
Part 1 ✅
Build a React application

Plan the structure of a multi-page React app

Implement basic routing for navigation between pages

Fetch and display user data using API (JSONPlaceholder equivalent)

Create a User List page that displays users

Allow navigation to user details page using React Router

Part 2 & Deploy ✅
Complete details page

Add loading and error states

Deploy to Vercel 

Share live URL

Write README

🧠 What I Learned
Technical Skills
React Router v6: Dynamic routes, nested routes, protected routes, useParams, useNavigate, NavLink

Context API: Global state management for theme, auth, and favorites

Custom Hooks: Created useDebounce for search optimization

Error Handling: Error Boundaries, try-catch patterns, fallback UI

Performance: useCallback, useEffect optimization, debounced search

CSS-in-JS: Dynamic theming with CSS variables

Deployment: Vercel/Netlify configuration for SPA routing

Soft Skills
Planning multi-page application architecture

Breaking down complex UI into reusable components

Managing state across deeply nested components

Creating smooth user experiences with loading skeletons

Building for production with error resilience

👩‍💻 Author
name  ARIKA AHSAN



GitHub: ARIKA AHSAN
arikaahsan107-ui


LinkedIn: ARIKA AHSAN


📄 License
MIT License - feel free to use this project for learning and portfolio purposes.

Made with 🌊 in Pakistan
>>>>>>> 913b4d8d0d7d71ce0d54104316a990ad6587f9ca
#   s e r v i r e - b a c k e n d  
 
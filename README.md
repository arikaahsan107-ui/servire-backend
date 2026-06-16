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

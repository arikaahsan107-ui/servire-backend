🌊 SERVIRE - Backend API

Production-ready backend for Servire Home Service Platform built with Node.js, Express, and MongoDB.

🚀 Overview

This backend powers the Servire platform, handling:

Authentication (JWT based)
Users & Workers management
Bookings system
Reviews & ratings
Emergency service requests
Admin dashboard APIs
Categories & filtering system
🧰 Tech Stack
Node.js
Express.js
MongoDB + Mongoose
JWT Authentication
bcrypt (password hashing)
Joi (validation)
Helmet (security headers)
CORS
XSS protection
mongo-sanitize
express-rate-limit
✨ Features
🔐 Authentication
User registration & login
JWT Access Token (15 min)
Refresh Token (7 days)
Password hashing (bcrypt 12 rounds)
Email verification (token-based)
Password reset system
👤 Users
Profile management
View bookings
Favorite workers system
🧑‍🔧 Workers
Worker profiles
Search & filter (city, skills, rating, availability)
Portfolio images
Verification system
Availability status
📦 Bookings
Create booking
Cancel booking
Update booking status (pending / confirmed / completed / cancelled)
Worker-specific booking history
⭐ Reviews
Add review
Edit review
Delete review
Worker rating calculation
🚨 Emergency System
Emergency service request
Nearby worker search
Worker dispatch system
Request status tracking
👑 Admin Panel APIs
User management
Worker verification
Platform statistics
Analytics (cities, bookings, workers)
Role management
📂 Categories
Service categories list
Workers by category
⚙️ Installation & Setup
1️⃣ Clone Project
git clone https://github.com/your-username/servire-backend.git
cd servire-backend
2️⃣ Install Dependencies
npm install
3️⃣ Environment Setup

Create .env file:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/servire
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
4️⃣ Run Seeder (Optional but Recommended)
npm run seed

Default Admin:

Email: admin@servire.pk
Password: Admin@123
5️⃣ Start Server
npm run dev

Server runs at:

http://localhost:5000/api
📡 API Routes
Auth
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET /api/auth/verify-email/:token
Users
GET /api/users/profile
PUT /api/users/profile
GET /api/users/bookings
GET /api/users/favorites
POST /api/users/favorites/:workerId
DELETE /api/users/favorites/:workerId
Workers
GET /api/workers
GET /api/workers/:id
PUT /api/workers/profile
PUT /api/workers/availability
GET /api/workers/:id/portfolio
Bookings
POST /api/bookings
GET /api/bookings/:id
PUT /api/bookings/:id/cancel
PUT /api/bookings/:id/status
GET /api/bookings/worker/:workerId
Reviews
POST /api/reviews
GET /api/reviews/worker/:workerId
PUT /api/reviews/:id
DELETE /api/reviews/:id
Emergency
POST /api/emergency/request
GET /api/emergency/nearby
POST /api/emergency/dispatch/:workerId
GET /api/emergency/status/:requestId
Admin
GET /api/admin/stats
GET /api/admin/users
GET /api/admin/analytics/cities
GET /api/admin/analytics/workers
GET /api/admin/analytics/bookings
PUT /api/admin/users/:id/role
PUT /api/admin/workers/:id/verify
DELETE /api/admin/users/:id
Categories
GET /api/categories
GET /api/categories/:id
GET /api/categories/:id/workers
🔐 Security Features
Helmet (secure HTTP headers)
CORS protection
Rate limiting
XSS protection
Mongo sanitization
Password hashing (bcrypt)
🧠 What I Learned
REST API design
Authentication & authorization (JWT)
MongoDB schema design
Middleware architecture in Express
Security best practices
Real-world backend structure
👩‍💻 Author

Arika Ahsan

GitHub: arikaahsan107-ui
LinkedIn: ARIKA AHSAN

📄 License

MIT License

🌊 Built with Node.js in Pakistan

Agar chaho to main next step mein tumhara:
✔ backend deploy (Railway/Render)
✔ frontend connect with backend URL
✔ env production setup
✔ Postman collection ready

sab set karwa deta hoon 👍

thora chota or professional likho

Theek hai 👍 main tumhein short + professional backend README de raha hoon — clean, GitHub-ready, no extra fluff.

🌊 Servire Backend API

A secure and scalable backend for the Servire Home Service Platform built with Node.js, Express, and MongoDB.

🚀 Tech Stack
Node.js
Express.js
MongoDB & Mongoose
JWT Authentication
bcrypt
Joi Validation
Helmet, CORS, XSS Protection
✨ Features
🔐 Authentication
User registration & login
JWT access & refresh tokens
Password hashing (bcrypt)
Email verification & password reset
👤 Users & Workers
User profile management
Worker directory with filters (city, skills, rating, availability)
Favorites system
Worker portfolio support
📦 Bookings
Create, update, and cancel bookings
Booking status tracking (pending, confirmed, completed, cancelled)
⭐ Reviews
Add, edit, delete reviews
Worker rating system
🚨 Emergency System
Emergency service requests
Nearby worker detection
Dispatch & status tracking
👑 Admin Panel
Manage users & workers
Verify workers
Platform analytics (users, bookings, cities)
⚙️ Setup
1. Install Dependencies
npm install
2. Environment Variables

Create .env file:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
3. Seed Database (optional)
npm run seed
4. Run Server
npm run dev

Server runs at:

http://localhost:5000/api
📡 API Endpoints
Auth
POST /auth/register
POST /auth/login
POST /auth/refresh-token
Users
GET /users/profile
PUT /users/profile
Workers
GET /workers
GET /workers/:id
Bookings
POST /bookings
GET /bookings/:id
Reviews
POST /reviews
GET /reviews/worker/:workerId
Admin
GET /admin/stats
GET /admin/users
🔐 Security
JWT Authentication
Password encryption (bcrypt)
Rate limiting
CORS protection
Input sanitization
👩‍💻 Author

Arika Ahsan

GitHub: arikaahsan107-ui

🌊 License

MIT
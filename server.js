require("dotenv").config();
const express = require('express');
// const cors = require('cors');   // ✅ COMMENT KARO — CORS already src/app.js mein hai
const connectDB = require("./src/config/db");
const app = require("./src/app");

// ✅ CORS KO YAHAN SE HATAO (duplicate hai)
// app.use(cors({
//   origin: '*',
//   credentials: true,
// }));

app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[SERVIRE BACKEND] Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("[SERVIRE BACKEND] Database connection failed. Server not started.", err);
    process.exit(1);
  });
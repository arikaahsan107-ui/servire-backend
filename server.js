require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

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

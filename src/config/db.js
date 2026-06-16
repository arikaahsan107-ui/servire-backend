const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || "mongodb://localhost:27017/servire";
    console.log("[DB CONFIG] Connecting to Database...");
    
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log(`[DB CONFIG] MongoDB Connected successfully to host: ${conn.connection.host}`);
  } catch (err) {
    console.error(`[DB CONFIG] Connection Error: ${err.message}`);
    throw err;
  }
};

module.exports = connectDB;

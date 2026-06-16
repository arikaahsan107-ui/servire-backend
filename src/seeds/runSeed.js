require("dotenv").config();
const mongoose = require("mongoose");
const seedDatabase = require("./seedDatabase");

const runSeed = async () => {
  try {
    const connStr = process.env.MONGODB_URI || "mongodb://localhost:27017/servire";
    console.log(`[RUN SEED] Connecting to ${connStr} for database migration...`);
    
    await mongoose.connect(connStr);
    
    console.log("[RUN SEED] Database connected. Starting migrations...");
    await seedDatabase();
    
    console.log("[RUN SEED] Migrations completed. Closing DB Connection.");
    await mongoose.disconnect();
    
    console.log("[RUN SEED] Done. Seed runner process exiting successfully.");
    process.exit(0);
  } catch (err) {
    console.error("[RUN SEED] Critical migration failure:", err);
    process.exit(1);
  }
};

runSeed();

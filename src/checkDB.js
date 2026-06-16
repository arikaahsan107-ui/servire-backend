const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// ✅ FIXED PATH
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI;

async function checkDatabase() {
  try {
    console.log("⏳ Connecting to MongoDB Atlas...");

    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI not loaded. Check .env file location");
    }

    await mongoose.connect(MONGODB_URI);

    console.log("✅ Connected successfully!");

    const db = mongoose.connection.db;

    const collections = await db.listCollections().toArray();

    console.log("\n📁 Collections:");
    collections.forEach(c => console.log("-", c.name));

  } catch (err) {
    console.log("\n❌ ERROR:");
    console.log(err.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkDatabase();
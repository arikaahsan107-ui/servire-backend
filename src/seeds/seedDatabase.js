const mongoose = require("mongoose");
const User = require("../models/User");
const Worker = require("../models/Worker");
const Category = require("../models/Category");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const bcrypt = require("bcryptjs");

// SEED DATA CONFIGURATION MATCHING FRONTEND FACTS
const SKILLS = [
  "Electrician", "Plumber", "Cleaner", "AC Technician", "Carpenter", "Painter",
  "Tutor", "Mechanic", "Beautician", "Chef", "Driver", "Gardener"
];

const CITIES = [
  "Gujrat", "Lahore", "Karachi", "Islamabad", "Rawalpindi",
  "Faisalabad", "Multan", "Peshawar", "Sialkot", "Quetta"
];

const ZONES = [
  "Satellite Town", "Defence Housing", "City Centre", "Garden Town",
  "Model Town", "Cantt Area", "Saddar", "Johar Town"
];

const M_NAMES = [
  "Ali Khan", "Bilal Ahmed", "Usman Ali", "Omar Shafiq", "Hamza Butt",
  "Tariq Mehmood", "Imran Rao", "Asad Chaudhry", "Junaid Qureshi",
  "Kamran Dar", "Hassan Raza"
];

const F_NAMES = [
  "Aisha Khan", "Fatima Ali", "Sara Ahmed", "Zara Malik", "Hina Tariq",
  "Sana Mir", "Nadia Hassan", "Rabia Sheikh", "Mehwish Zafar",
  "Anum Riaz", "Sumera Butt", "Laila Khan"
];

const REV_POOL = [
  "🌊 Amazing service — professional, punctual, and very thorough.",
  "✨ Did an excellent job. Clean, careful, and affordable. Will hire again.",
  "💕 Very happy with the quality. Fair pricing and great attitude.",
  "🫶 Quick response, very courteous, and impressively skilled.",
  "⭐ Super satisfied! Everything was done perfectly to specification.",
  "🌟 Best professional in the city! Very transparent about pricing.",
  "💖 Went above and beyond every expectation. Truly 5 stars."
];

const PROFESSION_IMAGES = {
  Electrician: {
    cover: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=80&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1621905251918-bf1b7a4e6fe2?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80&auto=format&fit=crop"
    ],
    categoryImg: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80&auto=format&fit=crop"
  },
  Plumber: {
    cover: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=900&q=80&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300&q=80&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80&auto=format&fit=crop"
    ],
    categoryImg: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&q=80&auto=format&fit=crop"
  },
  Cleaner: {
    cover: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=80&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527515545081-5db817172677?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80&auto=format&fit=crop"
    ],
    categoryImg: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80&auto=format&fit=crop"
  },
  "AC Technician": {
    cover: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=900&q=80&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&q=80&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80&auto=format&fit=crop"
    ],
    categoryImg: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80&auto=format&fit=crop"
  },
  Carpenter: {
    cover: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=900&q=80&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=80&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80&auto=format&fit=crop"
    ],
    categoryImg: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80&auto=format&fit=crop"
  },
  Painter: {
    cover: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=900&q=80&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=300&q=80&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80&auto=format&fit=crop"
    ],
    categoryImg: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&q=80&auto=format&fit=crop"
  },
  Tutor: {
    cover: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&q=80&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&q=80&auto=format&fit=crop"
    ],
    categoryImg: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80&auto=format&fit=crop"
  },
  Mechanic: {
    cover: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=900&q=80&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=300&q=80&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80&auto=format&fit=crop"
    ],
    categoryImg: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=600&q=80&auto=format&fit=crop"
  },
  Beautician: {
    cover: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&q=80&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1487412947147-5cebf100d3c6?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80&auto=format&fit=crop"
    ],
    categoryImg: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80&auto=format&fit=crop"
  },
  Chef: {
    cover: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=900&q=80&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&q=80&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514986888952-8cd320577b68?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80&auto=format&fit=crop"
    ],
    categoryImg: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80&auto=format&fit=crop"
  },
  Driver: {
    cover: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=900&q=80&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=300&q=80&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484185759689-8f7f0c03e352?w=400&q=80&auto=format&fit=crop"
    ],
    categoryImg: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80&auto=format&fit=crop"
  },
  Gardener: {
    cover: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=80&auto=format&fit=crop",
    avatar: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80&auto=format&fit=crop",
    portfolio: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585320806297-9794b3e4aaae?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&q=80&auto=format&fit=crop"
    ],
    categoryImg: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80&auto=format&fit=crop"
  }
};

const CATEGORIES_MOCK = [
  { label: "Electrician", icon: "⚡" },
  { label: "Plumber", icon: "🔧" },
  { label: "Cleaner", icon: "🧹" },
  { label: "AC Technician", icon: "❄️" },
  { label: "Carpenter", icon: "🔨" },
  { label: "Painter", icon: "🎨" },
  { label: "Tutor", icon: "📚" },
  { label: "Mechanic", icon: "🔩" },
  { label: "Beautician", icon: "💄" },
  { label: "Chef", icon: "🍳" },
  { label: "Driver", icon: "🚗" },
  { label: "Gardener", icon: "🌿" }
];

const FALLBACK_AVATAR_M = (i) => `https://randomuser.me/api/portraits/men/${(i % 60) + 1}.jpg`;
const FALLBACK_AVATAR_F = (i) => `https://randomuser.me/api/portraits/women/${(i % 60) + 1}.jpg`;

// Helper data generation mimicking genWorkers() from frontend
function generateSeedWorkers() {
  const workers = [];
  const usedEmails = new Set();
  
  for (let i = 0; i < 105; i++) {
    const isFem = i % 2 === 0;
    const name = isFem ? F_NAMES[i % F_NAMES.length] : M_NAMES[i % M_NAMES.length];
    const skill = SKILLS[i % SKILLS.length];
    const prof = PROFESSION_IMAGES[skill] || PROFESSION_IMAGES["Electrician"];
    const avatar = isFem ? FALLBACK_AVATAR_F(i) : FALLBACK_AVATAR_M(i);
    
    // Create UNIQUE email with index number
    let email = `${name.toLowerCase().replace(/\s+/g, ".")}.${i + 1}@servire.pk`;
    
    // Ensure absolutely unique (just in case)
    while (usedEmails.has(email)) {
      email = `${name.toLowerCase().replace(/\s+/g, ".")}.${i + 1}.${Date.now()}@servire.pk`;
    }
    usedEmails.add(email);
    
    // Reviews mapping
    const reviews = Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, ri) => ({
      userName: isFem ? M_NAMES[ri % M_NAMES.length] : F_NAMES[ri % F_NAMES.length],
      rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
      text: REV_POOL[(i + ri) % REV_POOL.length],
      date: new Date(Date.now() - Math.random() * 90 * 864e5).toLocaleDateString("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }),
      verified: Math.random() > 0.3
    }));

    const skillBars = [
      { name: "Communication", pct: 70 + Math.round(Math.random() * 25) },
      { name: "Technical Skill", pct: 75 + Math.round(Math.random() * 22) },
      { name: "Punctuality", pct: 80 + Math.round(Math.random() * 18) },
      { name: "Quality of Work", pct: 72 + Math.round(Math.random() * 25) }
    ];

    const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = reviews.length > 0 ? +(ratingSum / reviews.length).toFixed(1) : 4.5;

    workers.push({
      workerId: i + 1,
      name,
      email,
      phone: `+92 3${Math.floor(Math.random() * 4)}0 ${Math.floor(Math.random() * 9e6) + 1e6}`,
      avatar,
      coverImage: prof.cover,
      portfolio: prof.portfolio.map((img) => ({ image: img })),
      skill,
      subSkills: [SKILLS[(i + 1) % SKILLS.length], SKILLS[(i + 2) % SKILLS.length]],
      experience: Math.floor(Math.random() * 14) + 1,
      price: 500 + i * 45,
      rating: avgRating,
      totalReviews: reviews.length * 18 + 12,
      reviews,
      city: CITIES[i % CITIES.length],
      zone: ZONES[i % ZONES.length],
      availability: Math.random() > 0.3 ? "available" : "busy",
      verified: Math.random() > 0.2,
      completedJobs: Math.floor(Math.random() * 500) + 20,
      joinDate: new Date(Date.now() - Math.random() * 1000 * 864e5).toLocaleDateString("en-PK", {
        month: "long",
        year: "numeric"
      }),
      emergencyAvailable: Math.random() > 0.5,
      languages: ["Urdu", "English", ...(Math.random() > 0.6 ? ["Punjabi"] : [])],
      skillBars,
      bio: `🌊 Seasoned ${skill} with ${Math.floor(Math.random() * 14) + 1}+ years of professional excellence.\n\n✨ Known for meticulous work, honest pricing, and complete customer satisfaction.\n\n🌿 Serving ${CITIES[i % CITIES.length]} and surrounding areas with verified credentials.`
    });
  }
  
  return workers;
}

// MAIN SEED LOGIC
const seedDatabase = async () => {
  try {
    console.log("[SEED] Resetting database collections...");
    
    // Clear collections
    await User.deleteMany({});
    await Worker.deleteMany({});
    await Category.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});

    console.log("[SEED] Database cleared. Seeding Default Admin...");

    // Hash password for admin
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash("Admin@123", salt);

    // Seed default administrator
    const admin = await User.create({
      name: "Admin User",
      email: "admin@servire.pk",
      password: hashedPassword,
      role: "admin",
      isVerified: true
    });
    console.log("[SEED] Default admin created: admin@servire.pk (Password: Admin@123)");

    console.log("[SEED] Seeding categories...");
    // Seed categories
    const categoriesToSeed = CATEGORIES_MOCK.map((cat) => {
      const prof = PROFESSION_IMAGES[cat.label] || PROFESSION_IMAGES["Electrician"];
      return {
        label: cat.label,
        icon: cat.icon,
        coverImg: prof.categoryImg,
        count: 8 + Math.floor(Math.random() * 6)
      };
    });
    await Category.insertMany(categoriesToSeed);
    console.log("[SEED] Categories inserted.");

    console.log("[SEED] Generating and seeding 105 mock workers...");
    // Seed workers
    const seedWorkers = generateSeedWorkers();
    await Worker.insertMany(seedWorkers);
    console.log("[SEED] 105 mock workers seeded.");

    console.log("[SEED] Extrapolating worker reviews to separate reviews collection...");
    // Extract reviews from workers data to Review collection
    const allReviews = [];
    seedWorkers.forEach((w) => {
      if (w.reviews && Array.isArray(w.reviews)) {
        w.reviews.forEach((r) => {
          allReviews.push({
            workerId: w.workerId,
            userName: r.userName,
            rating: r.rating,
            text: r.text,
            date: r.date,
            verified: r.verified || false
          });
        });
      }
    });
    
    if (allReviews.length > 0) {
      await Review.insertMany(allReviews);
      console.log(`[SEED] Seeded ${allReviews.length} standalone reviews.`);
    } else {
      console.log("[SEED] No reviews to seed.");
    }

    console.log("[SEED] Seeding mock bookings...");
    // Seed default booking lists matching user dashboard expectations
    const mockBookings = [
      {
        bookingId: "SRV_BK9F1A",
        userId: admin._id,
        workerId: seedWorkers[0]?.workerId || 1,
        workerName: seedWorkers[0]?.name || "Ali Khan",
        workerSkill: seedWorkers[0]?.skill || "Electrician",
        date: "2025-05-21",
        time: "2:00 PM",
        address: "House #15, Satellite Town, Gujrat",
        notes: "Please call before arriving.",
        isEmergency: false,
        totalAmount: 1500,
        status: "confirmed"
      },
      {
        bookingId: "SRV_BK3C2E",
        userId: admin._id,
        workerId: seedWorkers[1]?.workerId || 2,
        workerName: seedWorkers[1]?.name || "Bilal Ahmed",
        workerSkill: seedWorkers[1]?.skill || "Plumber",
        date: "2025-05-18",
        time: "10:00 AM",
        address: "Apartment 4B, DHA Phase 5, Lahore",
        notes: "",
        isEmergency: false,
        totalAmount: 1200,
        status: "completed"
      },
      {
        bookingId: "SRV_BK5D7G",
        userId: admin._id,
        workerId: seedWorkers[2]?.workerId || 3,
        workerName: seedWorkers[2]?.name || "Sara Ahmed",
        workerSkill: seedWorkers[2]?.skill || "Cleaner",
        date: "2025-05-15",
        time: "9:00 AM",
        address: "Model Town Block C, Lahore",
        notes: "Urgent cleanup",
        isEmergency: true,
        totalAmount: 1200,
        status: "completed"
      }
    ];

    await Booking.insertMany(mockBookings);
    console.log("[SEED] Seeding bookings completed.");
    
    console.log("[SEED] ==========================================");
    console.log("[SEED] ✅ Database seeding successfully completed! 🌊");
    console.log("[SEED] ✅ Admin Email: admin@servire.pk");
    console.log("[SEED] ✅ Admin Password: Admin@123");
    console.log("[SEED] ✅ Total Workers: 105");
    console.log("[SEED] ✅ Total Categories: 12");
    console.log("[SEED] ==========================================");
  } catch (err) {
    console.error("[SEED] ❌ Seeding failed with error:", err.message);
    throw err;
  }
};

module.exports = seedDatabase;
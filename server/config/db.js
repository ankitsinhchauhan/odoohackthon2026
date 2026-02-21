const mongoose = require("mongoose");

const connectDB = async () => {
    const options = {
        serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
        socketTimeoutMS: 45000,
    };

    try {
        console.log("⏳ Connecting to MongoDB Atlas...");
        const conn = await mongoose.connect(process.env.MONGODB_URI, options);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        console.log("--------------------------------------------------");
        console.log("TROUBLESHOOTING TIPS:");
        console.log("1. Check IP Whitelist: Atlas -> Network Access -> Add 0.0.0.0/0 (temporary)");
        console.log("2. Check DNS: Set your network DNS to Google (8.8.8.8)");
        console.log("3. Firewall: Ensure port 27017 is open on your router/network");
        console.log("--------------------------------------------------");
    }
};

module.exports = connectDB;

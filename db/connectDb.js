// db/connectDb.js (Corrected Code)

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Check if we are already connected
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    // ✅ FIX: Use the environment variable instead of hardcoded localhost
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;

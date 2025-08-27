import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully to MongoDB");
  } catch (err) {
    console.error("Cannot connect to MongoDB:", err.message);
    process.exit(1);
  }
};

export default connectDB;
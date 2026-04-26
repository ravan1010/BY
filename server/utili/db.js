import mongoose from "mongoose";

const MONGO_URI = 'mongodb+srv://ravanravana177:r1a09u4hx4u9sT4T@cluster0.5m8gkwy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'


const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
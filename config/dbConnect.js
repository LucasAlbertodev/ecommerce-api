import mongoose from "mongoose";

// Connect to MongoDB
const dbConnect = async () => {
  try {
    mongoose.set("strictQuery", true);
    const connected = await mongoose.connect(process.env.MONGO_URL, {});
    console.log(`Connected to Mongodb ${connected.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default dbConnect;

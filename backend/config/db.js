import mongoose from "mongoose";

export const connectMongoDatabase = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.DB_URI);
    console.log(`MongoDB connected with server: ${connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // We don't exit here, allowing the server to handle the rejection or retry if needed
    throw error;
  }
};

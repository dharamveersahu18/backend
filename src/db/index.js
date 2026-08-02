import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async () => {
  try {
    const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log(`\n Connected to MongoDB DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with an error code
  }
};

export default connectDB;
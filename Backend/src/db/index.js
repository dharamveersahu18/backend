// This file has one major job:

// Connect Node.js to MongoDB.

import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";//extensionn

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    const rawUrl = process.env.MONGODB_URL || "";
    const connectionString = rawUrl.trim().replace(/^["']|["']$/g, "");

    if (!connectionString) {
      throw new Error("MONGODB_URL environment variable is missing. Please add MONGODB_URL in your Vercel Project Settings > Environment Variables.");
    }

    if (!connectionString.startsWith("mongodb://") && !connectionString.startsWith("mongodb+srv://")) {
      throw new Error(`Invalid MONGODB_URL scheme. Received "${connectionString.slice(0, 15)}...". MONGODB_URL must start with "mongodb://" or "mongodb+srv://". Check Vercel Environment Variables.`);
    }

    const connectionInstance = await mongoose.connect(connectionString, {
      dbName: DB_NAME,
    });
    console.log(
      `\n Connected to MongoDB DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
};

export default connectDB;



// import mongoose from "mongoose";
// import { DB_NAME } from "../constants.js";

// const connectDB = async() => {
//   try {
//     const conncetionInstance =await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//     console.log(`\n MongoDb connected !! DB HOST:
      
//       ${conncetionInstance.connection.host}`);
    
//   } catch (error) {
//     console.log("MONGDB connection error", error);
//     process.exit(1)
//   }
// }
// export default connectDB 


// connnectionInstance 
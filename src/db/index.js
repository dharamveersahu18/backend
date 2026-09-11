// This file has one major job:

// Connect Node.js to MongoDB.

import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";//extensionn

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL environment variable is missing. Please set it in Vercel settings.");
    }
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URL, {
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
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";//extensionn

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `\n Connected to MongoDB DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with an error code
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
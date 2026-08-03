//require("dotenv").config({path: "./.env"});

import dotenv from "dotenv";

import connectDB from "./db/index.js";
import { DB_NAME } from "./constants.js";
dotenv.config({ path: "./.env" });
connectDB()
.then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  });
  console.log(`Connected to MongoDB database: ${DB_NAME}`);
},

app.on("error", (error) => {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1); // Exit the process with an error code
}
)
)
.catch((error) => {
  console.error(" MongoDB connection failed:", error);
  process.exit(1); // Exit the process with an error code
})


// ifies
/*
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    app.on("error", (error) => {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();
*/

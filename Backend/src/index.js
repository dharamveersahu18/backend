import "dotenv/config";

import connectDB from "./db/index.js";
import { DB_NAME } from "./constants.js";
import { app } from "./app.js";


connectDB()
  .then(() => {
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Connected to MongoDB database: ${DB_NAME}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });

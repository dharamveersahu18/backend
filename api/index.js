import dotenv from "dotenv";
dotenv.config();

import connectDB from "../src/db/index.js";
import { app } from "../src/app.js";

// Middleware to ensure DB connection is ready before handling requests on Vercel
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error in Vercel handler:", error);
    return res.status(500).json({
      statusCode: 500,
      data: null,
      message: "Database connection failed: " + (error.message || "Unknown error"),
      success: false,
      errors: [error.message],
    });
  }
});

export default app;

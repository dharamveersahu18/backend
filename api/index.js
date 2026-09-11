import dotenv from "dotenv";
dotenv.config();

import connectDB from "../src/db/index.js";
import app from "../src/app.js";

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Vercel Serverless Handler Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        statusCode: 500,
        message: "Server Error: " + (error.message || "Unknown error"),
        success: false,
      });
    }
  }
}

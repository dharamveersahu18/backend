import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Check if Cloudinary credentials are provided
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      // Upload file to Cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
      });

      // Remove locally saved temporary file after upload
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
      return response;
    }

    // Fallback if Cloudinary credentials are not set: serve from local temp
    const filename = path.basename(localFilePath);
    return {
      url: `/temp/${filename}`,
      public_id: filename,
      duration: 0,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    if (fs.existsSync(localFilePath)) {
      // If error occurs, create local fallback rather than crashing
      const filename = path.basename(localFilePath);
      return {
        url: `/temp/${filename}`,
        public_id: filename,
        duration: 0,
      };
    }
    return null;
  }
};

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    if (!publicId) return null;
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
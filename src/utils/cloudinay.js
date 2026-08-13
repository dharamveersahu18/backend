import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({
  Cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
  api_key : process.env.CLOUDINARY_CLOUD_API_KEY,
api_secret: process.env.CLOUDINARY_API_SECRET,

API_environment:process.env.CLOUDINARY_API_ENVIRONMENT_VARIABLE

});

const uploadOnCloudinary = async(localFilePath) =>{
  try {
    if (!localFilePath)  return null 
      // upload the file on cloudinary
       const response = await cloudinary.uploader.upload(localFilePath,{
        resource_type="auto"
      })
      //file has been uploaded sucessfuly
      console.log("file is uploaded on cloudinary", response.url)
      return response;
      } catch (error) {
    fs.unlinkSync(localFilePath) // remove the loally saved tempory file as the upload operation got failed
    return null;
  }
}

export {uploadOnCloudinary}
import {v2 as cloudinary} from "cloudinary"

import {config} from 'dotenv'

config()        // this file might execute in isolation that's why useing config to import .env variables.

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export default cloudinary;


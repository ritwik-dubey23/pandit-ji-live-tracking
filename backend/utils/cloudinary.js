import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


//    uplod the img file on cloudinaryy




const uploadOnCloudinary = async(file) => {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    try {

        // image upload ke liye on clodinaryy 
        const result = await cloudinary.uploader.upload(file);


        // upload hone ke baad file ko delete krne  ke liye fs  USE bulit-in  nodejs  function hh

        fs.unlinkSync(file);
        return result.secure_url;


    } catch (error) {
        fs.unlinkSync(file)

        console.log(error);
    }
}


export default uploadOnCloudinary;
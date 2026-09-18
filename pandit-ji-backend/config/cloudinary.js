import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const getPublicIdFromUrl = (url) => {
    if (!url || typeof url !== "string" || !url.includes("cloudinary.com")) return null;
    try {
        const parts = url.split("/");
        const uploadIndex = parts.indexOf("upload");
        if (uploadIndex === -1) return null;

        let pathParts = parts.slice(uploadIndex + 1);
        if (pathParts[0] && pathParts[0].startsWith("v") && !isNaN(pathParts[0].substring(1))) {
            pathParts = pathParts.slice(1);
        }
        const fullPath = pathParts.join("/");
        const dotIndex = fullPath.lastIndexOf(".");
        return dotIndex !== -1 ? fullPath.substring(0, dotIndex) : fullPath;
    } catch (err) {
        return null;
    }
};

export const deleteCloudinaryImage = async (url) => {
    const publicId = getPublicIdFromUrl(url);
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        console.error("Cloudinary destroy error for publicId", publicId, err.message);
    }
};

export default cloudinary;

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
    console.warn("[CLOUDINARY WARN] Cloudinary environment variables are incomplete! Ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in Render.");
} else {
    console.log(`[CLOUDINARY CONFIG] Cloudinary initialized with cloud_name: ${cloudName}`);
}

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
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

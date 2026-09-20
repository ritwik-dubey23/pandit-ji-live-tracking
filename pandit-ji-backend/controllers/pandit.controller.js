import fs from "fs";
import mongoose from "mongoose";
import Pandit from "../models/pandit.model.js";
import User from "../models/user.models.js";
import Review from "../models/review.model.js";
import cloudinary, { deleteCloudinaryImage } from "../config/cloudinary.js";

export const getAllPandits = async (req, res) => {
    try {
        const { city, search } = req.query;
        let query = {};

        if (city && city.trim()) {
            query.city = { $regex: city.trim(), $options: "i" };
        }

        if (search && search.trim()) {
            const rawSearch = search.trim();
            const words = rawSearch.split(/\s+/).filter(Boolean);
            const searchRegex = new RegExp(rawSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");

            // Build regex conditions for exact phrase AND individual terms
            const orConditions = [
                { name: searchRegex },
                { description: searchRegex },
                { city: searchRegex },
                { "services.name": searchRegex },
                { "services.description": searchRegex }
            ];

            // Common variations/transliteration mapping
            const qLower = rawSearch.toLowerCase();
            if (qLower.includes("grih") || qLower.includes("pravesh") || qLower.includes("house")) {
                orConditions.push({ "services.name": { $regex: "griha", $options: "i" } });
                orConditions.push({ "services.name": { $regex: "pravesh", $options: "i" } });
            }
            if (qLower.includes("satya") || qLower.includes("narayan")) {
                orConditions.push({ "services.name": { $regex: "satyanarayan", $options: "i" } });
            }
            if (qLower.includes("vivah") || qLower.includes("shadi") || qLower.includes("marriage")) {
                orConditions.push({ "services.name": { $regex: "marriage", $options: "i" } });
                orConditions.push({ "services.name": { $regex: "vivah", $options: "i" } });
            }
            if (qLower.includes("kundli") || qLower.includes("astrology") || qLower.includes("astro")) {
                orConditions.push({ "services.name": { $regex: "kundli", $options: "i" } });
                orConditions.push({ "services.name": { $regex: "astrology", $options: "i" } });
            }

            words.forEach(word => {
                if (word.length > 1) {
                    const safeWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const wordRegex = new RegExp(safeWord, "i");
                    orConditions.push(
                        { name: wordRegex },
                        { description: wordRegex },
                        { city: wordRegex },
                        { "services.name": wordRegex },
                        { "services.description": wordRegex }
                    );
                }
            });

            query.$or = orConditions;
        }

        const pandits = await Pandit.find(query).populate("user", "fullName email mobile role");
        return res.status(200).json(pandits);
    } catch (error) {
        console.error("getAllPandits error:", error);
        return res.status(500).json({ message: "Error fetching Pandit Ji list" });
    }
};

export const getPanditById = async (req, res) => {
    try {
        if (!req.params.id || req.params.id === "undefined" || req.params.id === "null" || !mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: "Invalid Pandit Ji ID" });
        }
        const pandit = await Pandit.findById(req.params.id).populate("user", "fullName email mobile");
        if (!pandit) {
            return res.status(404).json({ message: "Pandit Ji profile not found" });
        }
        const reviews = await Review.find({ pandit: pandit._id }).sort({ createdAt: -1 });
        const panditObj = pandit.toObject();
        panditObj.reviews = reviews;
        return res.status(200).json(panditObj);
    } catch (error) {
        console.error("getPanditById error:", error);
        return res.status(500).json({ message: "Error fetching Pandit Ji details: " + error.message });
    }
};

export const getMyPanditProfile = async (req, res) => {
    try {
        const pandit = await Pandit.findOne({ user: req.userId }).populate("user", "fullName email mobile");
        return res.status(200).json(pandit || null);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching profile" });
    }
};

export const createOrUpdateProfile = async (req, res) => {
    try {
        const { name, description, experienceYears, city, state, address, mobile, email } = req.body;
        const user = await User.findById(req.userId);

        if (!user || user.role !== "pandit") {
            return res.status(403).json({ message: "Only registered Pandit Ji accounts can create profile." });
        }

        let pandit = await Pandit.findOne({ user: req.userId });

        let photoUrls = pandit ? pandit.photos || [] : [];
        let profileImageUrl = pandit ? pandit.profileImage || "" : "";

        if (req.file) {
            try {
                const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: "pandit_ji_profile"
                });
                if (uploadResult?.secure_url) {
                    profileImageUrl = uploadResult.secure_url;
                }
            } catch (cloudErr) {
                console.error("Cloudinary profile upload error:", cloudErr.message);
            }
        } else if (req.files && req.files.length > 0) {
            const uploadedUrls = [];
            try {
                for (const file of req.files) {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: "pandit_ji_photos"
                    });
                    if (result && result.secure_url) {
                        uploadedUrls.push(result.secure_url);
                    }
                }
            } catch (cloudErr) {
                console.error("Cloudinary photo upload error:", cloudErr.message);
            }

            if (uploadedUrls.length > 0) {
                profileImageUrl = uploadedUrls[0];
                photoUrls = [...photoUrls, ...uploadedUrls];
            }
        } else if (req.body.profileImage) {
            profileImageUrl = req.body.profileImage;
        }

        if (pandit) {
            pandit.name = name || pandit.name;
            pandit.description = description || pandit.description;
            pandit.experienceYears = experienceYears ? Number(experienceYears) : pandit.experienceYears;
            pandit.city = city || pandit.city;
            pandit.state = state || pandit.state;
            pandit.address = address || pandit.address;
            pandit.mobile = mobile || pandit.mobile;
            pandit.email = email || pandit.email;
            if (profileImageUrl) pandit.profileImage = profileImageUrl;
            pandit.photos = photoUrls;

            await pandit.save();
            let updatedUser = user;
            if (profileImageUrl) {
                updatedUser = await User.findByIdAndUpdate(req.userId, { profileImage: profileImageUrl }, { new: true });
            }
            return res.status(200).json({ message: "Profile updated successfully", pandit, user: updatedUser });
        } else {
            // Default initial Pooja services for new Pandit profile
            const defaultServices = [
                { name: "Satyanarayan Puja", description: "Complete Katha, Hawan & Puja Samagri consultation", price: 1100, duration: "2 Hours" },
                { name: "Griha Pravesh", description: "Auspicious home entry ceremony with Vastu Shanti", price: 2100, duration: "3 Hours" },
                { name: "Ganesh Puja", description: "Removal of obstacles and auspicious beginnings", price: 750, duration: "1 Hour" },
                { name: "Hawan", description: "Sacred fire ritual for purity and prosperity", price: 1500, duration: "2 Hours" },
                { name: "Bhojan Seva", description: "Preparation & blessing for Brahman Bhojan", price: 500, duration: "1 Hour" }
            ];

            pandit = await Pandit.create({
                user: req.userId,
                name: name || user.fullName,
                description: description || "Experienced Pandit Ji offering authentic Vedic rituals and Poojas.",
                experienceYears: experienceYears ? Number(experienceYears) : 5,
                city: city || "Delhi",
                state: state || "Delhi",
                address: address || "Local Address",
                mobile: mobile || user.mobile,
                email: email || user.email,
                profileImage: profileImageUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
                photos: photoUrls.length > 0 ? photoUrls : ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"],
                services: defaultServices
            });

            if (profileImageUrl) {
                await User.findByIdAndUpdate(req.userId, { profileImage: profileImageUrl });
            }
            const updatedUser = await User.findById(req.userId);
            return res.status(201).json({ message: "Pandit Ji profile created successfully", pandit, user: updatedUser });
        }
    } catch (error) {
        console.error("createOrUpdateProfile error:", error);
        return res.status(500).json({ message: "Error saving profile details." });
    }
};

export const addOrUpdateService = async (req, res) => {
    try {
        const { serviceId, name, description, price, duration } = req.body;
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let pandit = await Pandit.findOne({ user: req.userId });

        if (!pandit) {
            pandit = await Pandit.create({
                user: req.userId,
                name: user.fullName,
                description: "Experienced Pandit Ji offering authentic Vedic rituals and Poojas.",
                experienceYears: 5,
                city: user.city || "Delhi",
                state: user.state || "Delhi",
                address: user.address || "Local Address",
                mobile: user.mobile,
                email: user.email,
                profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
                services: []
            });
        }

        let imageUrl = "";
        let uploadedPhotos = [];

        // Check if single image or fields photos uploaded
        if (req.file) {
            try {
                const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: "pandit_ji_services"
                });
                imageUrl = uploadResult?.secure_url || "";
                if (imageUrl) uploadedPhotos.push(imageUrl);
            } catch (cloudErr) {
                console.error("Cloudinary service image upload error:", cloudErr.message);
            }
        } else if (req.files) {
            try {
                const imageFile = req.files.image ? req.files.image[0] : null;
                if (imageFile) {
                    const resImg = await cloudinary.uploader.upload(imageFile.path, { folder: "pandit_ji_services" });
                    imageUrl = resImg?.secure_url || "";
                }
                if (req.files.photos && req.files.photos.length > 0) {
                    for (const f of req.files.photos) {
                        const resPhoto = await cloudinary.uploader.upload(f.path, { folder: "pandit_ji_services" });
                        if (resPhoto?.secure_url) uploadedPhotos.push(resPhoto.secure_url);
                    }
                }
            } catch (cloudErr) {
                console.error("Cloudinary photos upload error:", cloudErr.message);
            }
        }

        if (serviceId) {
            const service = pandit.services.id(serviceId);
            if (service) {
                service.name = name || service.name;
                service.description = description !== undefined ? description : service.description;
                service.price = price !== undefined ? Number(price) : service.price;
                service.duration = duration || service.duration;
                if (imageUrl) service.image = imageUrl;
                if (uploadedPhotos.length > 0) {
                    if (!service.photos) service.photos = [];
                    uploadedPhotos.forEach(p => {
                        if (!service.photos.includes(p)) service.photos.push(p);
                    });
                }
            }
        } else {
            const newService = {
                name,
                description: description || "",
                price: Number(price),
                duration: duration || "1-2 Hours",
                image: imageUrl || (uploadedPhotos.length > 0 ? uploadedPhotos[0] : ""),
                photos: uploadedPhotos
            };
            pandit.services.push(newService);
        }

        await pandit.save();
        return res.status(200).json({ message: "Service saved successfully", pandit });
    } catch (error) {
        console.error("addOrUpdateService error:", error);
        return res.status(500).json({ message: "Error saving service: " + error.message });
    }
};

export const deleteService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const pandit = await Pandit.findOne({ user: req.userId });

        if (!pandit) {
            return res.status(404).json({ message: "Pandit profile not found" });
        }

        pandit.services = pandit.services.filter(s => s._id.toString() !== serviceId);
        await pandit.save();
        return res.status(200).json({ message: "Service deleted successfully", pandit });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting service" });
    }
};

export const toggleOnline = async (req, res) => {
    try {
        const { isOnline } = req.body;
        const pandit = await Pandit.findOne({ user: req.userId });

        if (!pandit) {
            return res.status(404).json({ message: "Pandit Ji profile not found" });
        }

        pandit.isOnline = Boolean(isOnline);
        pandit.availability = Boolean(isOnline);
        pandit.lastSeen = new Date();
        await pandit.save();

        return res.status(200).json({
            message: `Online availability updated to ${pandit.isOnline ? "Online" : "Offline"}`,
            pandit
        });
    } catch (error) {
        return res.status(500).json({ message: "Error toggling online status" });
    }
};

export const updateProfilePhoto = async (req, res) => {
    try {
        const pandit = await Pandit.findOne({ user: req.userId });
        if (!pandit) {
            return res.status(404).json({ message: "Pandit Ji profile not found." });
        }

        let photoUrl = "";
        let newPublicId = "";
        const oldImageUrl = pandit.profileImage;

        if (req.file) {
            try {
                console.log(`[UPLOAD] Processing profile photo for user ${req.userId}: name=${req.file.originalname}, mimetype=${req.file.mimetype}, size=${req.file.size} bytes`);
                
                // 1. Upload NEW image FIRST
                const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: "pandit_ji_profile"
                });

                if (!uploadResult || !uploadResult.secure_url) {
                    throw new Error("Cloudinary did not return a valid secure_url.");
                }

                photoUrl = uploadResult.secure_url;
                newPublicId = uploadResult.public_id;
                console.log(`[UPLOAD SUCCESS] New Cloudinary image URL: ${photoUrl} (public_id: ${newPublicId})`);

                // 2. Delete OLD image ONLY AFTER new upload succeeds
                if (oldImageUrl && oldImageUrl !== photoUrl) {
                    deleteCloudinaryImage(oldImageUrl).catch(err => {
                        console.warn("[CLOUDINARY CLEANUP WARN] Failed to delete old image:", err.message);
                    });
                }
            } catch (cloudErr) {
                console.error("[CLOUDINARY ERROR] Profile upload failed:", cloudErr);
                return res.status(500).json({
                    message: `Cloudinary Upload Failed: ${cloudErr.message || "Failed to upload image to Cloudinary."}`
                });
            } finally {
                // Clean up local temp file created by Multer
                if (req.file && req.file.path && fs.existsSync(req.file.path)) {
                    try {
                        fs.unlinkSync(req.file.path);
                    } catch (unlinkErr) {
                        console.warn("[MULTER TEMP CLEANUP WARN]", unlinkErr.message);
                    }
                }
            }
        } else if (req.body.profileImage) {
            photoUrl = req.body.profileImage;
            if (oldImageUrl && oldImageUrl !== photoUrl) {
                deleteCloudinaryImage(oldImageUrl).catch(err => console.warn(err.message));
            }
        }

        if (!photoUrl) {
            return res.status(400).json({ message: "No profile image file was provided in the request." });
        }

        // 3. Update MongoDB documents (Pandit & User)
        pandit.profileImage = photoUrl;
        await pandit.save();

        const updatedUser = await User.findByIdAndUpdate(req.userId, { profileImage: photoUrl }, { new: true });

        console.log(`[DB SUCCESS] Synced profileImage for Pandit ${pandit._id} and User ${req.userId}`);

        return res.status(200).json({
            message: "Profile photo updated successfully!",
            pandit,
            user: updatedUser,
            profileImage: photoUrl,
            publicId: newPublicId
        });
    } catch (error) {
        console.error("[PROFILE PHOTO CONTROLLER ERROR]:", error);
        return res.status(500).json({
            message: `Profile Photo Update Error: ${error.message || "Internal server error"}`
        });
    }
};

export const addServicePhotos = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const pandit = await Pandit.findOne({ user: req.userId });
        if (!pandit) {
            return res.status(404).json({ message: "Pandit Ji profile not found" });
        }

        const service = pandit.services.id(serviceId);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        const uploadedUrls = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "pandit_ji_services"
                });
                if (result && result.secure_url) {
                    uploadedUrls.push(result.secure_url);
                }
            }
        } else if (req.body.photos && Array.isArray(req.body.photos)) {
            uploadedUrls.push(...req.body.photos);
        } else if (req.body.photo) {
            uploadedUrls.push(req.body.photo);
        }

        if (uploadedUrls.length === 0) {
            return res.status(400).json({ message: "No photo files uploaded." });
        }

        if (!service.photos) service.photos = [];
        // Prevent duplicate photo URLs
        uploadedUrls.forEach(url => {
            if (!service.photos.includes(url)) {
                service.photos.push(url);
            }
        });

        if (!service.image && service.photos.length > 0) {
            service.image = service.photos[0];
        }

        await pandit.save();
        return res.status(200).json({ message: "Service photos added successfully", pandit });
    } catch (error) {
        console.error("addServicePhotos error:", error);
        return res.status(500).json({ message: "Error adding service photos." });
    }
};

export const deleteServicePhoto = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { photoUrl } = req.body;

        const pandit = await Pandit.findOne({ user: req.userId });
        if (!pandit) {
            return res.status(404).json({ message: "Pandit Ji profile not found" });
        }

        const service = pandit.services.id(serviceId);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        if (service.photos) {
            service.photos = service.photos.filter(p => p !== photoUrl);
        }

        if (service.image === photoUrl) {
            service.image = service.photos && service.photos.length > 0 ? service.photos[0] : "";
        }

        await pandit.save();
        return res.status(200).json({ message: "Service photo removed successfully", pandit });
    } catch (error) {
        console.error("deleteServicePhoto error:", error);
        return res.status(500).json({ message: "Error deleting service photo." });
    }
};

export const updateBackgroundPhoto = async (req, res) => {
    try {
        const pandit = await Pandit.findOne({ user: req.userId });
        if (!pandit) {
            return res.status(404).json({ message: "Pandit Ji profile not found" });
        }

        let bgUrl = "";
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "pandit_ji_backgrounds"
            });
            if (result && result.secure_url) {
                bgUrl = result.secure_url;
            }
        } else if (req.body.backgroundImage) {
            bgUrl = req.body.backgroundImage;
        }

        if (!bgUrl) {
            return res.status(400).json({ message: "No background image provided." });
        }

        // Clean up old background if hosted on Cloudinary
        if (pandit.backgroundImage && pandit.backgroundImage.includes("cloudinary.com")) {
            await deleteCloudinaryImage(pandit.backgroundImage);
        }

        pandit.backgroundImage = bgUrl;
        await pandit.save();

        return res.status(200).json({
            message: "Profile background image updated successfully!",
            pandit,
            backgroundImage: bgUrl
        });
    } catch (error) {
        console.error("updateBackgroundPhoto error:", error);
        return res.status(500).json({ message: `Background photo update error: ${error.message}` });
    }
};


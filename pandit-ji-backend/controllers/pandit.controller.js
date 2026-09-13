import Pandit from "../models/pandit.model.js";
import User from "../models/user.models.js";
import cloudinary from "../config/cloudinary.js";

export const getAllPandits = async (req, res) => {
    try {
        const { city, search } = req.query;
        let query = {};

        if (city && city.trim()) {
            query.city = { $regex: city.trim(), $options: "i" };
        }

        if (search && search.trim()) {
            query.$or = [
                { name: { $regex: search.trim(), $options: "i" } },
                { description: { $regex: search.trim(), $options: "i" } },
                { "services.name": { $regex: search.trim(), $options: "i" } }
            ];
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
        const pandit = await Pandit.findById(req.params.id).populate("user", "fullName email mobile");
        if (!pandit) {
            return res.status(404).json({ message: "Pandit Ji profile not found" });
        }
        return res.status(200).json(pandit);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching Pandit Ji details" });
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

        if (req.files && req.files.length > 0) {
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
            return res.status(200).json({ message: "Profile updated successfully", pandit });
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

            return res.status(201).json({ message: "Pandit Ji profile created successfully", pandit });
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
            // Auto-create Pandit profile document if missing
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
                photos: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"],
                services: []
            });
        }

        let imageUrl = "";
        if (req.file) {
            try {
                const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: "pandit_ji_services"
                });
                imageUrl = uploadResult?.secure_url || "";
            } catch (cloudErr) {
                console.error("Cloudinary service image upload error:", cloudErr.message);
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
            }
        } else {
            pandit.services.push({
                name,
                description: description || "",
                price: Number(price),
                duration: duration || "1-2 Hours",
                image: imageUrl
            });
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
            return res.status(404).json({ message: "Pandit Ji profile not found" });
        }

        let photoUrl = "";
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: "pandit_ji_profile"
            });
            photoUrl = uploadResult.secure_url;
        } else if (req.body.profileImage) {
            photoUrl = req.body.profileImage;
        }

        if (!photoUrl) {
            return res.status(400).json({ message: "No profile image provided." });
        }

        pandit.profileImage = photoUrl;
        if (!pandit.photos.includes(photoUrl)) {
            pandit.photos.unshift(photoUrl);
        }
        await pandit.save();

        // Also update User profile if applicable
        await User.findByIdAndUpdate(req.userId, { profileImage: photoUrl });

        return res.status(200).json({ message: "Profile photo updated successfully", pandit });
    } catch (error) {
        console.error("updateProfilePhoto error:", error);
        return res.status(500).json({ message: "Error updating profile photo: " + error.message });
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


import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/user.models.js";
import Pandit from "./models/pandit.model.js";
import connectDb from "./config/db.js";

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/panditji";

const seedData = [
    {
        name: "Pandit Ramesh Sharma",
        email: "pandit.ramesh@panditji.com",
        mobile: "9826011111",
        experienceYears: 15,
        rating: { average: 4.9, count: 142 },
        city: "Indore",
        state: "Madhya Pradesh",
        address: "Vijay Nagar, Indore, M.P.",
        isOnline: true,
        availability: true,
        profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
        photos: [
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600",
            "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600"
        ],
        description: "Vedic Scholar from Ujjain Gurukul with 15+ years experience in Ganesh Puja, Satyanarayan Katha, and Vastu Shanti rituals.",
        services: [
            {
                name: "Ganesh Puja",
                description: "Complete Siddhi Vinayak Pooja for obstacle removal, peace, and new beginnings.",
                price: 999,
                duration: "1 Hour",
                image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400"
            },
            {
                name: "Satyanarayan Katha",
                description: "Sacred Katha recital with Hawan, Prasadam blessing, and full Samagri guidance.",
                price: 1499,
                duration: "2 Hours",
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"
            },
            {
                name: "Griha Pravesh",
                description: "Auspicious home entry ceremony with Vastu Shanti, Navgrah Pujan, and Hawan.",
                price: 2499,
                duration: "3 Hours",
                image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400"
            }
        ]
    },
    {
        name: "Pandit Suresh Shastri",
        email: "pandit.suresh@panditji.com",
        mobile: "9826022222",
        experienceYears: 12,
        rating: { average: 4.8, count: 98 },
        city: "Indore",
        state: "Madhya Pradesh",
        address: "Palasia, Indore, M.P.",
        isOnline: true,
        availability: true,
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        photos: [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600"
        ],
        description: "Specialist in Maha Mrityunjaya Jaap, Laxmi Kubera Puja, and Shanti Hawan rituals.",
        services: [
            {
                name: "Maha Mrityunjaya Havan",
                description: "Sacred Vedic fire ritual for health, longevity, and healing energy.",
                price: 2100,
                duration: "2.5 Hours",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
            },
            {
                name: "Laxmi Kuber Puja",
                description: "Auspicious wealth and prosperity Pooja for homes & offices.",
                price: 1100,
                duration: "1.5 Hours",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
            }
        ]
    },
    {
        name: "Pandit Anand Joshi",
        email: "pandit.anand@panditji.com",
        mobile: "9826033333",
        experienceYears: 8,
        rating: { average: 4.7, count: 76 },
        city: "Indore",
        state: "Madhya Pradesh",
        address: "Bhawarkua, Indore, M.P.",
        isOnline: false, // OFFLINE FOR TESTING AVAILABILITY
        availability: false,
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        photos: [
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600"
        ],
        description: "Expert Shiv Bhakt specializing in Rudrabhishek, Kaal Sarp Dosh, and Navgrah Shanti.",
        services: [
            {
                name: "Rudrabhishek",
                description: "Lord Shiva Abhishekam with Panchamrit and sacred Vedic chanting.",
                price: 1800,
                duration: "2 Hours",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
            },
            {
                name: "Navgrah Shanti",
                description: "Nine planets ritual to remove planetary obstacles and malefic effects.",
                price: 1500,
                duration: "2 Hours",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
            }
        ]
    },
    {
        name: "Pandit Videsh Tripathi",
        email: "pandit.videsh@panditji.com",
        mobile: "9826044444",
        experienceYears: 20,
        rating: { average: 4.9, count: 210 },
        city: "Indore",
        state: "Madhya Pradesh",
        address: "Annapurna, Indore, M.P.",
        isOnline: true,
        availability: true,
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        photos: [
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600"
        ],
        description: "Senior Acharya specializing in Vastu Shanti, Vivah Sanskar, and Grand Family Yagnas.",
        services: [
            {
                name: "Vastu Shanti",
                description: "Complete home and land Vastu purification and energy alignment.",
                price: 3100,
                duration: "3 Hours",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
            },
            {
                name: "Vivah Sanskar",
                description: "Authentic Vedic wedding ceremony with Saptapadi and Kanyadaan rituals.",
                price: 5100,
                duration: "4 Hours",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
            }
        ]
    },
    {
        name: "Pandit Dharmendra Upadhyay",
        email: "pandit.dharmendra@panditji.com",
        mobile: "9826055555",
        experienceYears: 10,
        rating: { average: 4.8, count: 85 },
        city: "Indore",
        state: "Madhya Pradesh",
        address: "Saket Nagar, Indore, M.P.",
        isOnline: false, // OFFLINE FOR TESTING AVAILABILITY
        availability: false,
        profileImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
        photos: [
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600"
        ],
        description: "Specialist in Hanuman Chalisa / Sundarkand Path and Pitru Dosh Shanti.",
        services: [
            {
                name: "Sundarkand Path",
                description: "Melodious recital of Shri Ramcharitmanas Sundarkand for courage and success.",
                price: 1200,
                duration: "2 Hours",
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400"
            },
            {
                name: "Pitru Dosh Nivaran",
                description: "Ancestral blessings ceremony and Tarpan ritual.",
                price: 2500,
                duration: "2.5 Hours",
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400"
            }
        ]
    }
];

const seedDatabase = async () => {
    try {
        await connectDb();

        const defaultPasswordHash = await bcrypt.hash("pandit123", 10);

        for (const data of seedData) {
            let user = await User.findOne({ email: data.email });

            if (!user) {
                user = await User.create({
                    fullName: data.name,
                    email: data.email,
                    password: defaultPasswordHash,
                    mobile: data.mobile,
                    role: "pandit"
                });
                console.log(`[SEED] Created User account: ${user.fullName} (${user._id})`);
            } else {
                user.role = "pandit";
                await user.save();
                console.log(`[SEED] Updated User role to pandit: ${user.fullName}`);
            }

            let pandit = await Pandit.findOne({ user: user._id });

            if (!pandit) {
                pandit = await Pandit.create({
                    user: user._id,
                    name: data.name,
                    description: data.description,
                    experienceYears: data.experienceYears,
                    city: data.city,
                    state: data.state,
                    address: data.address,
                    profileImage: data.profileImage,
                    photos: data.photos,
                    services: data.services,
                    availability: data.availability,
                    isOnline: data.isOnline,
                    rating: data.rating,
                    mobile: data.mobile,
                    email: data.email
                });
                console.log(`[SEED] Created Pandit profile: ${pandit.name} (isOnline: ${pandit.isOnline})`);
            } else {
                pandit.name = data.name;
                pandit.description = data.description;
                pandit.experienceYears = data.experienceYears;
                pandit.city = data.city;
                pandit.state = data.state;
                pandit.address = data.address;
                pandit.profileImage = data.profileImage;
                pandit.photos = data.photos;
                pandit.services = data.services;
                pandit.availability = data.availability;
                pandit.isOnline = data.isOnline;
                pandit.rating = data.rating;
                pandit.mobile = data.mobile;
                pandit.email = data.email;
                await pandit.save();
                console.log(`[SEED] Updated Pandit profile: ${pandit.name} (isOnline: ${pandit.isOnline})`);
            }
        }

        console.log("[SEED SUCCESS] Seeded 5 Pandits successfully (3 Online, 2 Offline).");
        process.exit(0);
    } catch (err) {
        console.error("[SEED ERROR] Failed to seed database:", err);
        process.exit(1);
    }
};

seedDatabase();

import mongoose from "mongoose";
import dns from "dns";

if (process.env.DNS_SERVER) {
    dns.setServers([process.env.DNS_SERVER]);
} else {
    dns.setServers(["8.8.8.8"]);
}

const connectDb = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/panditji";
        try {
            const conn = await mongoose.connect(mongoUri);
            console.log(`[DB SUCCESS] Connected to MongoDB - Host: ${conn.connection.host}, Database: ${conn.connection.name}`);
            return conn;
        } catch (primaryErr) {
            console.warn(`[DB WARN] Primary MongoDB connection failed (${primaryErr.message}). Attempting local fallback...`);
            const conn = await mongoose.connect("mongodb://127.0.0.1:27017/panditji");
            console.log(`[DB SUCCESS] Connected to Local MongoDB - Host: ${conn.connection.host}, Database: ${conn.connection.name}`);
            return conn;
        }
    } catch (error) {
        console.error(`[DB ERROR] MongoDB Connection Error: ${error.message}`);
        throw error;
    }
};

export default connectDb;

import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URL;
        
        if (!mongoUri) {
            console.warn("[DB WARN] No MONGO_URI provided in environment variables. Trying local MongoDB...");
            const conn = await mongoose.connect("mongodb://127.0.0.1:27017/panditji");
            console.log(`[DB SUCCESS] Connected to Local MongoDB - Host: ${conn.connection.host}`);
            return conn;
        }

        console.log("[DB] Connecting to MongoDB Atlas...");
        const conn = await mongoose.connect(mongoUri);
        console.log(`[DB SUCCESS] Connected to MongoDB - Host: ${conn.connection.host}, Database: ${conn.connection.name}`);
        return conn;
    } catch (error) {
        console.error(`[DB ERROR] MongoDB Connection Error: ${error.message}`);
        throw error;
    }
};

export default connectDb;

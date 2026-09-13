import mongoose from "mongoose";

const connectDb = async () => {
    try {
        let rawUri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGODB_URL || process.env.MONGO_URL || "";
        
        // Strip leading "MONGODB_URI=" or "MONGO_URI=" if user pasted key name inside value box on Render
        rawUri = rawUri.replace(/^(MONGODB_URI|MONGO_URI|MONGODB_URL|MONGO_URL)\s*=\s*/i, '');

        // Sanitize string: trim spaces, remove quotes if user pasted quotes on Render
        let mongoUri = rawUri.trim().replace(/^["']|["']$/g, '').trim();

        if (!mongoUri) {
            console.warn("[DB WARN] No MONGO_URI/MONGODB_URI provided in environment variables. Trying local MongoDB...");
            const conn = await mongoose.connect("mongodb://127.0.0.1:27017/panditji");
            console.log(`[DB SUCCESS] Connected to Local MongoDB - Host: ${conn.connection.host}`);
            return conn;
        }

        // Auto-fix missing protocol if user pasted "username:password@cluster..."
        if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
            console.warn("[DB WARN] Auto-prepending 'mongodb+srv://' to MONGO_URI...");
            mongoUri = "mongodb+srv://" + mongoUri;
        }

        console.log(`[DB] Connecting to MongoDB Atlas... (${mongoUri.substring(0, 35)}...)`);
        const conn = await mongoose.connect(mongoUri, { dbName: "panditji" });
        console.log(`[DB SUCCESS] Connected to MongoDB - Host: ${conn.connection.host}, Database: ${conn.connection.name}`);
        return conn;
    } catch (error) {
        console.error(`[DB ERROR] MongoDB Connection Error: ${error.message}`);
        throw error;
    }
};

export default connectDb;

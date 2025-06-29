import Mongoose from "mongoose";

class Database {
    public static async Connect(): Promise<void> {
        const {
            DATABASE_CONNECTION_STRING,
            DATABASE_NAME,
        } = process.env;

        const uri = DATABASE_CONNECTION_STRING || "mongodb://localhost:27017/default";

        await Mongoose.connect(uri);
        console.log("Connected to database successfully");
    }
    public static async Disconnect(): Promise<void> {
        await Mongoose.disconnect();
    }
}

export default Database;
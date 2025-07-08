import mongoose, { Error } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDb = async () => {
    const url = process.env.MONGO_URI;
    if (!url)
        throw new Error("MONGO URI IS NOT GIVEN");
    try {
        await mongoose.connect(url, { dbName: "Chattingapp" });
        console.log("DATABASE CONNECTED!!");
    }
    catch (error) {
        console.error("failed to connect to MONGODB", error);
        process.exit(1);
    }
};
export default connectDb;

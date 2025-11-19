import mongoose from "mongoose";
import config from "../config/config.js";


async function connectDB() {
    try {
        
        await mongoose.connect(config.MONGO_URI);
        console.log("connected to mongoDB");

    } catch (error) {
        console.log("failed to connect MongoDB: ", error);
    }
}

export default connectDB;
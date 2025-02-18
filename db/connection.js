import mongoose from 'mongoose';
import { MONGO_URI } from '../config/env.js';
export const connectDB = async () => {
    try {
        const db = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB connected: ${db.connection.host}`);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};

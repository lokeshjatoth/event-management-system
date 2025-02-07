import mongoose from "mongoose";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL;
        console.log('Attempting to connect to MongoDB...');
        
        if (!mongoUrl) {
            throw new Error('MONGODB_URL is not defined in environment variables');
        }

        const conn = await mongoose.connect(mongoUrl);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
}
import mongoose from 'mongoose';

const connectDB = async (url) => {
    try {
        await mongoose.connect(url);
    } catch (error) {
        console.error('MongoDB connection failed:', error);
    }
}

export default connectDB;
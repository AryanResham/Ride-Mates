import mongoose from 'mongoose';

const connectDB = async (url) => {
    try {
        await mongoose.connect(url);
        console.log('MongoDB connected successfully to port 27017');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
    }
}

export default connectDB;
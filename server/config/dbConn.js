import mongoose from 'mongoose';

const connectDB = async (url) => {
    try {
        if (!url) {
            throw new Error('Database URL is undefined. Please check your .env file.');
        }
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(url);
        console.log('MongoDB connection established successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

export default connectDB;
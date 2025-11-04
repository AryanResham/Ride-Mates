import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import connectDB from './config/dbConn.js';
import corsOptions from './config/corsOptions.js';
import registerRouter from './routes/register.js';
import authRouter from './routes/auth.js';
import logoutRouter from './routes/logout.js';
import driverRidesRouter from './routes/api/driverRides.js';
import riderRidesRouter from './routes/api/riderRides.js';
import riderRequestsRouter from './routes/api/riderRequests.js';
import driverRequestRouter from './routes/api/driverRequest.js';
import driverBookingsRouter from './routes/api/driverBookings.js';
import userRouter from './routes/api/user.js';
import bookingsRouter from './routes/api/bookings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3500;

// Debug: Check if environment variables are loaded
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('DATABASE_URI:', process.env.DATABASE_URI ? 'Found' : 'Not found');
console.log('NODE_ENV:', process.env.NODE_ENV);

connectDB(process.env.DATABASE_URI);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('Welcome to the Ride Mates API!');
});
app.use('/register', registerRouter);
app.use('/auth', authRouter);
app.use('/logout', logoutRouter);
app.use('/api/driver/rides', driverRidesRouter);
app.use('/api/rider/rides', riderRidesRouter);
app.use('/api/rider/requests', riderRequestsRouter);
app.use('/api/driver/requests', driverRequestRouter);
app.use('/api/driver/bookings', driverBookingsRouter);
app.use('/api/user', userRouter);
app.use('/api/bookings', bookingsRouter);

// RUN
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
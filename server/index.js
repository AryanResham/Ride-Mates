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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ridemates';

connectDB(MONGO_URI);

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

// RUN
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
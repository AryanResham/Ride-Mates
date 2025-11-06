import express from 'express';
import { createBooking, getPassengerBookings, cancelBooking, rateDriver } from '../../controllers/api/bookingController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

// All routes in this file should be protected
router.use(authMiddleware);

// Create a new booking
router.post('/', createBooking);

// Get all bookings for the logged-in passenger
router.get('/', getPassengerBookings);

// Cancel a booking
router.delete('/:id', cancelBooking);

// Rate a driver for a booking
router.post('/:bookingId/rate', rateDriver);

export default router;
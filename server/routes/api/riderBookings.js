import express from 'express';
import { createBooking, getPassengerBookings, getBookingById, cancelBooking } from '../../controllers/api/riderBookingsController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

// All routes in this file should be protected
router.use(authMiddleware);

// Create a new instant booking
router.post('/', createBooking);

// Get all bookings for the logged-in passenger
router.get('/', getPassengerBookings);

// Get a single booking by ID
router.get('/:id', getBookingById);

// Cancel a booking
router.delete('/:id', cancelBooking);

export default router;
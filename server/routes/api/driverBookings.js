import express from 'express';
import { 
    getDriverBookings, 
    acceptBooking, 
    rejectBooking, 
    getDriverBookingById 
} from '../../controllers/api/driverBookingsController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

// All routes in this file should be protected
router.use(authMiddleware);

// Get all bookings for the logged-in driver
router.get('/', getDriverBookings);

// Get a single booking by ID
router.get('/:id', getDriverBookingById);

// Accept a booking
router.put('/:id/accept', acceptBooking);

// Reject a booking
router.put('/:id/reject', rejectBooking);

export default router;
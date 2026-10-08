import express from 'express';
import { rateDriver } from '../../controllers/api/bookingController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

// Ratings only. Creating/listing/cancelling bookings lives in riderBookings.js.
router.use(authMiddleware);

// Rate a driver for a booking
router.post('/:bookingId/rate', rateDriver);

export default router;
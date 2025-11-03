import express from 'express';
import { createRide, getDriverRides, getRideById } from '../../controllers/api/driverRidesController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

// All routes in this file should be protected
router.use(authMiddleware);

// Create a new ride
router.post('/', createRide);

// Get all rides for the logged-in driver
router.get('/', getDriverRides);

// Get a single ride by ID
router.get('/:id', getRideById);

export default router;

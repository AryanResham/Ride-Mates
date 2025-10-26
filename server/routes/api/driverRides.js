import express from 'express';
import { createRide, getDriverRides, getRideById } from '../../controllers/api/driverRidesController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

// Create a new ride
router.post('/', upload.none(), createRide);

// Get all rides for the logged-in driver
router.get('/', getDriverRides);

// Get a specific ride by ID
router.get('/:id', getRideById);

export default router;

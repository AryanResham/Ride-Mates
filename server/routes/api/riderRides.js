import express from 'express';
import { searchRides, getRides } from '../../controllers/api/riderRidesControllers.js';

const router = express.Router();

router.get('/', getRides);
router.get('/search', searchRides);

export default router;
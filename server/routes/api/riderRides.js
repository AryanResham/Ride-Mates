import express from 'express';
import { getRides, searchRides } from '../../controllers/api/riderRidesControllers.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getRides);
router.post('/search', searchRides);

export default router;
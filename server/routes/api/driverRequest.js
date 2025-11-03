import express from 'express';
import { getDriverRequests, acceptRequest, declineRequest, markRequestAsViewed } from '../../controllers/api/driverRequestController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getDriverRequests);
router.put('/:id/accept', acceptRequest);
router.put('/:id/decline', declineRequest);
router.put('/:id/view', markRequestAsViewed);

export default router;


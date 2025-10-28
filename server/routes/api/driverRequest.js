import express from 'express';
import { getDriverRequests, acceptRequest, declineRequest, markRequestAsViewed } from '../../controllers/api/driverRequestController.js';

const router = express.Router();

router.get('/', getDriverRequests);
router.put('/:id/accept', acceptRequest);
router.put('/:id/decline', declineRequest);
router.put('/:id/view', markRequestAsViewed);

export default router;


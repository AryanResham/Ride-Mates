import express from 'express';
import { createRequest, getPassengerRequests, getRequestById, cancelRequest } from '../../controllers/api/riderRequestsController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createRequest);
router.get('/', getPassengerRequests);
router.get('/:id', getRequestById);
router.delete('/:id', cancelRequest);

export default router;
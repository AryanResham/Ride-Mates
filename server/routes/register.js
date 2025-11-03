import express from 'express';
import handleNewUser from '../controllers/registerController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, handleNewUser);

export default router;
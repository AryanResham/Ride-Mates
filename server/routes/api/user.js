import express from 'express';
import { getMe } from '../../controllers/userController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/user/me
// @desc    Get current user's profile from our database
// @access  Private
router.get('/me', authMiddleware, getMe);

export default router;

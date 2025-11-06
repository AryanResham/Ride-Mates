import express from 'express';
import { getMe, updateMe } from '../../controllers/userController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/user/me
// @desc    Get current user's profile from our database
// @access  Private
router.get('/me', authMiddleware, getMe);

// @route   PUT /api/user/me
// @desc    Update current user's profile
// @access  Private
router.put('/me', authMiddleware, updateMe);

export default router;

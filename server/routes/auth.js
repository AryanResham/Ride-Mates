import express from 'express';
import { requireLiveDb } from '../middleware/selectDb.js';

const router = express.Router();
import handleLogin from '../controllers/authController.js';

router.post('/', requireLiveDb, handleLogin);

export default router;
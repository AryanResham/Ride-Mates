import express from 'express';
import handleNewUser from '../controllers/registerController.js';

import { requireLiveDb } from '../middleware/selectDb.js';

const router = express.Router();

router.post('/', requireLiveDb, handleNewUser);

export default router;
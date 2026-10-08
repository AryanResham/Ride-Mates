import express from 'express';
import { getDemoProfiles, demoLogin, resetDemo } from '../../controllers/demoController.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import { useDemoDb } from '../../middleware/selectDb.js';

const router = express.Router();

router.use(useDemoDb);

router.get('/profiles', getDemoProfiles);
router.post('/login', demoLogin);
router.post('/reset', authMiddleware, resetDemo);

export default router;

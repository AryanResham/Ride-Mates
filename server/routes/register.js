import express from 'express';
import handleNewUser from '../controllers/registerController.js';
import multer from 'multer';

const router = express.Router();

const upload = multer(); // Parses multipart/form-data into req.body (no file storage)

router.post(
    '/', upload.none(), handleNewUser
)

export default router;
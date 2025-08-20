import express from 'express';
import { webhooksController } from '../controllers/webhooks.controller.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post('/jotform', upload.none(), webhooksController.jotformWebhook);

export default router;
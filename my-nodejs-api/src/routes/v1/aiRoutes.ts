// src/routes/v1/aiRoutes.ts
import express from 'express';
import aiController from '../../controllers/v1/aiController';
import authenticateToken from '../../middlewares/authMiddleware';

const router = express.Router();

router.post('/run-prompt', authenticateToken, (req, res, next) => aiController.runPrompt(req, res, next));

export default router;

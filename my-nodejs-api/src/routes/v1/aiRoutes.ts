import express from 'express';
import aiController from '../../controllers/v1/aiController';
import authenticateToken from '../../middlewares/authMiddleware';

const router = express.Router();

router.post('/run-prompt', authenticateToken, aiController.runPrompt); 

export default router;

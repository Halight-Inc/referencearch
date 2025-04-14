import express from 'express';
import scenarioController from '../../controllers/v1/scenarioController';
import authenticateToken from '../../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, scenarioController.createScenario);
router.get('/', authenticateToken, scenarioController.getAllScenarios);
router.get('/:scenarioId', authenticateToken, scenarioController.getScenario);

export default router;

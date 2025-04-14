import express from 'express';
import scenarioController from '../../controllers/v1/scenarioController';
import authenticateToken from '../../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, scenarioController.getAllScenarios);
router.post('/', authenticateToken, scenarioController.createScenario);

export default router;

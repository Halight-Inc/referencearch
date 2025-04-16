import express from 'express';
import simulationController from '../../controllers/v1/simulationController';
import authenticateToken from '../../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, simulationController.createSimulation);
router.get('/', authenticateToken, simulationController.getAllSimulation);
router.get('/:simulationId', authenticateToken, simulationController.getSimulation);

export default router;

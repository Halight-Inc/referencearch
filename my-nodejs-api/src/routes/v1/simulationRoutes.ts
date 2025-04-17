import express from 'express';
import simulationController from '../../controllers/v1/simulationController';
import authenticateToken from '../../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authenticateToken, simulationController.createSimulation);
router.get('/', authenticateToken, simulationController.getAllSimulation);
router.get('/:simulationId', authenticateToken, simulationController.getSimulation);

// Add the new PATCH route for updates
router.patch('/:simulationId', authenticateToken, simulationController.updateSimulation);
// You could use PUT instead if you expect the client to send the *entire* resource representation
// router.put('/:simulationId', authenticateToken, simulationController.updateSimulation);

export default router;

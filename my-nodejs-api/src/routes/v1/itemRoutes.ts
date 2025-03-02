import express from 'express';
import itemController from '../../controllers/v1/itemController';
import authenticateToken from '../../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, itemController.getAllItems);
router.post('/', authenticateToken, itemController.createItem);

export default router;

import express from 'express';
import userController from '../../controllers/v1/userController';
import authenticateToken from '../../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, userController.getAllUsers);

export default router;

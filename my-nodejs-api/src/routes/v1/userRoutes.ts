import express from 'express';
import userController from '../../controllers/v1/userController';

const router = express.Router();

router.get('/', userController.getAllUsers);

export default router;

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config/config';
import userController from './userController';

/**
 * @swagger
 * /v1/auth/login:
 *   post:
 *     summary: Authenticate a user
 *     description: Authenticate a user and generate a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token.
 *       401:
 *         description: Unauthorized (Invalid credentials)
 *       500:
 *         description: Internal server error
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Find the user by email
        const user = await userController.getUserByEmail(email);

        //If no user is found, return an error.
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Create and sign a JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        next(error);
    }
};

export default {
    login,
};

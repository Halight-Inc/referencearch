import { Request, Response, NextFunction } from 'express';
import db from '../../database';
import { User } from '../../database/models/user';

/**
 * @swagger
 * /v1/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users from the database (version 1).
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The user's ID.
 *                   name:
 *                     type: string
 *                     description: The user's name.
 *                   email:
 *                     type: string
 *                     description: The user's email.
 *       500:
 *         description: Internal server error
 */
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await db.User.findAll();
        res.json(users);
    } catch (error) {
        next(error);
    }
};
const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const user = await db.User.findOne({ where: { email } });
        return user;
    } catch (error) {
        console.error('Error fetching user by email:', error);
        throw error;
    }
};
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default {
    getAllUsers,
    getUserByEmail,
};

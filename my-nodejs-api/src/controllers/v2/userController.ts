import { Request, Response, NextFunction } from 'express';
import db from '../../database';

/**
 * @swagger
 * /v2/users:
 *   get:
 *     summary: Get all users (version 2)
 *     description: Retrieve a list of all users from the database (version 2).
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
 *       500:
 *         description: Internal server error
 */
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await db.User.findAll({ attributes: ['id', 'name'] });
    res.json(users);
  } catch (error) {
    next(error);
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
};

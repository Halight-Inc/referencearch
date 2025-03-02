import { Request, Response, NextFunction } from 'express';
import db from '../../database';

/**
 * @swagger
 * /v1/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users from the database (version 1).
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

export default {
  getAllUsers,
};

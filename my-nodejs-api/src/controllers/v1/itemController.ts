import { Request, Response, NextFunction } from 'express';
import db from '../../database';

/**
 * @swagger
 * /v1/items:
 *   get:
 *     summary: Get all items
 *     description: Retrieve a list of all items from the database.
 *     tags: [Content]
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
 *                 $ref: '#/components/schemas/Item'
 *       500:
 *         description: Internal server error
 */
const getAllItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await db.Item.findAll();
        res.json(items);
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /v1/items:
 *   post:
 *     summary: Create an item
 *     description: Create a new item in the database.
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: Item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Bad request (invalid item data)
 *       500:
 *         description: Internal server error
 */
const createItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ error: 'Name and description are required.' });
        }

        const newItem = await db.Item.create({ name, description });
        res.status(201).json(newItem);
    } catch (error) {
        next(error);
    }
};

export default {
    getAllItems,
    createItem,
};

import { IndexController } from '../controllers/index';
import { Express } from 'express';

export const setRoutes = (app: Express) => {
    const indexController = new IndexController();

    /**
     * @swagger
     * /:
     *   get:
     *     summary: Retrieve a list of items
     *     responses:
     *       200:
     *         description: A list of items
     */
    app.get('/', (req, res) => {
        indexController.getItems(req, res);
    });

    /**
     * @swagger
     * /item:
     *   post:
     *     summary: Create a new item
     *     responses:
     *       200:
     *         description: The created item
     */
    app.post('/item', (req, res) => {
        indexController.createItem(req, res);
    });
};
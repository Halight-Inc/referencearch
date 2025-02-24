import { IndexController } from '../controllers/index';
import { Express } from 'express';

export const setRoutes = (app: Express) => {
    const indexController = new IndexController();

    app.get('/', (req, res) => {
        indexController.getItems(req, res);
    });

    app.post('/item', (req, res) => {
        indexController.createItem(req, res);
    });
};
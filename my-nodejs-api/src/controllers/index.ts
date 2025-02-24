import { Request, Response } from 'express';

export class IndexController {
    async getItems(req: Request, res: Response) {
        // Your logic here
        res.send('Get Items');
    }

    async createItem(req: Request, res: Response) {
        // Your logic here
        res.send('Create Item');
    }
}
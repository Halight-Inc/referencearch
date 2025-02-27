import { Request, Response } from 'express';

export class IndexController {
    getItems(_req: Request, res: Response) {
        // Use req and res or remove them if not needed
        res.send('Get items');
    }

    createItem(_req: Request, res: Response) {
        // Use req and res or remove them if not needed
        res.send('Create item');
    }
}
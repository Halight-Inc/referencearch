import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const secret = 'your_jwt_secret'; // Replace with your secret key

export const generateToken = (user: any) => {
    return jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '1h' });
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secret, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        (req as any).user = user;
        next();
    });
};
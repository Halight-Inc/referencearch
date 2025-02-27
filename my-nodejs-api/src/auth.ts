import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const generateToken = (user: any) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.sendStatus(500); // Internal Server Error if JWT_SECRET is not defined
    }
    jwt.verify(token, secret, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        (req as any).user = user;
        next();
    });
};
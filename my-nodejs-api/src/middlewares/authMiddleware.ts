import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';

interface AuthenticatedRequest extends Request {
  user?: any; // Add a user property to the Request interface
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: 'Unauthorized' }); // No token

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden - Invalid Token' }); // Invalid token

    req.user = user; // Add the user to the request object
    next();
  });
};

export default authenticateToken;

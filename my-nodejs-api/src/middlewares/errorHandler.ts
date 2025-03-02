import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  // Handle specific error types
  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (err instanceof TokenExpiredError) {
    return res.status(401).json({ error: 'Token expired' });
  }
  // Default to 500 Internal Server Error
  res.status(500).json({ error: 'Internal Server Error' });
};

export default errorHandler;

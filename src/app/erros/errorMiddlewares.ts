

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = err.message || 'Internal Server Error';
  let errorMessages = [{ path: '', message }];

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errorMessages = Object.values(err.errors).map((el: any) => ({
      path: el.path,
      message: el.message,
    }));
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Cast Error';
    errorMessages = [{ path: err.path, message: 'Invalid ID format' }];
  } else if (err.code === 11000 || err.code === 'P2002') {
    statusCode = 400;
    message = 'Duplicate Entry';
    const target = err.meta?.target ? ` (${err.meta.target.join(', ')})` : '';
    errorMessages = [{ path: '', message: `A record with this value already exists${target}` }];
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errorMessages = err.errors.map((error: any) => ({
      path: error.path.join('.'),
      message: error.message,
    }));
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: err.stack,
  });
};

export default errorMiddleware;

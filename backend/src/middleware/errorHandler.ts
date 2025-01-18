import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

interface ErrorResponse {
  message: string;
  stack?: string;
  statusCode?: number;
  errors?: any;
}

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error: ErrorResponse = {
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  };

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    error.message = 'Validation Error';
    error.statusCode = 400;
    error.errors = Object.values(err.errors).map(val => val.message);
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    error.message = 'Duplicate field value entered';
    error.statusCode = 400;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    error.message = `Invalid ${err.path}: ${err.value}`;
    error.statusCode = 400;
  }

  // Custom AppError
  if (err instanceof AppError) {
    error.statusCode = err.statusCode;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message,
      ...(error.errors && { errors: error.errors }),
      ...(error.stack && { stack: error.stack })
    }
  });
};

// Async handler wrapper to avoid try-catch blocks in controllers
export const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Not found handler
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

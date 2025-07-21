import { Response, ErrorRequestHandler, NextFunction } from 'express';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../constants/http.js';
import { z } from 'zod';
import AppError from '../utils/app-error.js';
import { debug } from 'debug';

const log = debug('app:errorHandler');

const handleZodError = (res: Response, next: NextFunction, error: z.ZodError) => {
  const errors = error.issues.map((err) => ({
    path: err.path.join(','),
    message: err.message,
  }));

  res.status(BAD_REQUEST).json({
    errors,
    message: error.message,
  });
  next();
};

const handleAppError = (res: Response, next: NextFunction, error: AppError) => {
  res.status(error.statusCode).json({
    message: error.message,
  });
  next();
};

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  log(`PATH: ${req.path}`, error);

  if (error instanceof z.ZodError) {
    log(error);
    handleZodError(res, next, error);
    return;
  }

  if (error instanceof AppError) {
    log(error);
    handleAppError(res, next, error);
    return;
  }

  res.status(INTERNAL_SERVER_ERROR).send('Internal Server Error');
};

export default errorHandler;

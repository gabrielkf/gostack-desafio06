import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import routes from './routes';
import AppError from './errors/AppError';

import createConnection from './database';

createConnection();
const app = express();

app.use(express.json());
app.use(routes);

app.use(
  (err: Error, req: Request, res: Response, _: NextFunction) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        message: err.message,
        status: 'error',
      });
    }

    console.error(err);

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

export default app;

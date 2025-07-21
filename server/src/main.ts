import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { APP_ORIGIN, NODE_ENV, PORT } from './constants/env.js';
import { pinoHttp } from 'pino-http';
import logger from './utils/logger.js';
import authRoutes from './routes/auth-routes.js';
import errorHandler from './middleware/errorHandler.js';
import contactRoutes from './routes/contact-routes.js';

const app = express();

app.use(
  cors({
    origin: [`${APP_ORIGIN}`, 'http://localhost:3000'],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(pinoHttp({ logger }));

// Routes
// health check route
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' });
});

// auth routes
app.use('/api/auth', authRoutes);

// protected routes
app.use('/api/contacts', contactRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(Number(PORT), () => {
  console.log(`[server]: Server is running at http://localhost:${PORT} in ${NODE_ENV} environment`);
});

import { Router } from 'express';
import {
  loginHandler,
  registerHandler,
  getCurrentUserHandler,
  logoutHandler,
} from '../controllers/auth-controller.js';
import { debug } from 'debug';
import { authenticate } from '../middleware/authenticate.js';

const log = debug('app:errorHandler');

const authRoutes = Router();
log('Auth routes initialized');
log('typeof registerHandler', typeof registerHandler);

authRoutes.post('/register', registerHandler);
authRoutes.post('/login', loginHandler);
authRoutes.get('/me', authenticate, getCurrentUserHandler);
authRoutes.post('/logout', authenticate, logoutHandler);

export default authRoutes;

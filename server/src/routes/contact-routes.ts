import { Router } from 'express';

import {
  createContactHandler,
  getContactsHandler,
  getContactByIdHandler,
  updateContactHandler,
  deleteContactHandler,
} from '../controllers/contact-controller.js';

import { authenticate } from '../middleware/authenticate.js';

const contactRoutes = Router();

contactRoutes.post('/', authenticate, createContactHandler);
contactRoutes.get('/', authenticate, getContactsHandler);
contactRoutes.get('/:id', authenticate, getContactByIdHandler);
contactRoutes.patch('/:id', authenticate, updateContactHandler);
contactRoutes.delete('/:id', authenticate, deleteContactHandler);

export default contactRoutes;

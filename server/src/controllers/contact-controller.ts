import catchError from '../utils/cache-errors.js';
import ContactService from '../services/contact-service.js';
import {
  createContactSchema,
  updateContactSchema,
  deleteContactSchema,
  queryContactsSchema,
} from '../schemas/contact-schema.js';
import { CREATED, NO_CONTENT, OK } from '../constants/http.js';
import { db } from '../config/db.js';

const contactService = new ContactService(db);
export const createContactHandler = catchError(async (req, res) => {
  const userId = req.user.id;
  const request = createContactSchema.parse({ user_id: userId, ...req.body });

  const contact = await contactService.createContact(request);

  res.status(CREATED).json({
    contact,
    message: 'Contact created successfully',
  });
});

export const updateContactHandler = catchError(async (req, res) => {
  const userId = req.user.id;
  const contactId = req.params.id;
  const request = updateContactSchema.parse({
    user_id: userId,
    ...req.body,
  });
  const contact = await contactService.updateContact(contactId, request);

  res.status(OK).json({
    contact,
    message: 'Contact updated successfully',
  });
});

export const deleteContactHandler = catchError(async (req, res) => {
  const userId = req.user.id;
  const contactId = req.params.id;
  const request = deleteContactSchema.parse({ id: contactId, user_id: userId });

  await contactService.deleteContact(request);

  res.status(NO_CONTENT).json({
    message: 'Contact deleted successfully',
  });
});

export const getContactsHandler = catchError(async (req, res) => {
  const userId = req.user.id;
  const request = queryContactsSchema.parse(req.query);

  const { data, meta } = await contactService.getContacts(userId, request);

  res.status(OK).json({
    contacts: data,
    meta,
    message: 'Contacts retrieved successfully',
  });
});

export const getContactByIdHandler = catchError(async (req, res) => {
  const userId = req.user.id;
  const contactId = req.params.id;

  const contact = await contactService.getContactById(userId, contactId);

  res.status(OK).json({
    contact,
    message: 'Contact retrieved successfully',
  });
});

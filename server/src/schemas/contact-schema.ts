import z from 'zod';

export const queryContactsSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  sortBy: z.enum(['created_at', 'first_name', 'last_name']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
});

export const updateContactSchema = z.object({
  user_id: z.uuid().nonempty('User ID is required'),
  first_name: z.string().max(100).optional(),
  last_name: z.string().max(100).optional(),
  email: z.email().max(255).optional(),
  phone: z.string().max(20).optional(),
  company: z.string().max(100).optional(),
  contact_category_id: z.string().max(50).nullable().optional(),
});

export const createContactSchema = z.object({
  user_id: z.uuid().nonempty('User ID is required'),
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.email().max(255),
  phone: z.string().min(5).max(20),
  company: z.string().max(100).optional(),
  contact_category_id: z.string().max(50).nullable().optional(),
});

export const deleteContactSchema = z.object({
  id: z.uuid('id').nonempty('Contact ID is required'),
  user_id: z.uuid('user_id').nonempty('User ID is required'),
});

export type QueryContactsSchema = z.infer<typeof queryContactsSchema>;
export type UpdateContactSchema = z.infer<typeof updateContactSchema>;
export type CreateContactSchema = z.infer<typeof createContactSchema>;
export type DeleteContactSchema = z.infer<typeof deleteContactSchema>;

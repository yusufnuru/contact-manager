import { z } from 'zod';

export const emailSchema = z.email().min(3).max(255);
export const passwordSchema = z.string().min(6).max(255);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

export const registerSchema = loginSchema
  .extend({
    firstName: z.string().min(1).max(255),
    lastName: z.string().min(1).max(255),
    confirmPassword: z.string().min(6).max(255),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type EmailSchema = z.infer<typeof emailSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;

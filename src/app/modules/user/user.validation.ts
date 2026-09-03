import { z } from 'zod';

const userValidationSchema = z.object({
  body:z.object({
    name: z.string({ message: 'Enter your name.' }),

  email: z
    .string()
    .email({ message: 'Invalid email address.' }),

  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' })
    .max(100, { message: 'Password must be less than 100 characters.' }),

  profileImage: z.string().optional(),

  phone: z.string().optional(),

  address: z.string().optional(),
  })
});




export const UserValidation = {
  userValidationSchema,
};

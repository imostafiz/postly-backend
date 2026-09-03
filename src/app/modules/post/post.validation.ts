
import { z } from 'zod';

const postValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    content: z.string().min(1, { message: 'Content is required' }),
    image: z.array(z.string()).optional(),
    userId: z.coerce.string().min(1, { message: 'User ID is required' }),
    category: z.string().min(1, { message: 'Category is required' }),
    isPremium: z.boolean().optional(),
  }),
});

const updatePostValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, { message: 'Title must have at least 1 character' })
      .optional(),
    content: z
      .string()
      .min(1, { message: 'Content must have at least 1 character' })
      .optional(),
    image: z.array(z.string()).optional(),
    userId: z.coerce.string().min(1, { message: 'User ID is required' }).optional(),
    category: z.string().min(1, { message: 'Category is required' }).optional(),
    isPremium: z.boolean().optional(),
  }),
});
export const postValidation = {
  postValidationSchema,
  updatePostValidationSchema,
};

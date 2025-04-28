import { z } from 'zod'

export const UserSchema = z.object({
  name: z
    .string()
    .trim()
    .regex(/^[\p{L}\s]+$/u, 'Name must only have letters.')
    .min(3, 'Name must be at least 3 characters.')
    .max(50, 'Name must be a maximum of 50 characters.'),
  email: z
    .string()
    .trim()
    .email('Invalid e-mail format.')
    .max(254, 'E-mail must be a maximum of 254 characters.'),
  password: z
    .string()
    .trim()
    .min(6, 'Password must be at least 6 characters.')
    .max(60, 'Password must be a maximum of 60 characters.'),
})

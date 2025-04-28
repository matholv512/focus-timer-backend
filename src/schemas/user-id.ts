import { z } from 'zod'
import mongoose from 'mongoose'

export const UserIdSchema = z.object({
  userId: z
    .string()
    .trim()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'userId is not a valid object id',
    }),
})

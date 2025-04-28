import mongoose from 'mongoose'
import { z } from 'zod'

export const TaskIdSchema = z.object({
  taskId: z
    .string()
    .trim()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'taskId is not a valid object id',
    }),
})

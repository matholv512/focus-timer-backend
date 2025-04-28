import { z } from 'zod'

export const TaskSchema = z.object({
  title: z.string({ message: 'title is required.' }).trim(),
  description: z.string({ message: 'description is required' }).trim(),
  completed: z.boolean().default(false),
})

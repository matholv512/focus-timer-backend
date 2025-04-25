import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { BadRequestError, ValidationErrors } from '../errors/Custom-errors.ts'

const TaskSchema = z.object({
  title: z.string({ message: 'title is required.' }).trim(),
  description: z.string({ message: 'description is required' }).trim(),
  completed: z.boolean().default(false),
})

export const validateTask = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validation = TaskSchema.safeParse(req.body)

  if (!validation.success) {
    const errors: BadRequestError[] = validation.error.issues.map(
      ({ message, path }) => new BadRequestError(message, path.join('')),
    )

    return next(new ValidationErrors(errors))
  }

  next()
}

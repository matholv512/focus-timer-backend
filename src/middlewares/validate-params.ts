import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import { z } from 'zod'
import { BadRequestError, ValidationErrors } from '../errors/Custom-errors.ts'

const ParamsSchema = z.object({
  userId: z
    .string()
    .trim()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'userId is not a valid object id',
    })
    .optional(),
  taskId: z
    .string()
    .trim()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'taskId is not a valid object id',
    })
    .optional(),
})

export const validateParams = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const validation = ParamsSchema.safeParse(req.params)

  if (!validation.success) {
    const errors: BadRequestError[] = validation.error.issues.map(
      ({ message, path }) => new BadRequestError(message, path.join('')),
    )

    return next(new ValidationErrors(errors))
  }

  next()
}

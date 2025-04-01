import { Request, Response, NextFunction } from 'express'
import { CustomError, ValidationErrors } from '../errors/Custom-errors.ts'

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const isDebugMode = process.env.NODE_ENV === 'development'

  if (res.headersSent || isDebugMode) {
    console.log(error)
    return next(error)
  }

  if (error instanceof ValidationErrors) {
    res.status(error.statusCode).json(error.toJSON())
    return
  }

  if (error instanceof CustomError) {
    res.status(error.statusCode).json(error.toJSON())
    return
  }

  res.status(500).json({
    errors: [{ message: 'An unexpected error occurred.' }],
  })
}

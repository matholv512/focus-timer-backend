/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import { CustomError, ValidationErrors } from '../errors/custom-errors.ts'
import { handleDuplicateKeyError } from '../errors/handle-duplicate-key-error.ts'

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const isDebugMode = process.env.NODE_ENV === 'development'
  const duplicateKeyError = handleDuplicateKeyError(error)

  if (res.headersSent || isDebugMode) {
    return next(error)
  }

  if (duplicateKeyError) {
    res.status(duplicateKeyError.statusCode).json(duplicateKeyError.toJSON())
    return
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

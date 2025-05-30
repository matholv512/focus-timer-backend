/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express'
import { CustomError, ValidationErrors } from '../errors/custom-errors.ts'
import { handleDuplicateKeyError } from '../errors/handle-duplicate-key-error.ts'
import jwt from 'jsonwebtoken'
import { isDev } from '../config/env.ts'

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const duplicateKeyError = handleDuplicateKeyError(error)

  if (res.headersSent || isDev) {
    return next(error)
  }

  if (duplicateKeyError) {
    res.status(duplicateKeyError.statusCode).json(duplicateKeyError.toJSON())
    return
  }

  if (
    error instanceof jwt.JsonWebTokenError ||
    error instanceof jwt.TokenExpiredError
  ) {
    res.status(401).json({
      message:
        error instanceof jwt.TokenExpiredError
          ? 'Token expired.'
          : 'Invalid token.',
    })
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

import { z } from 'zod'
import { Request, Response, NextFunction } from 'express'
import { BadRequestError, ValidationErrors } from '../errors/Custom-errors.ts'

type RequestPart = 'body' | 'params' | 'query'

export const createValidationMiddleware =
  (schema: z.ZodSchema, target: RequestPart = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.safeParse(req[target])

    if (!validation.success) {
      const errors: BadRequestError[] = validation.error?.issues.map(
        ({ message, path }) => {
          return new BadRequestError(message, path.join(''))
        },
      )

      return next(new ValidationErrors(errors))
    }

    req[target] = validation.data

    next()
  }

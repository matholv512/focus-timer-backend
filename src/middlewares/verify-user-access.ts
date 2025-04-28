import { Response, NextFunction } from 'express'
import { AuthRequest } from '../interfaces/auth.ts'
import { ForbiddenError } from '../errors/custom-errors.ts'
import { canAccessResource } from '../services/permissions.ts'

export const verifyUserAccess = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params

  if (userId) {
    if (!canAccessResource(req.user, userId)) {
      return next(
        new ForbiddenError('Only administrators can perform this action.'),
      )
    }
  }

  next()
}

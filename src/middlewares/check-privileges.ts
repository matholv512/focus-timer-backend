import { Response, NextFunction } from 'express'
import { AuthRequest } from '../interfaces/auth.ts'
import { ForbiddenError } from '../errors/Custom-errors.ts'

export const checkPrivileges = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params

  if (userId !== req.user?.id && req.user?.role !== 'admin') {
    return next(
      new ForbiddenError('Only administrators can perform this action.'),
    )
  }

  next()
}

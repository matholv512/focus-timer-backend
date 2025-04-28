import { Response, NextFunction } from 'express'
import { AuthRequest } from '../interfaces/auth.ts'
import { canAccessTask } from '../services/permissions.ts'
import { getTaskById } from '../services/task.ts'
import { ForbiddenError } from '../errors/custom-errors.ts'

export const verifyTaskAccess = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const { taskId } = req.params

  const task = await getTaskById(taskId)

  if (!canAccessTask(req.user, task)) {
    return next(
      new ForbiddenError('You do not have permission to access this task.'),
    )
  }
  req.task = task
  next()
}

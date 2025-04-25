import { AuthRequest } from '../interfaces/auth.ts'
import { TaskDoc } from '../interfaces/task.ts'

export const canAccessResource = (
  user: AuthRequest['user'],
  resourceOwnerId: string,
): boolean => {
  return user?.id === resourceOwnerId || user?.role === 'admin'
}

export const canAccessTask = (
  user: AuthRequest['user'],
  task: TaskDoc,
): boolean => {
  return user?.id === task.userId.toString() || user?.role === 'admin'
}

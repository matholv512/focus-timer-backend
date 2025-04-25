import { AuthRequest } from '../interfaces/auth.ts'

export const canAccessResource = (
  user: AuthRequest['user'],
  resourceOwnerId: string,
): boolean => {
  return user?.id === resourceOwnerId || user?.role === 'admin'
}

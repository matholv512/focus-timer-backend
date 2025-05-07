import { Response, NextFunction } from 'express'
import { verifyToken } from '../../utils/verify-token.ts'
import { AuthRequest, UserRequest } from '../../interfaces/auth.ts'

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.cookie?.split('token=')[1]
  const decoded = verifyToken(token) as UserRequest

  req.user = {
    id: decoded.id,
    email: decoded.email,
    name: decoded.name,
    role: decoded.role,
  }
  next()
}

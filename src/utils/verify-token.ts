import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../errors/custom-errors.ts'

export const verifyToken = (token: string | undefined) => {
  if (!token) throw new UnauthorizedError()
  return jwt.verify(token, process.env.JWT_SECRET)
}

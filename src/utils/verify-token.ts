import jwt from 'jsonwebtoken'
import { assertExists } from './assert-exists.ts'

export const verifyToken = (token: string | undefined) => {
  assertExists(token, 'Token')
  return jwt.verify(token, process.env.JWT_SECRET)
}

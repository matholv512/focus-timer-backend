import jwt from 'jsonwebtoken'

export const verifyToken = (token: string | undefined) => {
  if (!token) return
  return jwt.verify(token, process.env.JWT_SECRET)
}

import { Request, Response } from 'express'
import { Auth } from '../../interfaces/auth.ts'
import { authenticateUser } from '../../services/auth/auth.ts'
import { setAuthCookie } from '../../utils/cookie.ts'

export const login = async (req: Request, res: Response) => {
  const { email, password }: Auth = req.body

  const token = await authenticateUser(email, password)

  setAuthCookie(res, token)

  res.status(200).json({ message: 'Successfully logged in.' })
}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token')
  res.status(200).json({ message: 'Successfully logged out.' })
}

import { Request, Response } from 'express'
import { Auth } from '../interfaces/auth.ts'
import { authenticateUser } from '../services/auth.ts'

export const login = async (req: Request, res: Response) => {
  const { email, password }: Auth = req.body

  const token = authenticateUser(email, password)

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: 'strict',
  })

  res.status(200).json({ message: 'Successfully logged in.' })
}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token')
  res.status(200).json({ message: 'Successfully logged out.' })
}

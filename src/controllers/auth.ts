import { Request, Response } from 'express'
import { User } from '../models/User.ts'
import { compareHashes } from '../utils/hash.ts'
import { UnauthorizedError } from '../errors/Custom-errors.ts'
import { Auth } from '../interfaces/auth.ts'
import { createToken } from '../services/auth.ts'

export const login = async (req: Request, res: Response) => {
  const { email, password }: Auth = req.body

  const user = await User.findOne({ email })

  const verifyPass = await compareHashes(password, user?.password)

  if (!user || !verifyPass) {
    throw new UnauthorizedError('Invalid e-mail or password.')
  }

  const token = createToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })

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

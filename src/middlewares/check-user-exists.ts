import { Request, Response, NextFunction } from 'express'
import { User } from '../models/User.ts'
import { BadRequestError } from '../errors/Custom-errors.ts'

export const checkUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email } = req.body

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    throw new BadRequestError('User already exists.')
  }

  next()
}

import { Request, Response } from 'express'
import { User } from '../models/User.ts'
import { UserInterface } from '../interfaces/user.ts'
import { NotFoundError } from '../errors/Custom-errors.ts'
import { hashPassword } from '../utils/hash.ts'
import { AuthRequest } from '../interfaces/auth.ts'

export const getAllUsers = async (req: Request, res: Response) => {
  const users: UserInterface[] = await User.find({}, '-password')

  if (!users.length) {
    throw new NotFoundError('No users found.')
  }

  res.status(200).json({
    message: 'Listing all users successfully.',
    users,
  })
}

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = await User.findById(id, '-password')

  if (!user) {
    throw new NotFoundError('User not found.')
  }

  res.status(200).json({ message: 'User found successfully.', user })
}

export const getUserData = async (req: AuthRequest, res: Response) => {
  const user = req?.user
  res.status(200).json({ message: 'Successfully Retrieving User Data.', user })
}

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password }: UserInterface = req.body

  const hashedPassword = await hashPassword(password)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  res.status(201).json({
    message: 'User created successfully.',
    user: { id: user._id, name: user.name, email: user.email },
  })
}

export const editUser = async (req: Request, res: Response) => {
  const { name, email, password }: UserInterface = req.body
  const { id } = req.params
  const hashedPassword = await hashPassword(password)
  const user = await User.findByIdAndUpdate(
    id,
    {
      name,
      email,
      password: hashedPassword,
    },
    { returnDocument: 'after', fields: '-password' },
  )

  if (!user) {
    throw new NotFoundError('User not found.')
  }

  res.status(200).json({ message: 'User edited successfully.', user })
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = await User.findById(id)

  if (!user) {
    throw new NotFoundError('User not found.')
  }

  await user.deleteOne()
  res.status(200).json({ message: 'User deleted successfully.' })
}

import { Request, Response } from 'express'
import { CreateUserPayload, UpdateUserPayload } from '../interfaces/user.ts'
import { AuthRequest } from '../interfaces/auth.ts'
import * as userService from '../services/user.ts'

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await userService.getAllUsers()

  res.status(200).json({
    message: 'Listing all users successfully.',
    users,
  })
}

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params

  const user = await userService.getUserById(userId)

  res.status(200).json({ message: 'User found successfully.', user })
}

export const getUserData = async (req: AuthRequest, res: Response) => {
  const user = req?.user
  res.status(200).json({ message: 'User data retrieved successfully.', user })
}

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password }: CreateUserPayload = req.body

  const user = await userService.createUser({ name, email, password })

  res.status(201).json({
    message: 'User created successfully.',
    user: { id: user._id, name: user.name, email: user.email },
  })
}

export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params

  const { name, email, password }: UpdateUserPayload = req.body

  const user = await userService.updateUser(userId, { name, email, password })

  res.status(200).json({ message: 'User updated successfully.', user })
}

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params

  await userService.deleteUser(userId)

  res.status(200).json({ message: 'User deleted successfully.' })
}

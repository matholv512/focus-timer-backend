import { NotFoundError } from '../errors/Custom-errors.ts'
import {
  CreateUserPayload,
  UpdateUserPayload,
  UserDoc,
} from '../interfaces/user.ts'
import { User } from '../models/User.ts'
import { hashPassword } from '../utils/hash.ts'

export const getAllUsers = async (): Promise<UserDoc[]> => {
  const users = await User.find({}, '-password')

  if (!users.length) {
    throw new NotFoundError('No users found.')
  }

  return users
}

export const getUserById = async (userId: string): Promise<UserDoc> => {
  const user = await User.findById(userId, '-password')

  if (!user) {
    throw new NotFoundError('User not found.')
  }

  return user
}

export const createUser = async ({
  name,
  email,
  password,
}: CreateUserPayload): Promise<UserDoc> => {
  const hashedPassword = await hashPassword(password)
  return await User.create({ name, email, password: hashedPassword })
}

export const updateUser = async (
  userId: string,
  { name, email, password }: UpdateUserPayload,
): Promise<UserDoc> => {
  const user = await getUserById(userId)

  user.name = name
  user.email = email

  if (password) {
    user.password = await hashPassword(password)
  }

  return await user.save()
}

export const deleteUser = async (userId: string): Promise<void> => {
  const user = await getUserById(userId)
  await user.deleteOne()
}

import { Router } from 'express'
import {
  createUser,
  deleteUser,
  updateUser,
  getAllUsers,
  getUserData,
  getUserById,
} from '../controllers/user.ts'
import { auth } from '../middlewares/auth.ts'
import { verifyUserAccess } from '../middlewares/verify-user-access.ts'
import { speedLimiter } from '../middlewares/rate-limiter.ts'
import {
  validateCreateUser,
  validateDeleteUser,
  validateGetUser,
  validateUpdateUser,
} from '../middlewares/user-validation.ts'

export const userRouter = Router()

userRouter.get(
  '/users',
  speedLimiter,
  auth,
  validateGetUser,
  verifyUserAccess,
  getAllUsers,
)
userRouter.get(
  '/users/:userId',
  speedLimiter,
  auth,
  validateGetUser,
  verifyUserAccess,
  getUserById,
)
userRouter.get('/me', auth, getUserData)
userRouter.post('/users', speedLimiter, validateCreateUser, createUser)
userRouter.put(
  '/users/:userId',
  speedLimiter,
  auth,
  verifyUserAccess,
  validateUpdateUser,
  updateUser,
)
userRouter.delete(
  '/users/:userId',
  speedLimiter,
  auth,
  validateDeleteUser,
  verifyUserAccess,
  deleteUser,
)

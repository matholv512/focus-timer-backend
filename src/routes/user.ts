import { Router } from 'express'
import {
  createUser,
  deleteUser,
  updateUser,
  getAllUsers,
  getUserData,
  getUserById,
} from '../controllers/user/user.ts'
import { auth } from '../middlewares/auth/auth.ts'
import { verifyUserAccess } from '../middlewares/access/verify-user-access.ts'
import { speedLimiter } from '../middlewares/rate-limiter.ts'
import {
  validateCreateUser,
  validateDeleteUser,
  validateGetUser,
  validateUpdateUser,
} from '../middlewares/validations/user-validation.ts'

export const userRouter = Router()

userRouter.get('/users', speedLimiter, auth, verifyUserAccess, getAllUsers)
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

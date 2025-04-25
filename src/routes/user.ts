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
import { validateUser } from '../middlewares/validate-user.ts'
import { checkUserExists } from '../middlewares/check-user-exists.ts'
import { verifyUserAccess } from '../middlewares/verify-user-access.ts'
import { speedLimiter } from '../middlewares/rate-limiter.ts'

export const userRouter = Router()

userRouter.get('/users', speedLimiter, auth, verifyUserAccess, getAllUsers)
userRouter.get(
  '/users/:userId',
  speedLimiter,
  auth,
  verifyUserAccess,
  getUserById,
)
userRouter.get('/me', auth, getUserData)
userRouter.post(
  '/users',
  speedLimiter,
  validateUser,
  checkUserExists,
  createUser,
)
userRouter.put(
  '/users/:userId',
  speedLimiter,
  auth,
  verifyUserAccess,
  validateUser,
  checkUserExists,
  updateUser,
)
userRouter.delete(
  '/users/:userId',
  speedLimiter,
  auth,
  verifyUserAccess,
  deleteUser,
)

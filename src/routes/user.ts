import { Router } from 'express'
import {
  createUser,
  deleteUser,
  editUser,
  getAllUsers,
  getUserData,
  getUserById,
} from '../controllers/user.ts'
import { auth } from '../middlewares/auth.ts'
import { validateUser } from '../middlewares/validate-user.ts'
import { checkUserExists } from '../middlewares/check-user-exists.ts'
import { checkPrivileges } from '../middlewares/check-privileges.ts'
import { speedLimiter } from '../middlewares/rate-limiter.ts'

export const userRouter = Router()

userRouter.get('/users', speedLimiter, auth, checkPrivileges, getAllUsers)
userRouter.get('/users/:id', speedLimiter, auth, checkPrivileges, getUserById)
userRouter.get('/me', auth, getUserData)
userRouter.post(
  '/users',
  speedLimiter,
  validateUser,
  checkUserExists,
  createUser,
)
userRouter.put(
  '/users/:id',
  speedLimiter,
  auth,
  checkPrivileges,
  validateUser,
  checkUserExists,
  editUser,
)
userRouter.delete('/users/:id', speedLimiter, auth, checkPrivileges, deleteUser)

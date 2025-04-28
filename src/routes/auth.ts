import { Router } from 'express'
import { login, logout } from '../controllers/auth/auth.ts'
import { limiter, speedLimiter } from '../middlewares/rate-limiter.ts'
import { auth } from '../middlewares/auth/auth.ts'

export const authRouter = Router()

authRouter.post('/auth', speedLimiter, limiter, login)
authRouter.delete('/auth', auth, logout)

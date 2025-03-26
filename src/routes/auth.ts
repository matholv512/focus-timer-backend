import { Router } from 'express'
import { login, logout } from '../controllers/auth.ts'
import { limiter, speedLimiter } from '../middlewares/rate-limiter.ts'

export const authRouter = Router()

authRouter.post('/auth', speedLimiter, limiter, login)
authRouter.delete('/auth', logout)

import { Router } from 'express'
import { userRouter } from './user.ts'
import { authRouter } from './auth.ts'

export const router = Router()

router.use(userRouter)
router.use(authRouter)

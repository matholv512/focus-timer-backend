import { Router } from 'express'
import { userRouter } from './user.ts'
import { authRouter } from './auth.ts'
import { taskRouter } from './task.ts'

export const router = Router()

router.use(userRouter)
router.use(authRouter)
router.use(taskRouter)

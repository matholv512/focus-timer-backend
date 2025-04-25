import { Router } from 'express'
import {
  createTask,
  updateTask,
  deleteTask,
  getTasksByUser,
} from '../controllers/task.ts'
import { auth } from '../middlewares/auth.ts'
import { verifyUserAccess } from '../middlewares/verify-user-access.ts'
import { validateTask } from '../middlewares/validate-task.ts'
import { validateParams } from '../middlewares/validate-params.ts'
import { verifyTaskAccess } from '../middlewares/verify-task-access.ts'

export const taskRouter = Router()

taskRouter.get(
  '/users/:userId/tasks',
  auth,
  validateParams,
  verifyUserAccess,
  getTasksByUser,
)
taskRouter.post(
  '/users/:userId/tasks',
  auth,
  validateParams,
  validateTask,
  verifyUserAccess,
  createTask,
)
taskRouter.put(
  '/tasks/:taskId',
  auth,
  validateParams,
  validateTask,
  verifyUserAccess,
  verifyTaskAccess,
  updateTask,
)
taskRouter.delete(
  '/tasks/:taskId',
  auth,
  validateParams,
  verifyUserAccess,
  verifyTaskAccess,
  deleteTask,
)

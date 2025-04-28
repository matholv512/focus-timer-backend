import { Router } from 'express'
import {
  createTask,
  updateTask,
  deleteTask,
  getTasksByUser,
} from '../controllers/task.ts'
import { auth } from '../middlewares/auth.ts'
import { verifyUserAccess } from '../middlewares/verify-user-access.ts'
import { verifyTaskAccess } from '../middlewares/verify-task-access.ts'
import {
  validateGetTask,
  validateCreateTask,
  validateUpdateTask,
  validateDeleteTask,
} from '../middlewares/task-validation.ts'

export const taskRouter = Router()

taskRouter.get(
  '/users/:userId/tasks',
  auth,
  validateGetTask,
  verifyUserAccess,
  getTasksByUser,
)
taskRouter.post(
  '/users/:userId/tasks',
  auth,
  validateCreateTask,
  verifyUserAccess,
  createTask,
)
taskRouter.put(
  '/tasks/:taskId',
  auth,
  validateUpdateTask,
  verifyUserAccess,
  verifyTaskAccess,
  updateTask,
)
taskRouter.delete(
  '/tasks/:taskId',
  auth,
  validateDeleteTask,
  verifyUserAccess,
  verifyTaskAccess,
  deleteTask,
)

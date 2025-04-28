import { validateTaskId } from './validate-task-id.ts'
import { validateTask } from './validate-task.ts'
import { validateUserId } from './validate-user-id.ts'

export const validateGetTask = [validateUserId, validateTaskId]

export const validateCreateTask = [validateUserId, validateTaskId, validateTask]

export const validateUpdateTask = [validateTaskId, validateTask]

export const validateDeleteTask = [validateTaskId]

import { TaskIdSchema } from '../../schemas/task/task-id.ts'
import { createValidationMiddleware } from '../../utils/validation-factory.ts'

export const validateTaskId = createValidationMiddleware(TaskIdSchema, 'params')

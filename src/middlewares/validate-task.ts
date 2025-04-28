import { TaskSchema } from '../schemas/task.ts'
import { createValidationMiddleware } from '../utils/validation-factory.ts'

export const validateTask = createValidationMiddleware(TaskSchema)

import { TaskSchema } from '../../schemas/task/task.ts'
import { createValidationMiddleware } from '../../utils/validation-factory.ts'

export const validateTask = createValidationMiddleware(TaskSchema)

import { UserIdSchema } from '../../schemas/user/user-id.ts'
import { createValidationMiddleware } from '../../utils/validation-factory.ts'

export const validateUserId = createValidationMiddleware(UserIdSchema, 'params')

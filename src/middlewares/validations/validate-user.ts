import { UserSchema } from '../../schemas/user/user.ts'
import { createValidationMiddleware } from '../../utils/validation-factory.ts'

export const validateUser = createValidationMiddleware(UserSchema)

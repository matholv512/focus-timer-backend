import { validateUserId } from './validate-user-id.ts'
import { validateUser } from './validate-user.ts'

export const validateGetUser = [validateUserId]

export const validateCreateUser = [validateUser]

export const validateUpdateUser = [validateUserId, validateUser]

export const validateDeleteUser = [validateUserId]

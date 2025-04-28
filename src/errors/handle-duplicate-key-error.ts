/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestError } from './custom-errors.ts'

export const handleDuplicateKeyError = (error: any) => {
  if (error.code !== 11000) return
  const errorKey = Object.keys(error.keyPattern)[0]
  const duplicatedField = errorKey[0].toUpperCase() + errorKey.slice(1)

  return new BadRequestError(`${duplicatedField} already exists.`, errorKey)
}

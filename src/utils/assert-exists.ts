import { InternalServerError } from '../errors/custom-errors.ts'

type assertExistsFn = <T>(
  value: T,
  name: string,
) => asserts value is NonNullable<T>

export const assertExists: assertExistsFn = <T>(
  value: T,
  name: string = 'Value',
) => {
  if (value === null || value === undefined) {
    throw new InternalServerError(`${name} must be defined.`)
  }
}

import { Request, Response } from 'express'
import { validateUser } from './validate-user.ts'
import { createUser } from '../utils/create-user.ts'
import { ValidationErrors } from '../errors/Custom-errors.ts'

describe('validateUser middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock

  beforeEach(() => {
    req = { body: {} }
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    next = jest.fn()
  })

  it('should return an error when name is too short', () => {
    req.body = createUser({ name: 'jo' })

    validateUser(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(expect.any(ValidationErrors))

    const error = next.mock.calls[0][0]

    expect(error).toBeInstanceOf(ValidationErrors)

    expect(error.errors[0].message).toBe('Name must be at least 3 characters.')
    expect(error.errors[0].field).toBe('name')
  })

  it('should return an error when name is too long', () => {
    req.body = createUser({ name: 'a'.repeat(51) })

    validateUser(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(expect.any(ValidationErrors))

    const error = next.mock.calls[0][0] as ValidationErrors

    expect(error).toBeInstanceOf(ValidationErrors)

    expect(error.errors[0].message).toBe(
      'Name must be a maximum of 50 characters.',
    )
    expect(error.errors[0].field).toBe('name')
  })

  it('should return an error when the name does not include only letters', () => {
    req.body = createUser({ name: '123' })

    validateUser(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(expect.any(ValidationErrors))

    const error = next.mock.calls[0][0] as ValidationErrors

    expect(error).toBeInstanceOf(ValidationErrors)

    expect(error.errors[0].message).toBe('Name must only have letters.')
    expect(error.errors[0].field).toBe('name')
  })

  it('should return an error when password is too short', () => {
    req.body = createUser({ password: '12345' })

    validateUser(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(expect.any(ValidationErrors))

    const error = next.mock.calls[0][0] as ValidationErrors

    expect(error.errors[0].message).toBe(
      'Password must be at least 6 characters.',
    )
    expect(error.errors[0].field).toBe('password')
  })

  it('should return an error when password is too long', () => {
    req.body = createUser({ password: 'a'.repeat(61) })

    validateUser(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(expect.any(ValidationErrors))

    const error = next.mock.calls[0][0] as ValidationErrors

    expect(error).toBeInstanceOf(ValidationErrors)

    expect(error.errors[0].message).toBe(
      'Password must be a maximum of 60 characters.',
    )
    expect(error.errors[0].field).toBe('password')
  })

  it('should return an invalid email format message', () => {
    req.body = createUser({ email: '' })

    validateUser(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(expect.any(ValidationErrors))

    const error = next.mock.calls[0][0] as ValidationErrors

    expect(error).toBeInstanceOf(ValidationErrors)

    expect(error.errors[0].message).toBe('Invalid e-mail format.')
    expect(error.errors[0].field).toBe('email')
  })

  it('should return an error when e-mail is too long', () => {
    req.body = createUser({ email: 'a'.repeat(245) + '@gmail.com' })

    validateUser(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(expect.any(ValidationErrors))

    const error = next.mock.calls[0][0] as ValidationErrors

    expect(error).toBeInstanceOf(ValidationErrors)

    expect(error.errors[0].message).toBe(
      'E-mail must be a maximum of 254 characters.',
    )
    expect(error.errors[0].field).toBe('email')
  })

  it('should return multiples validation errors', () => {
    req.body = createUser({ name: 'a', email: 'a', password: 'a' })

    validateUser(req as Request, res as Response, next)

    validateUser(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(expect.any(ValidationErrors))

    const error = next.mock.calls[0][0] as ValidationErrors

    expect(error).toBeInstanceOf(ValidationErrors)

    const errorsMessages = [
      'Name must be at least 3 characters.',
      'Invalid e-mail format.',
      'Password must be at least 6 characters.',
    ]

    const errorsFields = ['name', 'email', 'password']

    error.errors.forEach((err, i) => {
      expect(err.message).toBe(errorsMessages[i])
      expect(err.field).toBe(errorsFields[i])
    })
  })

  it('should create a user successfully', () => {
    req.body = createUser()

    validateUser(req as Request, res as Response, next)

    expect(next).not.toHaveBeenCalledWith(expect.any(ValidationErrors))
  })
})

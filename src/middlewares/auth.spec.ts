import { Response } from 'express'
import { AuthRequest } from '../interfaces/auth.ts'
import { auth } from './auth.ts'
import { createToken } from '../services/auth.ts'
import { createUser } from '../utils/user-factory.ts'
import { CustomError } from '../errors/Custom-errors.ts'

let req: Partial<AuthRequest>
let res: Partial<Response>
let next: jest.Mock

beforeEach(() => {
  req = { body: {}, headers: { cookie: `token=${createToken(createUser())}` } }
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    cookie: jest.fn(),
  }
  next = jest.fn()
})

describe('auth middleware', () => {
  it('should add user to request if the token is valid', () => {
    auth(req as AuthRequest, res as Response, next)
    expect(next).toHaveBeenCalled()
    expect(req.user).toMatchObject({
      id: expect.any(String),
      email: expect.any(String),
      name: expect.any(String),
      role: expect.any(String),
    })
  })

  it('should return an error when the token is invalid', () => {
    if (!req.headers) return

    req.headers.cookie = 'invalid.cookie.123'
    auth(req as AuthRequest, res as Response, next)
    expect(next).toHaveBeenCalledWith(expect.any(CustomError))
    const error = next.mock.calls[0][0] as CustomError
    expect(error).toBeInstanceOf(CustomError)
    expect(error.statusCode).toBe(401)
    expect(error.message).toBe('Unauthorized.')
  })

  it('should return an error when there is no token', () => {
    if (!req.headers) return

    req.headers.cookie = undefined
    auth(req as AuthRequest, res as Response, next)
    expect(next).toHaveBeenCalledWith(expect.any(CustomError))
    const error = next.mock.calls[0][0] as CustomError
    expect(error).toBeInstanceOf(CustomError)
    expect(error.statusCode).toBe(401)
    expect(error.message).toBe('Unauthorized.')
  })
})

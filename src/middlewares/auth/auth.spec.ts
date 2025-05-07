import { Response } from 'express'
import { AuthRequest } from '../../interfaces/auth.ts'
import { auth } from './auth.ts'
import { createToken } from '../../utils/create-token.ts'
import { createFakeUser } from '../../utils/user-factory.ts'
import { JsonWebTokenError } from 'jsonwebtoken'
import { InternalServerError } from '../../errors/custom-errors.ts'

let req: Partial<AuthRequest>
let res: Partial<Response>
let next: jest.Mock

const user = createFakeUser()
const validToken = `token=${createToken({ id: user.id, name: user.name, email: user.email, role: user.role })}`
const invalidToken = 'token=invalid.token.123'

beforeEach(() => {
  req = { headers: { cookie: undefined } }
  res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
  next = jest.fn()
})

describe('auth middleware', () => {
  it('should add user to request if token is valid', () => {
    req.headers = req.headers || {}
    req.headers.cookie = validToken

    try {
      auth(req as AuthRequest, res as Response, next)
      expect(req).toHaveProperty('user', {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
      expect(next).toHaveBeenCalledTimes(1)
    } catch (error) {
      expect(error).not.toBeInstanceOf(JsonWebTokenError)
    }
  })

  it('should return an error if token is invalid', () => {
    req.headers = req.headers || {}
    req.headers.cookie = invalidToken

    try {
      auth(req as AuthRequest, res as Response, next)
    } catch (error) {
      expect(error).toBeInstanceOf(JsonWebTokenError)
      expect(error).toHaveProperty('message', 'invalid token')
      expect(next).not.toHaveBeenCalled()
    }
  })

  it('should return an error if token is missing', () => {
    req.headers = {}

    try {
      auth(req as AuthRequest, res as Response, next)
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError)
      expect(error).toHaveProperty('statusCode', 500)
      expect(error).toHaveProperty('message', 'Token must be defined.')
      expect(next).not.toHaveBeenCalled()
    }
  })
})

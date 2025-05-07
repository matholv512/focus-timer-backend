import { Response } from 'express'
import { AuthRequest } from '../../interfaces/auth.ts'
import { verifyUserAccess } from './verify-user-access.ts'
import { CustomError } from '../../errors/custom-errors.ts'
import { createFakeUser } from '../../utils/user-factory.ts'
import { assertExists } from '../../utils/assert-exists.ts'

describe('verify user access', () => {
  let req: Partial<AuthRequest>
  let res: Partial<Response>
  let next: jest.Mock

  const user = createFakeUser({ id: '2', role: 'user' })
  const statusError = 403
  const errorMsg = 'Only administrators can perform this action.'

  beforeEach(() => {
    req = { params: {}, user }
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    next = jest.fn()
  })

  it('should deny acess when user id does not match param', () => {
    req.params = { userId: '1' }
    req.user = user
    verifyUserAccess(req as AuthRequest, res as Response, next)

    expect(next).toHaveBeenCalledWith(expect.any(CustomError))

    const error = next.mock.calls[0][0] as CustomError
    expect(error).toBeInstanceOf(CustomError)
    expect(error.statusCode).toBe(statusError)
    expect(error.message).toBe(errorMsg)
  })

  it('should allow access when user id matches param', () => {
    req.params = { userId: '2' }
    req.user = user
    verifyUserAccess(req as AuthRequest, res as Response, next)
    expect(next).not.toHaveBeenCalledWith(expect.any(CustomError))
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('should allow admin access regardless of id', () => {
    req.params = { userId: '1' }

    assertExists(req.user, 'User')
    req.user.role = 'admin'

    verifyUserAccess(req as AuthRequest, res as Response, next)
    expect(next).not.toHaveBeenCalledWith(expect.any(CustomError))
    expect(next).toHaveBeenCalledTimes(1)
  })
})

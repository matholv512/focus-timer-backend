import { Response } from 'express'
import { AuthRequest } from '../interfaces/auth.ts'
import { checkPrivileges } from './check-privileges.ts'
import { CustomError } from '../errors/Custom-errors.ts'
import { createUser } from '../utils/create-user.ts'

describe('check privileges', () => {
  let req: Partial<AuthRequest>
  let res: Partial<Response>
  let next: jest.Mock
  const user = createUser('2', undefined, undefined, undefined, 'user')
  const statusError = 403
  const errorMsg = 'Only administrators can perform this action.'

  beforeEach(() => {
    req = { params: {}, user }
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    next = jest.fn()
  })

  it('should return an error when parameter id is different from the logged in user id', () => {
    req.params = { id: '1' }
    checkPrivileges(req as AuthRequest, res as Response, next)

    expect(next).toHaveBeenCalledWith(expect.any(CustomError))

    const error = next.mock.calls[0][0] as CustomError
    expect(error).toBeInstanceOf(CustomError)
    expect(error.statusCode).toBe(statusError)
    expect(error.message).toBe(errorMsg)
  })

  it('should return an error when the parameter id and user id are different and the user role is not admin', () => {
    req.params = { id: '1' }
    checkPrivileges(req as AuthRequest, res as Response, next)
    expect(next).toHaveBeenCalledWith(expect.any(CustomError))
    const error = next.mock.calls[0][0] as CustomError
    expect(error.statusCode).toBe(statusError)
    expect(error.message).toBe('Only administrators can perform this action.')
  })

  it('should allow the action when parameter id and user user id are the same', () => {
    req.params = { id: '2' }
    checkPrivileges(req as AuthRequest, res as Response, next)
    expect(next).not.toHaveBeenCalledWith(expect.any(CustomError))
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('should allow the action when the user role is admin even if the parameter id and user id are not the same', () => {
    req.params = { id: '1' }
    if (req.user) {
      req.user.role = 'admin'
    }
    checkPrivileges(req as AuthRequest, res as Response, next)
    expect(next).not.toHaveBeenCalledWith(expect.any(CustomError))
    expect(next).toHaveBeenCalledTimes(1)
  })
})

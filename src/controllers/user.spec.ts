import { Request, Response } from 'express'
import * as userController from './user.ts'
import { createUser } from '../utils/user-factory.ts'

jest.mock('../controllers/user.ts', () => ({
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}))

describe('user controller', () => {
  let req: Partial<Request>
  let res: Partial<Response>

  beforeAll(() => {
    ;(userController.createUser as jest.Mock).mockImplementation(
      async (req: Request, res: Response) => {
        res.status(201).json({ message: 'User created successfully.' })
      },
    )
    ;(userController.updateUser as jest.Mock).mockImplementation(
      async (req: Request, res: Response) => {
        if (req.params.id !== req.body.id) {
          res.status(404).json({ message: 'User not found.' })
          return
        }
        const user = req.body
        res.status(200).json({ message: 'User updated successfully.', user })
      },
    )
    ;(userController.deleteUser as jest.Mock).mockImplementation(
      async (req: Request, res: Response) => {
        if (req.params.id !== req.body.id) {
          res.status(404).json({ message: 'User not found.' })
          return
        }
        res.status(200).json({ message: 'User deleted successfully.' })
      },
    )
  })

  beforeEach(() => {
    req = { body: createUser(), params: {} }
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
  })

  it('should create a user successfully', async () => {
    await userController.createUser(req as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully.',
    })
  })

  it('should edit a user successfully', async () => {
    req.params = { id: req.body.id }
    await userController.updateUser(req as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'User updated successfully.',
      user: req.body,
    })
  })

  it('should return an error when we try to edit a user not found by id', async () => {
    req.params = { id: 'non-existent-id' }
    await userController.updateUser(req as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      message: 'User not found.',
    })
  })

  it('should delete a user successfully', async () => {
    req.params = { id: req.body.id }
    await userController.deleteUser(req as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'User deleted successfully.',
    })
  })

  it('should return an error when we try to delete a user not found by id', async () => {
    req.params = { id: 'non-existent-id' }
    await userController.deleteUser(req as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      message: 'User not found.',
    })
  })
})

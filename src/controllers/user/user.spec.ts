import {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUserData,
} from './user.ts'
import * as userService from '../../services/user/user.ts'
import { Request, Response } from 'express'
import type { AuthRequest } from '../../interfaces/auth.ts'
import { createFakeUser } from '../../utils/user-factory.ts'

jest.mock('../../services/user/user.ts')

let req: Partial<AuthRequest>
let res: Partial<Response>
let mockUser: ReturnType<typeof createFakeUser>

beforeAll(() => {
  mockUser = createFakeUser()
})

beforeEach(() => {
  req = { body: {}, params: {}, user: undefined }
  res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
})

describe('user controller', () => {
  it('should create a user successfully', async () => {
    const { id, name, email, password } = mockUser

    req.body = { name, email, password }
    ;(userService.createUser as jest.Mock).mockResolvedValue({
      _id: id,
      name,
      email,
    })

    await createUser(req as Request, res as Response)

    expect(userService.createUser).toHaveBeenCalledWith({
      name,
      email,
      password,
    })
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully.',
      user: { id, name, email },
    })
  })

  it('should update a user successfully', async () => {
    const { id, name, email, password } = mockUser
    req.params = { userId: id }
    req.body = { name, email, password }
    ;(userService.updateUser as jest.Mock).mockResolvedValue({
      _id: id,
      name,
      email,
    })

    await updateUser(req as Request, res as Response)

    expect(userService.updateUser).toHaveBeenCalledWith(id, {
      email,
      name,
      password,
    })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'User updated successfully.',
      user: {
        _id: id,
        email,
        name,
      },
    })
  })

  it('should delete a user successfully', async () => {
    const { id } = mockUser
    req.params = { userId: id }

    await deleteUser(req as Request, res as Response)

    expect(userService.deleteUser).toHaveBeenCalledWith(id)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'User deleted successfully.',
    })
  })

  it('should retrieve authenticated user data sucessfully', async () => {
    const { id, name, email, role } = createFakeUser()

    req.user = { id, name, email, role }

    await getUserData(req as AuthRequest, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'User data retrieved successfully.',
      user: { id, name, email, role },
    })
  })

  it('should find a user by id successfully', async () => {
    const { id, name, email } = createFakeUser()
    req.params = { userId: id }

    const userMock = { _id: id, name, email }

    ;(userService.getUserById as jest.Mock).mockResolvedValue(userMock)

    await getUserById(req as Request, res as Response)

    expect(userService.getUserById).toHaveBeenCalledWith(id)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'User found successfully.',
      user: userMock,
    })
  })

  it('should retrieve all users successfully', async () => {
    const user1 = createFakeUser({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    })
    const user2 = createFakeUser({
      id: '2',
      name: 'Jane Doe',
      email: 'jane@example.com',
    })
    const user3 = createFakeUser({
      id: '3',
      name: 'Doe John',
      email: 'doe@example.com',
    })

    ;(userService.getAllUsers as jest.Mock).mockResolvedValue([
      user1,
      user2,
      user3,
    ])

    await getAllUsers(req as Request, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Listing all users successfully.',
      users: [user1, user2, user3],
    })
  })
})

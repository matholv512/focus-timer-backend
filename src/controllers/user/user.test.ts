import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUserData,
  updateUser,
} from './user.ts'
import request from 'supertest'
import mongoose from 'mongoose'
import express, {
  Express,
  Router,
  type Response,
  type NextFunction,
} from 'express'
import { createFakeUser } from '../../utils/user-factory.ts'
import { errorHandler } from '../../middlewares/error-handler.ts'
import type { AuthRequest } from '../../interfaces/auth.ts'
import type { UserAttrs } from '../../interfaces/user.ts'
import { validateCreateUser } from '../../middlewares/validations/user-validation.ts'
import { MONGO_URI } from '../../config/env.ts'

let app: Express
let mockUser: ReturnType<typeof createFakeUser>
let mockUserRequest: Omit<UserAttrs, 'password'> & { id: string }
const invalidId = '67eab17331f1645d8bb169aa'

const mockAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!mockUserRequest) return

  req.user = mockUserRequest
  next()
}

beforeAll(async () => {
  mockUser = createFakeUser()

  await mongoose.connect(MONGO_URI)

  app = express()

  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  const router = Router()
  router.get('/users', getAllUsers)
  router.get('/users/:userId', getUserById)
  router.get('/me', mockAuth, getUserData)
  router.post('/users', validateCreateUser, createUser)
  router.put('/users/:userId', updateUser)
  router.delete('/users/:userId', deleteUser)

  app.use(router)

  app.use(errorHandler)
})

beforeEach(async () => {
  mongoose.connection.db?.collection('users').deleteMany({})
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe('user service', () => {
  it('should create a user successfully', async () => {
    const { name, email, password } = mockUser
    const { body, status } = await request(app)
      .post('/users')
      .send({ name, email, password })

    const { id } = body.user

    expect(status).toBe(201)
    expect(body).toHaveProperty('message', 'User created successfully.')
    expect(body).toHaveProperty('user', { id, name, email })
  })

  it('should update a user successfully', async () => {
    const { name, email, password } = mockUser
    const { body, status } = await request(app)
      .post('/users')
      .send({ name, email, password })

    expect(status).toBe(201)

    const { id } = body.user

    const updatedUser = { name: 'Jane Doe', email: 'jane@example.com' }

    const response = await request(app).put(`/users/${id}`).send(updatedUser)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty(
      'message',
      'User updated successfully.',
    )
    expect(response.body).toHaveProperty('user')
    expect(response.body.user._id).toBe(id)
    expect(response.body.user.name).toBe(updatedUser.name)
    expect(response.body.user.email).toBe(updatedUser.email)
  })

  it('should delete a user successfully', async () => {
    const { name, email, password } = mockUser
    const { body, status } = await request(app)
      .post('/users')
      .send({ name, email, password })

    expect(status).toBe(201)

    const { id } = body.user

    const response = await request(app).delete(`/users/${id}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty(
      'message',
      'User deleted successfully.',
    )
  })

  it('should find a user by id successfully', async () => {
    const { name, email, password } = mockUser
    const { body, status } = await request(app)
      .post('/users')
      .send({ name, email, password })

    expect(status).toBe(201)

    const { id } = body.user

    const response = await request(app).get(`/users/${id}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message', 'User found successfully.')
    expect(response.body).toHaveProperty('user')
    expect(response.body.user._id).toBe(id)
    expect(response.body.user.name).toBe(name)
    expect(response.body.user.email).toBe(email)
  })

  it('should retrieve a list of all users successfully', async () => {
    const { name, email, password } = mockUser

    const user1Response = await request(app)
      .post('/users')
      .send({ name, email, password })

    const user2Response = await request(app)
      .post('/users')
      .send({ name: 'doe John', email: 'doe@example.com', password: '123456' })

    const user3Response = await request(app)
      .post('/users')
      .send({ name: 'Jane Doe', email: 'jane@example.com', password: '123456' })

    const { body, status } = await request(app).get('/users')

    expect(status).toBe(200)
    expect(body).toHaveProperty('users')
    expect(body.users.length).toBe(3)
    expect(body.users[0].name).toBe(user1Response.body.user.name)
    expect(body.users[0].email).toBe(user1Response.body.user.email)

    expect(body.users[1].name).toBe(user2Response.body.user.name)
    expect(body.users[1].email).toBe(user2Response.body.user.email)

    expect(body.users[2].name).toBe(user3Response.body.user.name)
    expect(body.users[2].email).toBe(user3Response.body.user.email)
  })

  it('should retrieve authenticated user data successfully', async () => {
    const { name, email, password } = mockUser
    const { body, status } = await request(app)
      .post('/users')
      .send({ name, email, password })

    expect(status).toBe(201)
    mockUserRequest = body.user

    const response = await request(app).get('/me')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty(
      'message',
      'User data retrieved successfully.',
    )
    expect(response.body).toHaveProperty('user', mockUserRequest)
  })

  it('should return an error when user is not found', async () => {
    const { body, status } = await request(app).get(`/users/${invalidId}`)

    expect(status).toBe(404)
    expect(body).toHaveProperty('message', 'User not found.')
  })

  it('should return an error when user list is empty', async () => {
    const { body, status } = await request(app).get(`/users`)

    expect(status).toBe(404)
    expect(body).toHaveProperty('message', 'No users found.')
  })

  it('should return errors when required fields are missing', async () => {
    const { name } = mockUser
    const { body, status } = await request(app).post('/users').send({ name })

    expect(status).toBe(400)
    expect(body).toHaveProperty('message', 'Validation errors occurred.')
    expect(body).toHaveProperty('errors', [
      { field: 'email', message: 'Required' },
      { field: 'password', message: 'Required' },
    ])
  })

  it('should return errors for invalid fields', async () => {
    const { body, status } = await request(app)
      .post('/users')
      .send({ name: '1', email: '', password: '' })

    expect(status).toBe(400)
    expect(body).toHaveProperty('message', 'Validation errors occurred.')
    expect(body).toHaveProperty('errors', [
      { field: 'name', message: 'Name must only have letters.' },
      { field: 'name', message: 'Name must be at least 3 characters.' },
      { field: 'email', message: 'Invalid e-mail format.' },
      { field: 'password', message: 'Password must be at least 6 characters.' },
    ])
  })
})

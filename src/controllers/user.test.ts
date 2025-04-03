import 'dotenv/config'
import mongoose from 'mongoose'
import express, { Router, Express, Response, NextFunction } from 'express'
import * as userController from './user.ts'
import request from 'supertest'
import { AuthRequest } from '../interfaces/auth.ts'
import { createUser } from '../utils/create-user.ts'
import { errorHandler } from '../middlewares/error-handler.ts'

describe('user service', () => {
  const mockAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    req.user = user
    next()
  }

  let app: Express
  let user: Omit<ReturnType<typeof createUser>, 'password'>
  const invalidId = '67eab17331f1645d8bb169aa'

  beforeAll(async () => {
    await mongoose.connect(process.env.URI_TEST)
    app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    const router = Router()
    router.get('/me', mockAuth, userController.getUserData)
    router.get('/users', userController.getAllUsers)
    router.get('/users/:id', userController.getUserById)
    router.post('/users', userController.createUser)
    router.put('/users/:id', userController.editUser)
    router.delete('/users/:id', userController.deleteUser)

    app.use(router)
    app.use(errorHandler)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  it('should create a user successfully', async () => {
    const { name, email, password } = createUser()
    const response = await request(app)
      .post('/users')
      .send({ name, email, password })
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('User created successfully.')
    user = response.body.user
  })

  it('should return data for all users', async () => {
    const { name, email, password } = createUser()
    await request(app).post('/users').send({ name, email, password })
    await request(app).post('/users').send({ name, email, password })

    const response = await request(app).get('/users')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body).toHaveProperty('users')
    expect(response.body.message).toBe('Listing all users successfully.')
    expect(response.body.users.length).toBe(3)
  })

  it('should find user by id', async () => {
    const response = await request(app).get(`/users/${user.id}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('user')
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('User found successfully.')
  })

  it('should return an error when the user is not found', async () => {
    const response = await request(app).get(`/users/${invalidId}`)
    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('User not found.')
  })

  it('should return data to the authenticated user', async () => {
    const response = await request(app).get('/me')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('user')
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Successfully Retrieving User Data.')
    expect(response.body.user).toStrictEqual(user)
  })

  it('should edit a user successfully', async () => {
    const response = await request(app)
      .put(`/users/${user.id}`)
      .send(createUser({ name: 'marcelo', email: 'marcelo@gmail.com' }))
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('user')
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('User edited successfully.')
    expect(response.body.user.name).toBe('marcelo')
    expect(response.body.user.email).toBe('marcelo@gmail.com')
  })

  it('should return an error when we try to edit a not found user', async () => {
    const response = await request(app)
      .put(`/users/${invalidId}`)
      .send(createUser({ name: 'marcelo', email: 'marcelo@gmail.com' }))

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('User not found.')
  })

  it('should delete a user successfully', async () => {
    const response = await request(app).delete(`/users/${user.id}`)
    expect(response.body).toHaveProperty('message')
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('User deleted successfully.')
  })

  it('should return an error when we try to delete a not found user', async () => {
    const response = await request(app).delete(`/users/${invalidId}`)
    expect(response.body).toHaveProperty('message')
    expect(response.status).toBe(404)
    expect(response.body.message).toBe('User not found.')
  })
})

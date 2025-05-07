import 'dotenv/config'
import mongoose from 'mongoose'
import express, { Express, Router } from 'express'
import { login, logout } from './auth.ts'
import * as userController from '../user/user.ts'
import { errorHandler } from '../../middlewares/error-handler.ts'
import request from 'supertest'
import { createFakeUser } from '../../utils/user-factory.ts'
import { verifyToken } from '../../utils/verify-token.ts'

describe('auth service', () => {
  let app: Express

  beforeAll(async () => {
    await mongoose.connect(process.env.URI_TEST)

    app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    const router = Router()
    router.post('/users', userController.createUser)
    router.post('/auth', login)
    router.delete('/auth', logout)
    app.use(router)

    app.use(errorHandler)
  })

  beforeEach(async () => {
    await mongoose.connection.db?.collection('users').deleteMany({})
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  it('should authenticate a registered user', async () => {
    const { name, email, password } = createFakeUser()
    await request(app).post('/users').send({ name, email, password })

    const response = await request(app).post('/auth').send({ email, password })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message', 'Successfully logged in.')

    const token = response.headers['set-cookie'][0]
      .split('token=')[1]
      .split(';')[0]

    expect(verifyToken(token)).toMatchObject({
      email: expect.any(String),
      exp: expect.any(Number),
      iat: expect.any(Number),
      id: expect.any(String),
      name: expect.any(String),
      role: expect.any(String),
    })
  })

  it('should return an error for an unregistered user', async () => {
    const response = await request(app)
      .post('/auth')
      .send({ email: 'user@example.com', password: '123456' })

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty(
      'message',
      'Invalid e-mail or password.',
    )
    expect(response.headers).not.toHaveProperty('set-cookie')
  })

  it('should return an error for incorrect password', async () => {
    const { name, email, password } = createFakeUser()
    await request(app).post('/users').send({ name, email, password })

    const response = await request(app)
      .post('/auth')
      .send({ email, password: '218941874' })

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty(
      'message',
      'Invalid e-mail or password.',
    )
    expect(response.headers).not.toHaveProperty('set-cookie')
  })

  it('should clear cookie on logout', async () => {
    const { name, email, password } = createFakeUser()
    await request(app).post('/users').send({ name, email, password })

    const loginResponse = await request(app)
      .post('/auth')
      .send({ email, password })
    expect(loginResponse.headers).toHaveProperty('set-cookie')

    const logoutResponse = await request(app).delete('/auth')
    expect(logoutResponse.status).toBe(200)
    expect(logoutResponse.body).toHaveProperty(
      'message',
      'Successfully logged out.',
    )
    expect(logoutResponse.headers).toHaveProperty('set-cookie')

    const isEmptyToken =
      logoutResponse.headers['set-cookie'][0].includes('token=;')
    expect(isEmptyToken).toBe(true)
  })
})

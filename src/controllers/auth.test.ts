import 'dotenv/config'
import mongoose from 'mongoose'
import express, { Express, Router } from 'express'
import { login, logout } from './auth.ts'
import * as userController from '../controllers/user.ts'
import { errorHandler } from '../middlewares/error-handler.ts'
import request from 'supertest'
import { createUser } from '../utils/create-user.ts'
import { verifyToken } from '../utils/verify-token.ts'

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

    await request(app).post('/users').send(createUser())
  })

  beforeEach(async () => {
    await mongoose.connection.db?.collection('users').deleteMany({})
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  it('should authenticate a valid user', async () => {
    const { name, email, password } = createUser()
    await request(app).post('/users').send({ name, email, password })

    const response = await request(app).post('/auth').send({ email, password })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Successfully logged in.')
    expect(response.headers).toHaveProperty('set-cookie')
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

  it('should return an error when we try to authenticate an unregistered user', async () => {
    const response = await request(app)
      .post('/auth')
      .send({ email: 'carlos888@gmail.com', password: '123456' })

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Invalid e-mail or password.')
    expect(response.headers).not.toHaveProperty('set-cookie')
  })

  it('should return an error when we try to authenticate a user with an wrong password', async () => {
    const { email } = createUser()
    const response = await request(app)
      .post('/auth')
      .send({ email, password: '218941874' })

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Invalid e-mail or password.')
    expect(response.headers).not.toHaveProperty('set-cookie')
  })

  it('should disconnect a logged in user', async () => {
    const { name, email, password } = createUser()
    await request(app).post('/users').send({ name, email, password })

    const loginResponse = await request(app)
      .post('/auth')
      .send({ email, password })
    expect(loginResponse.headers).toHaveProperty('set-cookie')

    const logoutResponse = await request(app).delete('/auth')
    expect(logoutResponse.status).toBe(200)
    expect(logoutResponse.body).toHaveProperty('message')
    expect(logoutResponse.body.message).toBe('Successfully logged out.')
    expect(logoutResponse.headers).toHaveProperty('set-cookie')

    const isEmptyToken =
      logoutResponse.headers['set-cookie'][0].includes('token=;')
    expect(isEmptyToken).toBe(true)
  })
})

import express, { Request, Response, Router } from 'express'
import request from 'supertest'
import { limiter, speedLimiter } from './rate-limiter.ts'

const controller = (req: Request, res: Response) => {
  res.status(200).send('ok')
}

describe('rate limiter', () => {
  const limitUrl = '/limit'
  const speedLimitUrl = '/speed-limit'
  const requestLimit = 10
  const delayAfter = 5
  const windowMs = 3000
  const delayMs = 100
  const variationMs = 20
  const delay = delayMs + variationMs

  const app = express()
  app.use(express.json())
  const router = Router()
  router.get(limitUrl, limiter, controller)
  router.get(speedLimitUrl, speedLimiter, controller)
  app.use(router)

  it('should allow requests below the limit', async () => {
    for (let i = 0; i < requestLimit; i++) {
      const response = await request(app).get(limitUrl)
      expect(response.status).toBe(200)
      expect(response.text).toBe('ok')
    }
  })

  it('should return an error when the request limit is reached', async () => {
    for (let i = 0; i < requestLimit; i++) {
      await request(app).get(limitUrl)
    }

    const blockedRequest = await request(app).get(limitUrl)
    expect(blockedRequest.status).toBe(429)
    expect(blockedRequest.body.message).toBe(
      'Too many requests, please try again later.',
    )
  })

  it('should increase the delay after each request after the speed limit', async () => {
    for (let i = 0; i < delayAfter; i++) {
      await request(app).get(speedLimitUrl)
    }

    const times: number[] = []

    for (let i = 0; i < 5; i++) {
      const startTime = Date.now()
      await request(app).get(speedLimitUrl)
      const endTime = Date.now()
      const duration = endTime - startTime
      times.push(duration)
    }

    for (let i = 1; i < times.length; i++) {
      expect(times[i - 1] + delay).toBeGreaterThanOrEqual(times[i])
    }
  })

  it('should reset the delay after the window time has passed', async () => {
    for (let i = 0; i < requestLimit; i++) {
      await request(app).get(limitUrl)
    }

    const blockedRequest = await request(app).get(limitUrl)
    expect(blockedRequest.status).toBe(429)

    await new Promise((resolve) => setTimeout(resolve, windowMs))

    const responseAfterReset = await request(app).get(limitUrl)
    expect(responseAfterReset.status).toBe(200)
  })
})

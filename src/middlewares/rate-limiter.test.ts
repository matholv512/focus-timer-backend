import express, { Request, Response, Router, Express } from 'express'
import request from 'supertest'
import { limiter, speedLimiter } from './rate-limiter.ts'
import { sleep } from '../utils/sleep.ts'

const controllerMock = (req: Request, res: Response) => {
  res.status(200).json({ message: 'ok' })
}

describe('rate limiter', () => {
  const limiterConfig = {
    url: '/limit',
    windowMs: 3000,
    limit: 5,
  }

  const speedLimiterConfig = {
    url: '/speed-limit',
    windowMs: 3000,
    delayAfter: 3,
    delayMs: 100,
    maxDelayMs: 1000,
  }

  const tolerance = 20
  const extraRequests = 5
  const maxRequests =
    speedLimiterConfig.delayAfter +
    extraRequests +
    Math.ceil(speedLimiterConfig.maxDelayMs / speedLimiterConfig.delayMs)

  let app: Express

  beforeAll(() => {
    app = express()
    app.use(express.json())
    const router = Router()
    router.get(limiterConfig.url, limiter, controllerMock)
    router.get(speedLimiterConfig.url, speedLimiter, controllerMock)
    app.use(router)
  })

  describe('limiter', () => {
    it('should allow requests below the limit', async () => {
      for (let i = 0; i < limiterConfig.limit; i++) {
        const { body, status } = await request(app).get(limiterConfig.url)
        expect(status).toBe(200)
        expect(body).toHaveProperty('message', 'ok')
      }
    })

    it('should return an error when the request limit is reached', async () => {
      for (let i = 0; i < limiterConfig.limit; i++) {
        await request(app).get(limiterConfig.url)
      }
      const { body, status } = await request(app).get(limiterConfig.url)
      expect(status).toBe(429)
      expect(body).toHaveProperty(
        'message',
        'Too many requests, please try again later.',
      )
    })

    it('should reset the delay after the window time has passed', async () => {
      for (let i = 0; i < limiterConfig.limit + 1; i++) {
        await request(app).get(limiterConfig.url)
      }

      await sleep(limiterConfig.windowMs)

      const { body, status } = await request(app).get(limiterConfig.url)
      expect(status).toBe(200)
      expect(body).toHaveProperty('message', 'ok')
    })
  })
  describe('speed limiter', () => {
    it('should increase the delay after each request after the limit', async () => {
      const delays: number[] = []

      for (let i = 0; i < speedLimiterConfig.delayAfter + extraRequests; i++) {
        const start = Date.now()
        const { status } = await request(app).get(speedLimiterConfig.url)
        const duration = Date.now() - start
        expect(status).toBe(200)

        if (i >= speedLimiterConfig.delayAfter) {
          delays.push(duration)
        }
      }

      for (let i = 0; i < delays.length; i++) {
        const expected =
          (speedLimiterConfig.delayAfter + i + 1) * speedLimiterConfig.delayMs
        expect(delays[i]).toBeGreaterThanOrEqual(expected - tolerance)
      }
    })

    it('should not exceed max delay', async () => {
      for (let i = 0; i < maxRequests; i++) {
        const start = Date.now()
        const { status } = await request(app).get(speedLimiterConfig.url)
        const duration = Date.now() - start
        expect(status).toBe(200)

        if (i >= speedLimiterConfig.delayAfter) {
          expect(duration).toBeLessThanOrEqual(
            speedLimiterConfig.maxDelayMs + tolerance,
          )
        }
      }
    }, 20000)

    it('should reset the delay after the window time has passed', async () => {
      for (let i = 0; i < speedLimiterConfig.delayAfter + 3; i++) {
        await request(app).get(speedLimiterConfig.url)
      }

      await sleep(speedLimiterConfig.windowMs)

      const start = Date.now()
      const { status } = await request(app).get(speedLimiterConfig.url)
      const duration = Date.now() - start
      expect(status).toBe(200)
      expect(duration).toBeLessThan(speedLimiterConfig.delayMs + tolerance)
    }, 20000)
  })
})

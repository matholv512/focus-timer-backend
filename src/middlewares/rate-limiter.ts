import { slowDown } from 'express-slow-down'
import { rateLimit } from 'express-rate-limit'
import { Request, Response } from 'express'
import { isTest } from '../config/env.ts'

export const speedLimiter = slowDown({
  windowMs: isTest ? 3000 : 1000 * 60 * 15,
  delayAfter: isTest ? 3 : 5,
  delayMs: (hits) => (isTest ? hits * 100 : hits * 400),
  maxDelayMs: isTest ? 1000 : 5000,
})

export const limiter = rateLimit({
  windowMs: isTest ? 3000 : 1000 * 60 * 15,
  limit: isTest ? 5 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res
      .status(429)
      .json({ message: 'Too many requests, please try again later.' })
  },
})

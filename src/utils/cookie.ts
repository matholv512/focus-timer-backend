import 'dotenv/config'
import { Response } from 'express'
import { isProd } from '../config/env.ts'

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: isProd ? 'none' : 'lax',
    secure: !!isProd,
  })
}

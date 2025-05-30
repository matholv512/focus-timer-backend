import 'dotenv/config'
import { Response } from 'express'

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: 'strict',
    secure: true,
  })
}

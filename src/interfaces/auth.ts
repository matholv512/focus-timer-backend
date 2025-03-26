import { Request } from 'express'

export interface Auth {
  email: string
  password: string
}

export interface UserRequest {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

export interface AuthRequest extends Request {
  user?: UserRequest
}

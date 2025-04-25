import { Request } from 'express'
import { TaskDoc } from './task.ts'

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
  task?: TaskDoc
}

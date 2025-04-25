import { Document } from 'mongoose'

export interface UserAttrs {
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
}

export type CreateUserPayload = Omit<UserAttrs, 'role'>

export type UpdateUserPayload = Omit<UserAttrs, 'role' | 'password'> & {
  password?: string
}

export type UserDoc = Document & UserAttrs

export interface FakeUser extends UserAttrs {
  id: string
}

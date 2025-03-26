import { Schema, model } from 'mongoose'
import { UserInterface } from '../interfaces/user.ts'

const userSchema = new Schema<UserInterface>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'user' },
  },
  { timestamps: true },
)

export const User = model<UserInterface>('User', userSchema)

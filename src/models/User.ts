import { Schema, model } from 'mongoose'
import { UserDoc } from '../interfaces/user.ts'

const userSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'user' },
  },
  { timestamps: true },
)

export const User = model<UserDoc>('User', userSchema)

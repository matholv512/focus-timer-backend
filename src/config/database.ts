import mongoose from 'mongoose'
import { MONGO_URI } from './env.ts'
const uri = MONGO_URI

export const connectDB = async () => {
  try {
    await mongoose.connect(uri)

    console.log('MongoDB connected!')
  } catch (error) {
    console.log('MongoDB connection Error!')
    throw error
  }
}

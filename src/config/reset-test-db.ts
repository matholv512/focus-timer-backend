import mongoose from 'mongoose'
import { MONGO_URI } from './env.ts'

const uri = MONGO_URI

export const clearDatabase = async () => {
  await mongoose.connect(uri)
  await mongoose.connection.dropDatabase()
  console.log('Test database reset successfully')
  await mongoose.disconnect()
}

clearDatabase()

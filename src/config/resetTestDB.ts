import mongoose from 'mongoose'
import 'dotenv/config'

const uri = process.env.URI_TEST

const clearDatabase = async () => {
  await mongoose.connect(uri)
  await mongoose.connection.dropDatabase()
  console.log('Test database reset successfully')
  await mongoose.disconnect()
}

clearDatabase()

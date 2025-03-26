import mongoose from 'mongoose'
const uri = process.env.URI

export const connectDB = async () => {
  try {
    await mongoose.connect(uri)

    console.log('MongoDB connected!')
  } catch (error) {
    console.log('MongoDB connection Error!')
    throw error
  }
}

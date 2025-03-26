import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/database.ts'
import { router } from './routes/index.ts'
import { errorHandler } from './middlewares/error-handler.ts'

const app = express()
const port = process.env.PORT

connectDB()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(router)

app.use(errorHandler)
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

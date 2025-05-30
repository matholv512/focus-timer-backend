import 'dotenv/config'
import { InternalServerError } from '../errors/custom-errors.ts'

const getEnv = (name: string) => {
  const env = process.env[name]
  if (!env) {
    throw new InternalServerError(`Missing environment variable: ${name}`)
  }
  return env
}

const NODE_ENV = process.env.NODE_ENV
const isProd = NODE_ENV === 'production'
const isDev = NODE_ENV === 'development'
const isTest = NODE_ENV === 'test'

const MONGO_URI = isProd ? getEnv('URI') : getEnv('URI_TEST')

export { isProd, isDev, isTest, MONGO_URI }

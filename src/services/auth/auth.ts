import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { User } from '../../models/User.ts'
import { UnauthorizedError } from '../../errors/custom-errors.ts'
import { compareHashes } from '../../utils/hash.ts'

export const createToken = (user: {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
}) => {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  )
}

export const authenticateUser = async (email: string, password: string) => {
  const user = await User.findOne({ email })

  const verifyPass = await compareHashes(password, user?.password)

  if (!user || !verifyPass) {
    throw new UnauthorizedError('Invalid e-mail or password.')
  }

  return createToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
}

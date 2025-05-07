import { User } from '../../models/User.ts'
import { UnauthorizedError } from '../../errors/custom-errors.ts'
import { compareHashes } from '../../utils/hash.ts'
import { createToken } from '../../utils/create-token.ts'

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

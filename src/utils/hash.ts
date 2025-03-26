import { genSalt, hash, compare } from 'bcrypt'

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10)
  return await hash(password, salt)
}

export const compareHashes = async (
  password: string,
  hashed: string | undefined,
): Promise<boolean> => {
  if (!hashed) return false
  return await compare(password, hashed)
}

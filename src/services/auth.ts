import jwt from 'jsonwebtoken'

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

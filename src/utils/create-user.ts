export const createUser = (
  id: string = '1',
  name: string = 'José Silva',
  email: string = 'jose@gmail.com',
  password: string = '123456',
  role: 'user' | 'admin' = 'user',
) => {
  return { id, name, email, password, role }
}

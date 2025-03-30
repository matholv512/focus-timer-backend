import { UserInterface } from '../interfaces/user.ts'

export const createUser = ({
  id = '1',
  name = 'José Silva',
  email = 'jose@gmail.com',
  password = '123456',
  role = 'user',
}: Partial<UserInterface> = {}) => ({ id, name, email, password, role })

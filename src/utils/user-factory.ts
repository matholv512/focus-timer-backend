import { FakeUser } from '../interfaces/user.ts'

export const createFakeUser = ({
  id = '1',
  name = 'John Doe',
  email = 'john@example.com',
  password = '123456',
  role = 'user',
}: Partial<FakeUser> = {}) => ({ id, name, email, password, role })

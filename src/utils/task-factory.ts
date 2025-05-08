import type { FakeTask } from '../interfaces/task.ts'
import { Types } from 'mongoose'

export const createFakeTask = ({
  id = new Types.ObjectId(),
  title = 'title',
  completed = false,
  description = 'description',
  userId = new Types.ObjectId(),
}: Partial<FakeTask> = {}) => ({ id, title, description, completed, userId })

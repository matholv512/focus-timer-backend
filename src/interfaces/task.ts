import mongoose, { Document, type Types } from 'mongoose'

export interface TaskAttrs {
  title: string
  description?: string
  completed: boolean
  userId: mongoose.Types.ObjectId
}

export type CreateTaskPayload = Partial<
  Omit<TaskAttrs, 'userId' | 'completed'>
> & { userId?: string }

export type UpdateTaskPayload = Partial<Omit<TaskAttrs, 'userId' | 'title'>> & {
  title: string
}

export type TaskDoc = Document & TaskAttrs

export type FakeTask = TaskAttrs & {
  id: Types.ObjectId
}

import { NotFoundError } from '../../errors/custom-errors.ts'
import {
  CreateTaskPayload,
  TaskDoc,
  UpdateTaskPayload,
} from '../../interfaces/task.ts'
import { Task } from '../../models/Task.ts'

export const getTaskById = async (taskId: string): Promise<TaskDoc> => {
  const task = await Task.findById(taskId)

  if (!task) {
    throw new NotFoundError('Task not found.')
  }

  return task
}

export const getTasksByUser = async (userId: string): Promise<TaskDoc[]> => {
  const tasks = await Task.find({ userId })

  if (!tasks.length) {
    throw new NotFoundError('No tasks found.')
  }

  return tasks
}

export const createTask = async ({
  title,
  description,
  userId,
}: CreateTaskPayload): Promise<TaskDoc> => {
  return await Task.create({ title, description, userId })
}

export const updateTask = async (
  task: TaskDoc,
  { title, description, completed = false }: UpdateTaskPayload,
): Promise<TaskDoc> => {
  task.title = title
  task.description = description
  task.completed = completed
  return await task.save()
}

export const deleteTask = async (task: TaskDoc): Promise<void> => {
  return await task.deleteOne()
}

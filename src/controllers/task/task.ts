import { Request, Response } from 'express'
import { CreateTaskPayload, UpdateTaskPayload } from '../../interfaces/task.ts'
import * as taskService from '../../services/task/task.ts'
import { AuthRequest } from '../../interfaces/auth.ts'
import { assertExists } from '../../utils/assert-exists.ts'

export const getTasksByUser = async (req: Request, res: Response) => {
  const { userId } = req.params

  const tasks = await taskService.getTasksByUser(userId)

  res.status(200).json({ message: 'Tasks retrieved successfully.', tasks })
}

export const createTask = async (req: Request, res: Response) => {
  const { userId } = req.params
  const { title, description }: CreateTaskPayload = req.body

  const task = await taskService.createTask({ title, description, userId })

  res.status(201).json({ message: 'Task created successfully.', task })
}

export const updateTask = async (req: AuthRequest, res: Response) => {
  const payload: UpdateTaskPayload = req.body

  assertExists(req.task, 'Task')

  const updatedTask = await taskService.updateTask(req.task, payload)

  res
    .status(200)
    .json({ message: 'Task updated successfully.', task: updatedTask })
}

export const deleteTask = async (req: AuthRequest, res: Response) => {
  assertExists(req.task, 'Task')

  await taskService.deleteTask(req.task)

  res.status(200).json({ message: 'Task deleted successfully.' })
}

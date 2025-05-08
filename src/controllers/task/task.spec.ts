import { Request, Response } from 'express'
import { createTask, deleteTask, getTasksByUser, updateTask } from './task.ts'
import type { AuthRequest } from '../../interfaces/auth.ts'
import * as taskService from '../../services/task/task.ts'
import { createFakeTask } from '../../utils/task-factory.ts'
import type {
  CreateTaskPayload,
  TaskDoc,
  UpdateTaskPayload,
} from '../../interfaces/task.ts'

jest.mock('../../services/task/task.ts')

type MockedAuthRequest = Omit<Partial<AuthRequest>, 'task'> & {
  task: Partial<TaskDoc> | undefined
  params: Record<string, string>
}

describe('task controller', () => {
  let req: MockedAuthRequest
  let res: Partial<Response>
  let task: ReturnType<typeof createFakeTask>
  let secondTask: ReturnType<typeof createFakeTask>
  let createTaskPayload: CreateTaskPayload
  let updateTaskPayload: UpdateTaskPayload
  const mockedService = taskService as jest.Mocked<typeof taskService>

  beforeAll(() => {
    task = createFakeTask()
    secondTask = createFakeTask({ title: 'task2' })
    createTaskPayload = {
      title: task.title,
      description: task.description,
      userId: task.userId.toString(),
    }

    updateTaskPayload = {
      title: 'task updated',
      description: task.description,
      completed: task.completed,
    }
  })

  beforeEach(() => {
    req = { body: {}, task: {}, params: {} }
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
  })

  it('should create a task successfully', async () => {
    req.params.userId = task.userId.toString()
    req.body = createTaskPayload

    mockedService.createTask.mockResolvedValue(task as TaskDoc)

    await createTask(req as Request, res as Response)

    expect(taskService.createTask).toHaveBeenCalledWith(createTaskPayload)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Task created successfully.',
      task,
    })
  })

  it('should update a task successfully', async () => {
    req.body = updateTaskPayload
    req.task = { ...task }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { title, ...rest } = req.task
    const updatedTask = { ...updateTaskPayload, ...rest }

    mockedService.updateTask.mockResolvedValue(updatedTask as TaskDoc)

    await updateTask(req as AuthRequest, res as Response)

    expect(taskService.updateTask).toHaveBeenCalledWith(
      req.task,
      updateTaskPayload,
    )
    expect(res.status).toHaveBeenCalledWith(200)

    expect(res.json).toHaveBeenCalledWith({
      message: 'Task updated successfully.',
      task: updatedTask,
    })
  })

  it('should delete a task successfully', async () => {
    req.task = { ...task }
    mockedService.deleteTask.mockResolvedValue(undefined)

    await deleteTask(req as AuthRequest, res as Response)

    expect(taskService.deleteTask).toHaveBeenCalledWith(req.task)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Task deleted successfully.',
    })
  })

  it('should retrieve all tasks by user successfully', async () => {
    const userId = task.userId.toString()
    req.params.userId = userId

    const taskList = [task, secondTask]

    mockedService.getTasksByUser.mockResolvedValue(taskList as TaskDoc[])
    await getTasksByUser(req as Request, res as Response)

    expect(taskService.getTasksByUser).toHaveBeenCalledWith(userId)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Tasks retrieved successfully.',
      tasks: taskList,
    })
  })
})

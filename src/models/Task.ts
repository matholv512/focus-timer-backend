import mongoose, { Schema, model } from 'mongoose'
import { TaskDoc } from '../interfaces/task.ts'

const taskSchema = new Schema<TaskDoc>(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    completed: { type: Boolean, required: true, default: false },
    userId: { type: mongoose.SchemaTypes.ObjectId, required: true },
  },
  { timestamps: true },
)

export const Task = model<TaskDoc>('Task', taskSchema)

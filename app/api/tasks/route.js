// GET /api/tasks - Fetch all tasks
// Falls back to empty array if MongoDB is not configured (for demo mode)

import { getTasks } from '@/lib/mongodb'

export async function GET() {
  try {
    const tasks = await getTasks()
    return Response.json(tasks)
  } catch (err) {
    // Return empty array if MongoDB not configured
    // This allows the app to work in demo mode
    if (err.message.includes('MONGODB_URI')) {
      console.warn('MongoDB not configured - using demo mode')
      return Response.json([])
    }
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/tasks - Create a new task

import { createTask as createTaskDB } from '@/lib/mongodb'

export async function POST(request) {
  try {
    const taskData = await request.json()
    const result = await createTaskDB(taskData)
    return Response.json(
      { ...taskData, _id: result.insertedId },
      { status: 201 }
    )
  } catch (err) {
    if (err.message.includes('MONGODB_URI')) {
      console.warn('MongoDB not configured - skipping save')
      return Response.json(taskData, { status: 201 })
    }
    return Response.json({ error: err.message }, { status: 500 })
  }
}

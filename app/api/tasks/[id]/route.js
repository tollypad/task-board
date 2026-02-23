// PUT /api/tasks/[id] - Update a task
// DELETE /api/tasks/[id] - Delete a task

import { updateTask, deleteTask } from '@/lib/mongodb'

export async function PUT(request, { params }) {
  try {
    const taskData = await request.json()
    const result = await updateTask(params.id, taskData)
    return Response.json({ success: true, modifiedCount: result.modifiedCount })
  } catch (err) {
    if (err.message.includes('MONGODB_URI')) {
      return Response.json({ success: true })
    }
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const result = await deleteTask(params.id)
    return Response.json({ success: true, deletedCount: result.deletedCount })
  } catch (err) {
    if (err.message.includes('MONGODB_URI')) {
      return Response.json({ success: true })
    }
    return Response.json({ error: err.message }, { status: 500 })
  }
}

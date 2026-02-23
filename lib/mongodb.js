// MongoDB connection helper
// Install: npm install mongodb

import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
let client = null
let db = null

async function connectDB() {
  if (db) return db

  if (!uri) {
    throw new Error('MONGODB_URI env var is not defined')
  }

  try {
    client = new MongoClient(uri)
    await client.connect()
    db = client.db('task-board')
    console.log('✓ MongoDB connected')
    return db
  } catch (err) {
    console.error('✗ MongoDB connection failed:', err.message)
    throw err
  }
}

export async function getTasks() {
  const database = await connectDB()
  const tasks = await database.collection('tasks').find({}).toArray()
  return tasks
}

export async function createTask(taskData) {
  const database = await connectDB()
  const result = await database.collection('tasks').insertOne(taskData)
  return result
}

export async function updateTask(taskId, updates) {
  const database = await connectDB()
  const { ObjectId } = require('mongodb')
  const result = await database
    .collection('tasks')
    .updateOne({ _id: new ObjectId(taskId) }, { $set: updates })
  return result
}

export async function deleteTask(taskId) {
  const database = await connectDB()
  const { ObjectId } = require('mongodb')
  const result = await database
    .collection('tasks')
    .deleteOne({ _id: new ObjectId(taskId) })
  return result
}

export async function deleteAllTasks() {
  const database = await connectDB()
  const result = await database.collection('tasks').deleteMany({})
  return result
}

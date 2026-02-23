// Data structure and utilities for task management
// This file handles all task state and local storage persistence

export const COLUMNS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  REVIEW: 'review',
  DONE: 'done',
}

export const COLUMN_TITLES = {
  [COLUMNS.TODO]: '📋 To Do',
  [COLUMNS.IN_PROGRESS]: '🚀 In Progress',
  [COLUMNS.REVIEW]: '👀 Review',
  [COLUMNS.DONE]: '✅ Done',
}

export const COLUMN_ORDER = [
  COLUMNS.TODO,
  COLUMNS.IN_PROGRESS,
  COLUMNS.REVIEW,
  COLUMNS.DONE,
]

// Generate unique ID for tasks
export const generateId = () => {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Get all tasks organized by column
export const getTasksByColumn = (tasks) => {
  const grouped = {}
  COLUMN_ORDER.forEach((col) => {
    grouped[col] = tasks.filter((task) => task.column === col)
  })
  return grouped
}

// Find a task by ID
export const findTask = (tasks, taskId) => {
  return tasks.find((task) => task.id === taskId)
}

// Move task to different column
export const moveTask = (tasks, taskId, newColumn, newIndex = null) => {
  const taskIndex = tasks.findIndex((t) => t.id === taskId)
  if (taskIndex === -1) return tasks

  const newTasks = [...tasks]
  const [movedTask] = newTasks.splice(taskIndex, 1)
  movedTask.column = newColumn

  if (newIndex !== null) {
    newTasks.splice(newIndex, 0, movedTask)
  } else {
    newTasks.push(movedTask)
  }

  return newTasks
}

// Create new task
export const createTask = (title, column = COLUMNS.TODO) => {
  return {
    id: generateId(),
    title,
    column,
    description: '',
    priority: 'medium', // low, medium, high
    dueDate: null,
    createdAt: new Date().toISOString(),
  }
}

// Update task properties
export const updateTask = (tasks, taskId, updates) => {
  return tasks.map((task) =>
    task.id === taskId ? { ...task, ...updates } : task
  )
}

// Delete task
export const deleteTask = (tasks, taskId) => {
  return tasks.filter((task) => task.id !== taskId)
}

// Local storage helpers
const STORAGE_KEY = 'task-board-tasks'

export const saveToLocalStorage = (tasks) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }
}

export const loadFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch (err) {
      console.error('Failed to load tasks from storage:', err)
      return null
    }
  }
  return null
}

// Default sample tasks for first-time users
export const DEFAULT_TASKS = [
  createTask('Design new landing page', COLUMNS.IN_PROGRESS),
  createTask('Fix login bug', COLUMNS.IN_PROGRESS),
  createTask('Write API documentation', COLUMNS.TODO),
  createTask('Code review for PR #42', COLUMNS.REVIEW),
  createTask('Deploy to production', COLUMNS.DONE),
  createTask('Update dependencies', COLUMNS.TODO),
]

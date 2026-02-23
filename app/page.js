'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Column from '@/components/Column';
import TaskModal from '@/components/TaskModal';
import {
  COLUMNS,
  COLUMN_TITLES,
  COLUMN_ORDER,
  getTasksByColumn,
  moveTask,
  createTask,
  updateTask,
  deleteTask,
  saveToLocalStorage,
  loadFromLocalStorage,
  DEFAULT_TASKS,
} from '@/lib/tasks';
import { Menu, MoreVertical, Database, AlertCircle } from 'lucide-react';

export default function Board() {
  const [tasks, setTasks] = useState([])
  const [modalState, setModalState] = useState({
    isOpen: false,
    task: null,
    isNewTask: false,
    targetColumn: null,
  })
  const [showMenu, setShowMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [usesMongoDB, setUsesMongoDB] = useState(false)

  // Load tasks on mount (from API if available, fallback to localStorage)
  useEffect(() => {
    async function loadTasks() {
      setIsLoading(true)
      try {
        const response = await fetch('/api/tasks')
        if (response.ok) {
          const apiTasks = await response.json()
          if (apiTasks.length > 0) {
            setTasks(apiTasks)
            setUsesMongoDB(true)
            return
          }
        }
      } catch (err) {
        console.log('API not available, using localStorage')
      }

      // Fallback to localStorage
      const storedTasks = loadFromLocalStorage()
      if (storedTasks && storedTasks.length > 0) {
        setTasks(storedTasks)
      } else {
        setTasks(DEFAULT_TASKS)
        saveToLocalStorage(DEFAULT_TASKS)
      }
      setIsLoading(false)
    }

    loadTasks()
  }, [])

  // Save to storage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      saveToLocalStorage(tasks)
    }
  }, [tasks])

  const tasksByColumn = getTasksByColumn(tasks)

  // Handle adding a new task
  const handleAddTask = (columnId) => {
    setModalState({
      isOpen: true,
      task: null,
      isNewTask: true,
      targetColumn: columnId,
    })
  }

  // Handle editing a task
  const handleEditTask = (task) => {
    setModalState({
      isOpen: true,
      task,
      isNewTask: false,
      targetColumn: task.column,
    })
  }

  // Handle saving task (create or update)
  const handleSaveTask = async (formData) => {
    if (modalState.isNewTask) {
      // Create new task
      const newTask = createTask(
        formData.title,
        modalState.targetColumn
      )
      newTask.description = formData.description
      newTask.priority = formData.priority
      newTask.dueDate = formData.dueDate

      try {
        await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask),
        })
      } catch (err) {
        console.log('Could not sync with MongoDB')
      }

      setTasks([...tasks, newTask])
    } else {
      // Update existing task
      try {
        await fetch(`/api/tasks/${modalState.task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
      } catch (err) {
        console.log('Could not sync with MongoDB')
      }

      const updatedTasks = updateTask(tasks, modalState.task.id, formData)
      setTasks(updatedTasks)
    }
    setModalState({ isOpen: false, task: null, isNewTask: false, targetColumn: null })
  }

  // Handle deleting a task
  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
    } catch (err) {
      console.log('Could not sync with MongoDB')
    }
    setTasks(deleteTask(tasks, taskId))
  }

  // Handle drag and drop
  const handleDropTask = (taskId, targetColumnId) => {
    const newTasks = moveTask(tasks, taskId, targetColumnId)
    setTasks(newTasks)
  }

  // Handle clear all tasks
  const handleClearAll = () => {
    if (confirm('Clear all tasks? This cannot be undone.')) {
      setTasks([])
    }
  }

  // Handle reset to defaults
  const handleReset = () => {
    if (confirm('Reset to default tasks?')) {
      setTasks(DEFAULT_TASKS)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 border-2 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"
          />
          <p className="text-neutral-600">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50 to-neutral-50">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-30"
      >
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-lg">
                ✓
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">Task Board</h1>
              </div>
            </div>
            <p className="text-sm text-neutral-600 ml-1">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} • {usesMongoDB ? '✓ MongoDB' : '📱 Local Storage'}
            </p>
          </div>

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              title="Menu"
            >
              <MoreVertical className="w-5 h-5 text-neutral-600" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden z-40"
              >
                <button
                  onClick={() => {
                    handleReset()
                    setShowMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  Reset to defaults
                </button>
                <button
                  onClick={() => {
                    handleClearAll()
                    setShowMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-neutral-200"
                >
                  Clear all tasks
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Info Banner */}
        {!usesMongoDB && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-2 bg-blue-50 border-t border-blue-200 flex items-center gap-2 text-xs text-blue-700"
          >
            <AlertCircle className="w-4 h-4" />
            <span>
              Running in <strong>demo mode</strong> with local storage. Add <code className="bg-blue-100 px-1 rounded">MONGODB_URI</code> to .env.local for cloud persistence.
            </span>
          </motion.div>
        )}
      </motion.header>

      {/* Board */}
      <main className="p-6">
        <motion.div
          className="flex gap-6 overflow-x-auto pb-4"
          layout
        >
          {COLUMN_ORDER.map((columnId) => (
            <Column
              key={columnId}
              columnId={columnId}
              columnTitle={COLUMN_TITLES[columnId]}
              tasks={tasksByColumn[columnId]}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
              onDropTask={handleDropTask}
            />
          ))}
        </motion.div>
      </main>

      {/* Task Modal */}
      <TaskModal
        task={modalState.task}
        isOpen={modalState.isOpen}
        onClose={() =>
          setModalState({ isOpen: false, task: null, isNewTask: false, targetColumn: null })
        }
        onSave={handleSaveTask}
        isNewTask={modalState.isNewTask}
      />
    </div>
  )
}

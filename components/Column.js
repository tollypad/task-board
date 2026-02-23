'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import { COLUMN_TITLES } from '@/lib/tasks';

export default function Column({
  columnId,
  columnTitle,
  tasks,
  onAddTask,
  onDeleteTask,
  onEditTask,
  onDropTask,
  isDragOver,
}) {
  return (
    <motion.div
      className="flex flex-col flex-shrink-0 w-80 max-h-[calc(100vh-200px)] bg-white rounded-xl border border-neutral-200 shadow-sm-modern overflow-hidden"
      layout
    >
      {/* Column Header */}
      <div className="px-5 py-4 border-b border-neutral-200 flex-shrink-0 bg-neutral-50">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold text-neutral-900 text-sm">
            {columnTitle}
          </h2>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-200 text-xs font-bold text-neutral-700">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <motion.div
        className={`
          flex-1 overflow-y-auto px-4 py-4 space-y-3 column-scroll
          transition-colors duration-200
          ${isDragOver ? 'bg-primary-50' : ''}
        `}
        onDragOver={(e) => {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'move'
        }}
        onDragLeave={(e) => {
          e.preventDefault()
        }}
        onDrop={(e) => {
          e.preventDefault()
          const taskId = e.dataTransfer.getData('task-id')
          if (taskId) {
            onDropTask(taskId, columnId)
          }
        }}
      >
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-32 text-neutral-400"
            >
              <p className="text-sm">No tasks yet</p>
            </motion.div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
                onEdit={onEditTask}
              />
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Add Task Button */}
      <div className="p-4 border-t border-neutral-200 flex-shrink-0 bg-neutral-50">
        <button
          onClick={() => onAddTask(columnId)}
          className={`
            w-full py-2.5 px-3 rounded-lg font-medium transition-all
            flex items-center justify-center gap-2
            text-primary-600 hover:bg-primary-50 active:scale-95
            border border-primary-300 hover:border-primary-500
            bg-white hover:bg-primary-50
          `}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Add Task</span>
        </button>
      </div>
    </motion.div>
  )
}

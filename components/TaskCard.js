'use client';

import { motion } from 'framer-motion';
import { Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';

const PRIORITY_COLORS = {
  low: 'bg-blue-100 text-blue-700 border border-blue-200',
  medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  high: 'bg-red-100 text-red-700 border border-red-200',
}

export default function TaskCard({ task, onDelete, onEdit, isDragging }) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`
        bg-white rounded-lg p-4 mb-2 cursor-grab active:cursor-grabbing
        border border-neutral-200 shadow-sm-modern hover:shadow-modern
        transition-all duration-200 group relative
        ${isDragging ? 'opacity-50 scale-95' : ''}
      `}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('task-id', task.id)
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* Task Title */}
          <h3 className="font-semibold text-neutral-900 text-sm leading-tight break-words">
            {task.title}
          </h3>

          {/* Task Description */}
          {task.description && (
            <p className="text-xs text-neutral-600 mt-2 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Task Meta */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {/* Priority Badge */}
            <span className={`
              px-2 py-1 rounded text-xs font-semibold capitalize
              ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium}
            `}>
              {task.priority}
            </span>

            {/* Due Date */}
            {task.dueDate && (
              <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
                {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`
          flex items-center gap-1 ml-2 flex-shrink-0
          ${isHovering ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-200
        `}>
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded hover:bg-blue-50 text-neutral-500 hover:text-primary-600 transition-colors"
            title="Edit task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded hover:bg-red-50 text-neutral-500 hover:text-red-600 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

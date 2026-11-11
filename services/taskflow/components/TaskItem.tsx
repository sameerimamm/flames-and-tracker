'use client';

import React from 'react';
import { Check, Edit2, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { Task, Category, Priority } from '../types/todo';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const categoryStyles: Record<Category, string> = {
  Work: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
  Personal: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
  Study: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
  Shopping: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
  Health: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
};

const priorityStyles: Record<Priority, { label: string; badge: string }> = {
  low: {
    label: 'Low',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  },
  medium: {
    label: 'Medium',
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  },
  high: {
    label: 'High',
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  urgent: {
    label: '🔥 Urgent',
    badge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  },
};

function formatDueDate(dueDateStr?: string, isCompleted?: boolean) {
  if (!dueDateStr) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dueDateStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);

  const diffDays = Math.round((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (!isCompleted && diffDays < 0) {
    return { text: `Overdue (${dueDateStr})`, isOverdue: true, isToday: false };
  }
  if (diffDays === 0) {
    return { text: 'Due Today', isOverdue: false, isToday: true };
  }
  if (diffDays === 1) {
    return { text: 'Due Tomorrow', isOverdue: false, isToday: false };
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return {
    text: `Due ${monthNames[month - 1]} ${day}`,
    isOverdue: false,
    isToday: false,
  };
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const dueInfo = formatDueDate(task.dueDate, task.completed);
  const priorityInfo = priorityStyles[task.priority] || priorityStyles.medium;

  return (
    <li
      className={`group flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow'
      }`}
    >
      {/* Custom Checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        onClick={() => onToggle(task.id)}
        className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
          task.completed
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 bg-white dark:bg-slate-800'
        }`}
        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`text-sm sm:text-base font-semibold leading-snug break-words transition-all ${
              task.completed
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-800 dark:text-slate-100'
            }`}
          >
            {task.title}
          </span>
        </div>

        {/* Notes */}
        {task.notes && (
          <p
            className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
              task.completed
                ? 'line-through text-slate-400 dark:text-slate-600'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {task.notes}
          </p>
        )}

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {/* Category */}
          <span
            className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              categoryStyles[task.category] || categoryStyles.Personal
            }`}
          >
            {task.category}
          </span>

          {/* Priority */}
          <span
            className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full border ${priorityInfo.badge}`}
          >
            {priorityInfo.label}
          </span>

          {/* Due Date */}
          {dueInfo && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                dueInfo.isOverdue
                  ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800'
                  : dueInfo.isToday
                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800'
                  : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              {dueInfo.isOverdue ? (
                <AlertCircle className="w-3 h-3 text-rose-500" />
              ) : (
                <Calendar className="w-3 h-3" />
              )}
              <span>{dueInfo.text}</span>
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          title="Edit Task"
          aria-label="Edit Task"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-all"
          title="Delete Task"
          aria-label="Delete Task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </li>
  );
};

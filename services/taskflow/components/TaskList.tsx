'use client';

import React from 'react';
import { CheckCircle2, Inbox } from 'lucide-react';
import { Task } from '../types/todo';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  totalTasksCount: number;
  searchQuery: string;
  statusFilter: string;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  totalTasksCount,
  searchQuery,
  statusFilter,
  onToggle,
  onEdit,
  onDelete,
}) => {
  if (tasks.length === 0) {
    let title = 'No tasks found';
    let subtitle = 'Add a new task above or adjust your filters.';

    if (totalTasksCount === 0) {
      title = 'All caught up!';
      subtitle = 'You have no tasks pending. Enjoy your day or add a new task!';
    } else if (searchQuery.trim()) {
      title = 'No matching tasks';
      subtitle = `No tasks found matching "${searchQuery}".`;
    } else if (statusFilter === 'completed') {
      title = 'No completed tasks yet';
      subtitle = 'Mark tasks as done to see them organized here.';
    }

    return (
      <div className="flex flex-col items-center justify-center py-14 px-4 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
          {totalTasksCount === 0 ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          ) : (
            <Inbox className="w-6 h-6" />
          )}
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          {subtitle}
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

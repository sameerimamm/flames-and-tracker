'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Task, Category, Priority, FilterStatus, SortOption } from '../types/todo';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Header } from './Header';
import { StatsOverview } from './StatsOverview';
import { TaskForm } from './TaskForm';
import { TaskFilters } from './TaskFilters';
import { TaskList } from './TaskList';
import { EditTaskModal } from './EditTaskModal';
import { ShortcutsModal } from './ShortcutsModal';
import { Toast, ToastMessage } from './Toast';

const defaultTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Review quarterly system architecture',
    notes: 'Inspect distributed tracing, Redis caching layer, and edge routing.',
    category: 'Work',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    completed: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Restock weekly groceries & fresh produce',
    notes: 'Avocados, almond milk, sourdough bread, organic eggs, roasted beans.',
    category: 'Shopping',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Study Raft consensus algorithm & Paxos comparison',
    notes: 'Read chapter 8 of Designing Data-Intensive Applications.',
    category: 'Study',
    priority: 'low',
    dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    completed: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

interface TaskFlowAppProps {
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  hideHeaderThemeToggle?: boolean;
}

export const TaskFlowApp: React.FC<TaskFlowAppProps> = ({
  theme = 'light',
  onToggleTheme,
}) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('taskflow_tasks_v2', defaultTasks);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-added-desc');

  // Modal & Toast states
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast('Task created successfully!', 'success');
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task removed.', 'info');
  };

  const handleUpdateTask = (updated: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setEditingTask(null);
    showToast('Task updated successfully!', 'success');
  };

  const handleClearCompleted = () => {
    const completedCount = tasks.filter((t) => t.completed).length;
    if (completedCount === 0) return;
    setTasks((prev) => prev.filter((t) => !t.completed));
    showToast(`Cleared ${completedCount} completed task${completedCount > 1 ? 's' : ''}.`, 'info');
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Tasks exported to JSON.', 'success');
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported = JSON.parse(content);
        if (Array.isArray(imported)) {
          setTasks(imported);
          showToast('Tasks imported successfully!', 'success');
        } else {
          showToast('Invalid JSON file format.', 'error');
        }
      } catch {
        showToast('Error reading import file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchNotes = task.notes?.toLowerCase().includes(q) ?? false;
          if (!matchTitle && !matchNotes) return false;
        }

        if (filterCategory !== 'all' && task.category !== filterCategory) {
          return false;
        }

        if (filterStatus === 'active' && task.completed) return false;
        if (filterStatus === 'completed' && !task.completed) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'due-date-asc') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (sortBy === 'date-added-asc') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'priority-desc') {
          const pScore: Record<Priority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
          return pScore[b.priority] - pScore[a.priority];
        }
        if (sortBy === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [tasks, searchQuery, filterCategory, filterStatus, sortBy]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Header
        theme={theme}
        onToggleTheme={onToggleTheme || (() => {})}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onExport={handleExportData}
        onImport={handleImportData}
      />

      {/* Stats Overview */}
      <StatsOverview
        total={tasks.length}
        completed={tasks.filter((t) => t.completed).length}
        active={tasks.filter((t) => !t.completed).length}
      />

      {/* Task Form Input */}
      <TaskForm onAddTask={handleAddTask} />

      {/* Filters, Search, Sort & Clear */}
      <TaskFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={filterStatus}
        onStatusFilterChange={setFilterStatus}
        categoryFilter={filterCategory}
        onCategoryFilterChange={setFilterCategory}
        sortOption={sortBy}
        onSortChange={setSortBy}
        onClearCompleted={handleClearCompleted}
        completedCount={tasks.filter((t) => t.completed).length}
      />

      {/* Task List */}
      <TaskList
        tasks={filteredTasks}
        totalTasksCount={tasks.length}
        searchQuery={searchQuery}
        statusFilter={filterStatus}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
        onEdit={(t) => setEditingTask(t)}
      />

      {/* Edit Modal */}
      <EditTaskModal
        task={editingTask}
        isOpen={editingTask !== null}
        onClose={() => setEditingTask(null)}
        onSave={handleUpdateTask}
      />

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Toast Notification */}
      <Toast
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
};

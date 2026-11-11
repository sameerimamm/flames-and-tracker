'use client';

import React, { useState } from 'react';
import { Plus, Calendar, Tag, AlertCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Category, Priority } from '../types/todo';

interface TaskFormProps {
  onAddTask: (task: {
    title: string;
    notes?: string;
    category: Category;
    priority: Priority;
    dueDate?: string;
  }) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, inputRef }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Personal');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      category,
      priority,
      dueDate: dueDate || undefined,
      notes: notes.trim() || undefined,
    });

    // Reset fields
    setTitle('');
    setNotes('');
    setDueDate('');
    setShowNotes(false);
  };

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {/* Main Input Row */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done? (Press 'N' to focus)"
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 py-3 text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-4 sm:px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm sm:text-base shadow-md shadow-indigo-600/20 active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>

        {/* Options Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Category Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-500 dark:text-slate-400">Cat:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="bg-transparent font-medium text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="Personal" className="dark:bg-slate-900">👤 Personal</option>
              <option value="Work" className="dark:bg-slate-900">💼 Work</option>
              <option value="Study" className="dark:bg-slate-900">📚 Study</option>
              <option value="Shopping" className="dark:bg-slate-900">🛒 Shopping</option>
              <option value="Health" className="dark:bg-slate-900">❤️ Health</option>
            </select>
          </div>

          {/* Priority Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-500 dark:text-slate-400">Priority:</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="bg-transparent font-medium text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="low" className="dark:bg-slate-900">Low</option>
              <option value="medium" className="dark:bg-slate-900">Medium</option>
              <option value="high" className="dark:bg-slate-900">High</option>
              <option value="urgent" className="dark:bg-slate-900">🔥 Urgent</option>
            </select>
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-500 dark:text-slate-400">Due:</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-transparent font-medium text-slate-800 dark:text-slate-200 outline-none cursor-pointer text-xs"
            />
          </div>

          {/* Toggle Notes */}
          <button
            type="button"
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showNotes || notes
                ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Notes</span>
            {showNotes ? (
              <ChevronUp className="w-3 h-3 ml-0.5" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-0.5" />
            )}
          </button>
        </div>

        {/* Notes Collapsible Field */}
        {showNotes && (
          <div className="pt-1">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add optional notes, checklist items, links..."
              rows={2}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 transition-all resize-y"
            />
          </div>
        )}
      </form>
    </section>
  );
};

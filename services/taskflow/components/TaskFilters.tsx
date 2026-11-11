'use client';

import React from 'react';
import { Search, X, Trash2 } from 'lucide-react';
import { FilterStatus, SortOption, Category } from '../types/todo';

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: FilterStatus;
  onStatusFilterChange: (status: FilterStatus) => void;
  categoryFilter: Category | 'all';
  onCategoryFilterChange: (cat: Category | 'all') => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onClearCompleted: () => void;
  completedCount: number;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortOption,
  onSortChange,
  onClearCompleted,
  completedCount,
  searchInputRef,
}) => {
  return (
    <section className="flex flex-col gap-3">
      {/* Search Bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks... (Press '/' to search)"
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-9 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            aria-label="Clear search query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Tabs & Dropdowns */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Status Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800">
          {(['all', 'active', 'completed'] as FilterStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => onStatusFilterChange(tab)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                statusFilter === tab
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Category & Sorting Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value as Category | 'all')}
            className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 outline-none cursor-pointer shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <option value="all">All Categories</option>
            <option value="Personal">👤 Personal</option>
            <option value="Work">💼 Work</option>
            <option value="Study">📚 Study</option>
            <option value="Shopping">🛒 Shopping</option>
            <option value="Health">❤️ Health</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 outline-none cursor-pointer shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <option value="date-added-desc">Newest First</option>
            <option value="date-added-asc">Oldest First</option>
            <option value="due-date-asc">Due Date (Earliest)</option>
            <option value="priority-desc">Priority (High to Low)</option>
            <option value="title-asc">Alphabetical (A-Z)</option>
          </select>

          {/* Clear Completed Button */}
          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 dark:hover:border-red-900/50 transition-all ml-auto sm:ml-0"
              title="Clear all completed tasks"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Done ({completedCount})</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

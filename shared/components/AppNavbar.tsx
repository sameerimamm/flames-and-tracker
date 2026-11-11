'use client';

import React from 'react';
import { Flame, CheckSquare, Sun, Moon } from 'lucide-react';

interface AppNavbarProps {
  currentService: 'flames' | 'taskflow';
  onServiceChange?: (service: 'flames' | 'taskflow') => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
  currentService,
  onServiceChange,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Service Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-pink-500/25">
            {currentService === 'flames' ? (
              <Flame className="w-5 h-5 fill-white text-white" />
            ) : (
              <CheckSquare className="w-5 h-5 stroke-[2.5]" />
            )}
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-500 bg-clip-text text-transparent">
              {currentService === 'flames' ? 'FLAMES Service' : 'TaskFlow Service'}
            </span>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-1.5 uppercase tracking-widest hidden sm:inline">
              Workspace
            </span>
          </div>
        </div>

        {/* Modular Service Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-bold">
          <button
            type="button"
            onClick={() => onServiceChange?.('flames')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              currentService === 'flames'
                ? 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>FLAMES</span>
          </button>

          <button
            type="button"
            onClick={() => onServiceChange?.('taskflow')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              currentService === 'taskflow'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>TaskFlow</span>
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

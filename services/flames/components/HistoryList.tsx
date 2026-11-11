'use client';

import React from 'react';
import { FlamesKey, FLAMES_DICTIONARY } from '../lib/flamesLogic';
import { History, Trash2, ArrowUpRight } from 'lucide-react';

export interface HistoryItem {
  id: string;
  name1: string;
  name2: string;
  count: number;
  resultLetter: FlamesKey;
  timestamp: number;
}

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <History className="w-3.5 h-3.5 text-pink-500" />
          <span>Recent Tests ({history.length})</span>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {history.slice(0, 6).map((item) => {
          const meta = FLAMES_DICTIONARY[item.resultLetter];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className="group flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 hover:bg-pink-50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 hover:border-pink-500/30 transition-all text-left"
            >
              <div className="space-y-0.5 truncate pr-2">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {item.name1} & {item.name2}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span>{meta.emoji}</span>
                  <span className="font-medium">{meta.word}</span>
                  <span>•</span>
                  <span>Count {item.count}</span>
                </div>
              </div>

              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-pink-500 transition-colors shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

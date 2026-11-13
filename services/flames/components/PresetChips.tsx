'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface PresetChipsProps {
  onSelect: (name1: string, name2: string) => void;
}

const PRESETS = [
  { pair: ['Romeo', 'Juliet'], label: 'Romeo & Juliet', icon: '🌹' },
  { pair: ['Salman', 'Aishwarya'], label: 'Salman & Aishwarya', icon: '👋' },
  { pair: ['Jack', 'Rose'], label: 'Jack & Rose', icon: '📎' },
  { pair: ['Ross', 'Rachel'], label: 'Ross & Rachel', icon: '☕' },
  { pair: ['Virat', 'Anushka'], label: 'Virat & Anushka', icon: '🦾' },
  { pair: ['India', 'Italy'], label: 'India & Italy', icon: '🍫' },
  { pair: ['Amitabh', 'Rekha'], label: 'Amitabh & Rekha', icon: '🧅' },
];

export const PresetChips: React.FC<PresetChipsProps> = ({ onSelect }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>Try iconic couples:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onSelect(p.pair[0], p.pair[1])}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-pink-500/10 dark:bg-slate-800 dark:hover:bg-pink-500/20 text-slate-700 hover:text-pink-600 dark:text-slate-300 dark:hover:text-pink-400 border border-slate-200/80 hover:border-pink-500/40 dark:border-slate-700/80 text-xs font-medium transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

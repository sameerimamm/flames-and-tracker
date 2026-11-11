'use client';

import React from 'react';
import { FlamesCalculation, COLOR_PALETTES } from '../lib/flamesLogic';
import { Sparkles, Hash, ArrowRight } from 'lucide-react';

interface LetterMatcherProps {
  calculation: FlamesCalculation;
}

export const LetterMatcher: React.FC<LetterMatcherProps> = ({ calculation }) => {
  const { tiles1, tiles2, name1, name2, remainingCount, remainingLetters1, remainingLetters2 } = calculation;

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center text-xs font-bold">1</span>
            Letter Cancellation Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Identical letters between both names are crossed out in pairs. Unmatched letters are counted.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 w-fit">
          <Hash className="w-3.5 h-3.5 text-pink-500" />
          <span>Total Count: <strong>{remainingCount}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name 1 Tiles */}
        <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate max-w-[200px]">{name1}</span>
            <span className="text-slate-500">
              {remainingLetters1.length} remaining / {tiles1.length} total
            </span>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[44px] items-center">
            {tiles1.map((tile) => {
              if (tile.isMatched && tile.matchColorIndex !== undefined) {
                const palette = COLOR_PALETTES[tile.matchColorIndex];
                return (
                  <div
                    key={tile.id}
                    title={`Matched letter '${tile.char}' (Pair #${tile.matchId})`}
                    className={`relative px-3 py-1.5 rounded-lg border font-mono text-sm font-bold opacity-60 line-through select-none transition-all ${palette}`}
                  >
                    {tile.char}
                  </div>
                );
              }
              return (
                <div
                  key={tile.id}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border-2 border-pink-500/80 text-pink-600 dark:text-pink-400 font-mono text-sm font-extrabold shadow-sm shadow-pink-500/10 select-none animate-pulse"
                >
                  {tile.char}
                </div>
              );
            })}
          </div>
        </div>

        {/* Name 2 Tiles */}
        <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate max-w-[200px]">{name2}</span>
            <span className="text-slate-500">
              {remainingLetters2.length} remaining / {tiles2.length} total
            </span>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[44px] items-center">
            {tiles2.map((tile) => {
              if (tile.isMatched && tile.matchColorIndex !== undefined) {
                const palette = COLOR_PALETTES[tile.matchColorIndex];
                return (
                  <div
                    key={tile.id}
                    title={`Matched letter '${tile.char}' (Pair #${tile.matchId})`}
                    className={`relative px-3 py-1.5 rounded-lg border font-mono text-sm font-bold opacity-60 line-through select-none transition-all ${palette}`}
                  >
                    {tile.char}
                  </div>
                );
              }
              return (
                <div
                  key={tile.id}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border-2 border-indigo-500/80 text-indigo-600 dark:text-indigo-400 font-mono text-sm font-extrabold shadow-sm shadow-indigo-500/10 select-none animate-pulse"
                >
                  {tile.char}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary calculation pill */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 rounded-xl bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-indigo-500/5 border border-pink-500/20 text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-500 shrink-0" />
          <span>
            Remaining in <strong>{name1}</strong>: <code className="px-1.5 py-0.5 rounded bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 font-mono font-bold">[{remainingLetters1.join(', ') || 'None'}]</code> ({remainingLetters1.length})
            {' + '}
            Remaining in <strong>{name2}</strong>: <code className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono font-bold">[{remainingLetters2.join(', ') || 'None'}]</code> ({remainingLetters2.length})
          </span>
        </div>

        <div className="flex items-center gap-2 font-semibold shrink-0 text-slate-900 dark:text-slate-100">
          <span>Magic Count:</span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-pink-500 text-white font-mono text-xs font-bold shadow-sm shadow-pink-500/30">
            {remainingLetters1.length} + {remainingLetters2.length} = {remainingCount}
          </span>
        </div>
      </div>
    </div>
  );
};

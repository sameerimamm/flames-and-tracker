'use client';

import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface StatsOverviewProps {
  total: number;
  completed: number;
  active: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  total,
  completed,
  active,
}) => {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const prevPercentageRef = useRef(percentage);

  // Trigger confetti when tasks reach 100% completion
  useEffect(() => {
    if (percentage === 100 && total > 0 && prevPercentageRef.current < 100) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981'],
      });
    }
    prevPercentageRef.current = percentage;
  }, [percentage, total]);

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Progress Bar & Header */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Overall Progress
            </span>
            <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
              {percentage}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Counter Badges */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center justify-center px-4 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 min-w-[70px]">
            <span className="text-lg font-black text-slate-800 dark:text-slate-100 leading-none">
              {total}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
              Total
            </span>
          </div>

          <div className="flex flex-col items-center justify-center px-4 py-2 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/50 min-w-[70px]">
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 leading-none">
              {active}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600/80 dark:text-indigo-400/80 mt-1">
              Pending
            </span>
          </div>

          <div className="flex flex-col items-center justify-center px-4 py-2 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900/50 min-w-[70px]">
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 leading-none">
              {completed}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/80 dark:text-emerald-400/80 mt-1">
              Done
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

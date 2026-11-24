'use client';

import React, { useState, useEffect } from 'react';
import { FlamesCalculator } from '@/services/flames';
import { TaskFlowApp } from '@/services/taskflow';
import { AppNavbar } from '@/shared/components/AppNavbar';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

export default function Home() {
  const [currentService, setCurrentService] = useState<'flames' | 'taskflow'>('flames');
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('app_theme', 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <AppNavbar
        currentService={currentService}
        onServiceChange={setCurrentService}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        {currentService === 'flames' ? (
          <FlamesCalculator />
        ) : (
          <TaskFlowApp theme={theme} onToggleTheme={handleToggleTheme} />
        )}
      </main>
    </div>
  );
}

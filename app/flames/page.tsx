'use client';

import React from 'react';
import { FlamesCalculator } from '@/services/flames';
import { AppNavbar } from '@/shared/components/AppNavbar';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { useRouter } from 'next/navigation';

export default function FlamesPage() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('app_theme', 'light');
  const router = useRouter();

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleServiceChange = (service: 'flames' | 'taskflow') => {
    if (service === 'taskflow') {
      router.push('/tasks');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors">
      <AppNavbar
        currentService="flames"
        onServiceChange={handleServiceChange}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        <FlamesCalculator />
      </main>
    </div>
  );
}

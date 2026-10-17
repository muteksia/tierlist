'use client';

import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface AppHeaderProps {
  isPresentationMode: boolean;
  onTogglePresentationMode: () => void;
}

export function AppHeader({
  isPresentationMode,
  onTogglePresentationMode,
}: AppHeaderProps) {
  return (
    <header className="w-full pb-6 mb-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Tierlist
        </span>
      </div>

      <button
        type="button"
        role="switch"
        aria-label="Toggle presentation mode"
        aria-checked={isPresentationMode}
        onClick={onTogglePresentationMode}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 active:scale-95 shadow-xs cursor-pointer"
      >
        {isPresentationMode ? (
          <>
            <Minimize2 className="w-4 h-4" />
            <span>Normal View</span>
          </>
        ) : (
          <>
            <Maximize2 className="w-4 h-4" />
            <span>Presentation Mode</span>
          </>
        )}
      </button>
    </header>
  );
}


'use client';

import React from 'react';

export function AppFooter() {
  return (
    <footer className="w-full pt-8 pb-4 mt-8 border-t border-zinc-200/60 dark:border-zinc-850 flex items-center justify-center">
      <a
        href="https://github.com/muteksia/tierlist"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 rounded-sm py-0.5 px-1"
      >
        (c) 2026 Muteksia. All Rights Reserved.
      </a>
    </footer>
  );
}


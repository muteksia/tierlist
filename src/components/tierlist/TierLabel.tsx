'use client';

import React from 'react';
import { InlineEditInput } from './InlineEditInput';
import { isDarkColor } from '@/lib/colorUtils';

interface TierLabelProps {
  label: string;
  color: string;
  onRename: (newLabel: string) => void;
}

export function TierLabel({ label, color, onRename }: TierLabelProps) {
  const isDark = isDarkColor(color);
  const textColorClass = isDark ? 'text-white' : 'text-zinc-900';

  return (
    <div
      className={`w-20 sm:w-28 min-h-[80px] flex-shrink-0 flex items-center justify-center p-2 text-center font-bold text-sm sm:text-base md:text-lg select-none transition-colors border-r border-black/10 dark:border-white/10 ${textColorClass}`}
      style={{ backgroundColor: color }}
    >
      <InlineEditInput
        value={label}
        onSave={onRename}
        fallback="NEW"
        placeholder="Tier..."
        ariaLabel="Tier name"
        className="w-full break-words text-center leading-tight hover:underline cursor-pointer"
        inputClassName={`w-full text-center font-bold text-sm sm:text-base md:text-lg ${textColorClass}`}
      />
    </div>
  );
}

'use client';

import React from 'react';
import { InlineEditInput } from './InlineEditInput';
import { InlineEditTextarea } from './InlineEditTextarea';

interface HeaderSectionProps {
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (desc: string) => void;
}

export function HeaderSection({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: HeaderSectionProps) {
  return (
    <div className="w-full space-y-2 mb-6">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          <InlineEditInput
            value={title}
            onSave={onTitleChange}
            fallback="Untitled Tier List"
            placeholder="Tier List Title..."
            ariaLabel="Tier list title"
            className="border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"
            inputClassName="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
          />
        </h1>
      </div>
      <div>
        <InlineEditTextarea
          value={description}
          onSave={onDescriptionChange}
          fallback="Add a description..."
          placeholder="Describe your tier list..."
          ariaLabel="Tier list description"
          className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base leading-relaxed border-b border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
        />
      </div>
    </div>
  );
}

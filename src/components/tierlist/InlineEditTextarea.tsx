'use client';

import React, { useState, useEffect, useRef } from 'react';

interface InlineEditTextareaProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  fallback?: string;
  className?: string;
  textareaClassName?: string;
  ariaLabel?: string;
}

export function InlineEditTextarea({
  value,
  onSave,
  placeholder = 'Add a description...',
  fallback = 'Add a description...',
  className = '',
  textareaClassName = '',
  ariaLabel,
}: InlineEditTextareaProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const startEditing = () => {
    setCurrentText(value);
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
      textareaRef.current.selectionEnd = textareaRef.current.value.length;
    }
  }, [isEditing]);

  const handleCommit = () => {
    setIsEditing(false);
    const trimmed = currentText.trim();
    if (!trimmed) {
      setCurrentText(fallback);
      onSave(fallback);
    } else {
      setCurrentText(trimmed);
      onSave(trimmed);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentText(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        rows={3}
        aria-label={ariaLabel}
        value={currentText}
        onChange={(e) => setCurrentText(e.target.value)}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all resize-y ${textareaClassName}`}
      />
    );
  }

  return (
    <p
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={startEditing}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startEditing();
        }
      }}
      className={`cursor-pointer hover:opacity-80 transition-opacity whitespace-pre-wrap select-none ${className}`}
      title="Click to edit description"
    >
      {value || fallback}
    </p>
  );
}

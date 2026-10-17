'use client';

import React, { useState, useEffect, useRef } from 'react';

interface InlineEditInputProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  fallback?: string;
  className?: string;
  inputClassName?: string;
  ariaLabel?: string;
}

export function InlineEditInput({
  value,
  onSave,
  placeholder = 'Click to edit...',
  fallback = 'Untitled',
  className = '',
  inputClassName = '',
  ariaLabel,
}: InlineEditInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = () => {
    setCurrentText(value);
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        aria-label={ariaLabel}
        value={currentText}
        onChange={(e) => setCurrentText(e.target.value)}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`bg-transparent outline-none border-b-2 border-primary/60 focus:border-primary transition-colors ${inputClassName}`}
      />
    );
  }

  return (
    <span
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
      className={`cursor-pointer hover:opacity-80 transition-opacity select-none ${className}`}
      title="Click to rename"
    >
      {value || fallback}
    </span>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Pipette } from 'lucide-react';

interface ColorPickerPopoverProps {
  currentColor: string;
  swatches: string[] | { label: string; value: string }[];
  onChange: (color: string) => void;
  trigger: React.ReactNode;
  align?: 'left' | 'right';
}

export function ColorPickerPopover({
  currentColor,
  swatches,
  onChange,
  trigger,
  align = 'right',
}: ColorPickerPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customHex, setCustomHex] = useState(currentColor);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setCustomHex(currentColor);
      }
      return next;
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const normalizedSwatches = swatches.map((item) =>
    typeof item === 'string' ? { label: item, value: item } : item
  );

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div onClick={toggleOpen} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 mt-2 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl shadow-zinc-900/10 dark:shadow-black/50 min-w-[200px] w-64 space-y-3 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Palette Swatches
          </div>
          <div className="grid grid-cols-5 gap-2">
            {normalizedSwatches.map((swatch) => {
              const isSelected = currentColor.toLowerCase() === swatch.value.toLowerCase();
              return (
                <button
                  key={swatch.value}
                  type="button"
                  title={swatch.label}
                  onClick={() => {
                    onChange(swatch.value);
                    setCustomHex(swatch.value);
                  }}
                  className={`w-8 h-8 rounded-lg border transition-transform hover:scale-110 flex items-center justify-center ${
                    isSelected
                      ? 'border-zinc-900 dark:border-zinc-100 ring-2 ring-zinc-400 dark:ring-zinc-500 scale-105'
                      : 'border-zinc-300 dark:border-zinc-700'
                  }`}
                  style={{ backgroundColor: swatch.value }}
                />
              );
            })}
          </div>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Custom Color
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="custom-color-picker"
                className="w-8 h-8 rounded-lg border border-zinc-300 dark:border-zinc-700 cursor-pointer overflow-hidden relative flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: customHex }}
              >
                <input
                  id="custom-color-picker"
                  type="color"
                  value={customHex.startsWith('#') && customHex.length === 7 ? customHex : '#000000'}
                  onChange={(e) => {
                    setCustomHex(e.target.value);
                    onChange(e.target.value);
                  }}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
                <Pipette className="w-3.5 h-3.5 opacity-60 pointer-events-none" />
              </label>

              <input
                type="text"
                value={customHex}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomHex(val);
                  if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
                    onChange(val);
                  }
                }}
                placeholder="#000000"
                className="w-full text-xs font-mono px-2.5 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

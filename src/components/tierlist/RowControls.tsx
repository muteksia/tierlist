'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Settings,
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
  RotateCcw,
  Palette,
} from 'lucide-react';
import { TIER_COLOR_PALETTE } from '@/types/tierlist';

interface RowControlsProps {
  rowIndex: number;
  totalRows: number;
  currentColor: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddAbove: () => void;
  onAddBelow: () => void;
  onClearRow: () => void;
  onDeleteRow: () => void;
  onChangeColor: (color: string) => void;
}

export function RowControls({
  rowIndex,
  totalRows,
  currentColor,
  onMoveUp,
  onMoveDown,
  onAddAbove,
  onAddBelow,
  onClearRow,
  onDeleteRow,
  onChangeColor,
}: RowControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => {
    setIsOpen(false);
    setShowColorPicker(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const isFirst = rowIndex === 0;
  const isLast = rowIndex === totalRows - 1;

  return (
    <div
      data-export-hide="true"
      className="hide-on-export flex items-center justify-center gap-1 px-2 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 select-none flex-shrink-0"
    >
      {/* Settings Menu Button [S] */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => {
            if (isOpen) {
              closeMenu();
            } else {
              setIsOpen(true);
            }
          }}
          title="Row settings"
          className="p-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 z-50 w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl shadow-zinc-900/10 dark:shadow-black/50 p-1.5 text-xs text-zinc-700 dark:text-zinc-300 space-y-0.5">
            <button
              type="button"
              onClick={() => {
                onAddAbove();
                closeMenu();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
            >
              <Plus className="w-3.5 h-3.5 text-zinc-500" />
              Add Row Above
            </button>

            <button
              type="button"
              onClick={() => {
                onAddBelow();
                closeMenu();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
            >
              <Plus className="w-3.5 h-3.5 text-zinc-500" />
              Add Row Below
            </button>

            <button
              type="button"
              onClick={() => {
                onClearRow();
                closeMenu();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
              Clear Row Images
            </button>

            <div className="py-1">
              <button
                type="button"
                onClick={() => setShowColorPicker((prev) => !prev)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
              >
                <span className="flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-zinc-500" />
                  Change Color
                </span>
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/20"
                  style={{ backgroundColor: currentColor }}
                />
              </button>

              {showColorPicker && (
                <div className="p-2 mt-1 bg-zinc-50 dark:bg-zinc-800/80 rounded-lg border border-zinc-200 dark:border-zinc-700 space-y-2">
                  <div className="grid grid-cols-5 gap-1.5">
                    {TIER_COLOR_PALETTE.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          onChangeColor(color);
                          closeMenu();
                        }}
                        className={`w-6 h-6 rounded-md border transition-transform hover:scale-110 ${
                          currentColor.toLowerCase() === color.toLowerCase()
                            ? 'ring-2 ring-zinc-500 border-white'
                            : 'border-black/10'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="color"
                      value={currentColor}
                      onChange={(e) => onChangeColor(e.target.value)}
                      className="w-6 h-6 rounded border-0 p-0 cursor-pointer bg-transparent"
                    />
                    <span className="text-[10px] font-mono text-zinc-500">Custom hex</span>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-zinc-200 dark:border-zinc-800 my-1" />

            <button
              type="button"
              disabled={totalRows <= 1}
              onClick={() => {
                onDeleteRow();
                closeMenu();
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 disabled:opacity-40 disabled:pointer-events-none transition-colors text-left"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Row
            </button>
          </div>
        )}
      </div>

      {/* Row Reorder Controls [<>] */}
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          disabled={isFirst}
          onClick={onMoveUp}
          title="Move row up"
          className="p-1 rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-25 disabled:pointer-events-none transition-colors"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={isLast}
          onClick={onMoveDown}
          title="Move row down"
          className="p-1 rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-25 disabled:pointer-events-none transition-colors"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

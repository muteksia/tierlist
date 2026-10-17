'use client';

import React, { useState } from 'react';
import { ImageShape, CANVAS_BG_SWATCHES } from '@/types/tierlist';
import { ColorPickerPopover } from './ColorPickerPopover';
import {
  Download,
  RotateCcw,
  Palette,
  Square,
  RectangleHorizontal,
  RectangleVertical,
  Circle,
  Maximize2,
  ChevronDown,
  Loader2,
} from 'lucide-react';

interface ToolbarProps {
  imageShape: ImageShape;
  canvasBgColor: string;
  isExporting: boolean;
  onImageShapeChange: (shape: ImageShape) => void;
  onCanvasBgColorChange: (color: string) => void;
  onOpenResetDialog: () => void;
  onExport: () => void;
}

const SHAPE_OPTIONS: { id: ImageShape; label: string; icon: React.ElementType }[] = [
  { id: 'square', label: 'Square (1:1)', icon: Square },
  { id: 'landscape', label: 'Landscape (16:9)', icon: RectangleHorizontal },
  { id: 'portrait', label: 'Portrait (3:4)', icon: RectangleVertical },
  { id: 'round', label: 'Round (Circle)', icon: Circle },
  { id: 'no-crop', label: 'No Crop (Natural)', icon: Maximize2 },
];

export function Toolbar({
  imageShape,
  canvasBgColor,
  isExporting,
  onImageShapeChange,
  onCanvasBgColorChange,
  onOpenResetDialog,
  onExport,
}: ToolbarProps) {
  const [shapeMenuOpen, setShapeMenuOpen] = useState(false);
  const currentShape = SHAPE_OPTIONS.find((s) => s.id === imageShape) || SHAPE_OPTIONS[0];
  const CurrentIcon = currentShape.icon;

  return (
    <div className="w-full mb-4 flex flex-wrap items-center justify-between gap-3 p-2 bg-zinc-100/90 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800">
      {/* Left controls: Shape & Canvas Bg */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Shape selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShapeMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-colors shadow-xs"
          >
            <CurrentIcon className="w-3.5 h-3.5 text-zinc-500" />
            <span>Shape: {currentShape.label.split(' ')[0]}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {shapeMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShapeMenuOpen(false)}
              />
              <div className="absolute left-0 mt-1 z-50 w-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl shadow-zinc-900/10 dark:shadow-black/50 p-1 text-xs space-y-0.5">
                {SHAPE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = opt.id === imageShape;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        onImageShapeChange(opt.id);
                        setShapeMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                        isSelected
                          ? 'bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-zinc-100'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-zinc-500" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Canvas Background Color Picker */}
        <ColorPickerPopover
          currentColor={canvasBgColor}
          swatches={CANVAS_BG_SWATCHES}
          onChange={onCanvasBgColorChange}
          align="left"
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-colors shadow-xs"
            >
              <Palette className="w-3.5 h-3.5 text-zinc-500" />
              <span>Canvas Bg</span>
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/20 dark:border-white/20"
                style={{ backgroundColor: canvasBgColor }}
              />
            </button>
          }
        />
      </div>

      {/* Right controls: Reset & Download */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenResetDialog}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <button
          type="button"
          disabled={isExporting}
          onClick={onExport}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isExporting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          <span>{isExporting ? 'Exporting...' : 'Export PNG'}</span>
        </button>
      </div>
    </div>
  );
}

'use client';

import React, { forwardRef } from 'react';
import { TierRowData, ImageShape } from '@/types/tierlist';
import { TierRow } from './TierRow';

interface TierListCanvasProps {
  rows: TierRowData[];
  shape: ImageShape;
  canvasBgColor: string;
  onRenameRow: (rowId: string, newLabel: string) => void;
  onChangeRowColor: (rowId: string, newColor: string) => void;
  onMoveRow: (index: number, direction: 'up' | 'down') => void;
  onAddRow: (index: number, position: 'above' | 'below') => void;
  onClearRow: (rowId: string) => void;
  onDeleteRow: (rowId: string) => void;
  onDropImage: (
    imageId: string,
    sourceContainerId: string,
    destContainerId: string,
    targetIndex?: number
  ) => void;
  onReturnToPool: (imageId: string) => void;
}

export const TierListCanvas = forwardRef<HTMLDivElement, TierListCanvasProps>(
  function TierListCanvas(
    {
      rows,
      shape,
      canvasBgColor,
      onRenameRow,
      onChangeRowColor,
      onMoveRow,
      onAddRow,
      onClearRow,
      onDeleteRow,
      onDropImage,
      onReturnToPool,
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        style={{ backgroundColor: canvasBgColor }}
        className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 shadow-sm overflow-hidden transition-colors"
      >
        {rows.map((row, index) => (
          <TierRow
            key={row.id}
            row={row}
            index={index}
            totalRows={rows.length}
            shape={shape}
            onRename={(newLabel) => onRenameRow(row.id, newLabel)}
            onChangeColor={(newColor) => onChangeRowColor(row.id, newColor)}
            onMoveUp={() => onMoveRow(index, 'up')}
            onMoveDown={() => onMoveRow(index, 'down')}
            onAddAbove={() => onAddRow(index, 'above')}
            onAddBelow={() => onAddRow(index, 'below')}
            onClearRow={() => onClearRow(row.id)}
            onDeleteRow={() => onDeleteRow(row.id)}
            onDropImage={onDropImage}
            onReturnToPool={onReturnToPool}
          />
        ))}

        {rows.length === 0 && (
          <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No tier rows. Use the reset button or add a row.
          </div>
        )}
      </div>
    );
  }
);

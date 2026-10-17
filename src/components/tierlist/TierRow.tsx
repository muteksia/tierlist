'use client';

import React from 'react';
import { TierRowData, ImageShape } from '@/types/tierlist';
import { TierLabel } from './TierLabel';
import { TierSlot } from './TierSlot';
import { RowControls } from './RowControls';

interface TierRowProps {
  row: TierRowData;
  index: number;
  totalRows: number;
  shape: ImageShape;
  onRename: (newLabel: string) => void;
  onChangeColor: (newColor: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddAbove: () => void;
  onAddBelow: () => void;
  onClearRow: () => void;
  onDeleteRow: () => void;
  onDropImage: (
    imageId: string,
    sourceContainerId: string,
    destContainerId: string,
    targetIndex?: number
  ) => void;
  onReturnToPool: (imageId: string) => void;
}

export function TierRow({
  row,
  index,
  totalRows,
  shape,
  onRename,
  onChangeColor,
  onMoveUp,
  onMoveDown,
  onAddAbove,
  onAddBelow,
  onClearRow,
  onDeleteRow,
  onDropImage,
  onReturnToPool,
}: TierRowProps) {
  return (
    <div className="flex w-full min-h-[80px] border-b border-zinc-300/80 dark:border-zinc-800/80 last:border-b-0 group">
      {/* [T] Tier Label */}
      <TierLabel label={row.label} color={row.color} onRename={onRename} />

      {/* [____] Drop Area */}
      <TierSlot
        rowId={row.id}
        images={row.images}
        shape={shape}
        onDropImage={onDropImage}
        onReturnToPool={onReturnToPool}
      />

      {/* [S] [<>] Controls (excluded during export) */}
      <RowControls
        rowIndex={index}
        totalRows={totalRows}
        currentColor={row.color}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onAddAbove={onAddAbove}
        onAddBelow={onAddBelow}
        onClearRow={onClearRow}
        onDeleteRow={onDeleteRow}
        onChangeColor={onChangeColor}
      />
    </div>
  );
}

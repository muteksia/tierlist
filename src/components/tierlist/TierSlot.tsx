'use client';

import React, { useState } from 'react';
import { ImageItem, ImageShape, DragItemPayload } from '@/types/tierlist';
import { TierImageCard } from './TierImageCard';

interface TierSlotProps {
  rowId: string;
  images: ImageItem[];
  shape: ImageShape;
  onDropImage: (
    imageId: string,
    sourceContainerId: string,
    destContainerId: string,
    targetIndex?: number
  ) => void;
  onReturnToPool: (imageId: string) => void;
}

export function TierSlot({
  rowId,
  images,
  shape,
  onDropImage,
  onReturnToPool,
}: TierSlotProps) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isOver) setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    // Check if leaving to outside container
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex?: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);

    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;
      const data = JSON.parse(dataStr) as DragItemPayload;
      if (data && data.imageId) {
        onDropImage(data.imageId, data.sourceContainerId, rowId, targetIndex);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e)}
      className={`flex-1 min-h-[80px] p-2 flex flex-wrap gap-2 items-center content-start transition-colors duration-150 ${
        isOver
          ? 'bg-blue-500/10 dark:bg-blue-500/20 ring-2 ring-inset ring-blue-500/50'
          : 'bg-transparent'
      }`}
    >
      {images.map((img, idx) => (
        <div
          key={img.id}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => handleDrop(e, idx)}
        >
          <TierImageCard
            image={img}
            sourceContainerId={rowId}
            shape={shape}
            index={idx}
            onReturnToPool={onReturnToPool}
          />
        </div>
      ))}
      {images.length === 0 && (
        <div className="w-full h-16 flex items-center justify-center text-xs text-zinc-500/60 dark:text-zinc-400/40 italic pointer-events-none select-none">
          Drop images here
        </div>
      )}
    </div>
  );
}

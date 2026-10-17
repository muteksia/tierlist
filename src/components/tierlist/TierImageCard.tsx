'use client';

import React, { useState } from 'react';
import { ImageItem, ImageShape, DragItemPayload } from '@/types/tierlist';
import { X, CornerDownLeft } from 'lucide-react';

interface TierImageCardProps {
  image: ImageItem;
  sourceContainerId: string; // 'pool' or rowId
  shape: ImageShape;
  index: number;
  onRemove?: (imageId: string) => void;
  onReturnToPool?: (imageId: string) => void;
}

export function TierImageCard({
  image,
  sourceContainerId,
  shape,
  index,
  onRemove,
  onReturnToPool,
}: TierImageCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const getShapeClasses = (imageShape: ImageShape) => {
    switch (imageShape) {
      case 'square':
        return 'w-20 h-20 aspect-square object-cover rounded-md';
      case 'landscape':
        return 'w-28 h-[70px] aspect-video object-cover rounded-md';
      case 'portrait':
        return 'w-16 h-[85px] aspect-[3/4] object-cover rounded-md';
      case 'round':
        return 'w-20 h-20 aspect-square object-cover rounded-full';
      case 'no-crop':
        return 'h-20 max-w-[120px] w-auto object-contain rounded-md bg-black/10 dark:bg-black/30';
      default:
        return 'w-20 h-20 aspect-square object-cover rounded-md';
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const payload: DragItemPayload & { index: number } = {
      imageId: image.id,
      sourceContainerId,
      index,
    };
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-image-id={image.id}
      data-index={index}
      className={`group relative inline-flex items-center justify-center cursor-grab active:cursor-grabbing select-none transition-transform duration-150 hover:scale-[1.03] ${
        isDragging ? 'opacity-40 scale-95' : 'opacity-100'
      }`}
      title={image.name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={image.name}
        className={`shadow-sm border border-black/10 dark:border-white/10 pointer-events-none select-none ${getShapeClasses(
          shape
        )}`}
        loading="lazy"
      />

      {/* Action button on hover (hidden on export) */}
      <div className="hide-on-export absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {sourceContainerId !== 'pool' ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReturnToPool?.(image.id);
            }}
            title="Unassign to dock"
            className="w-5 h-5 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center shadow-md transition-colors"
          >
            <CornerDownLeft className="w-3 h-3" />
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(image.id);
            }}
            title="Delete image"
            className="w-5 h-5 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

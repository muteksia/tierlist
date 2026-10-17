'use client';

import React, { useRef, useState } from 'react';
import { ImageItem, ImageShape, DragItemPayload } from '@/types/tierlist';
import { TierImageCard } from './TierImageCard';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

interface ImagePoolDockProps {
  images: ImageItem[];
  shape: ImageShape;
  onAddImages: (files: File[]) => void;
  onDeleteImage: (imageId: string) => void;
  onDropImage: (
    imageId: string,
    sourceContainerId: string,
    destContainerId: string,
    targetIndex?: number
  ) => void;
}

export function ImagePoolDock({
  images,
  shape,
  onAddImages,
  onDeleteImage,
  onDropImage,
}: ImagePoolDockProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddImages(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex?: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    // Case 1: Dropping files directly from desktop / file manager
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddImages(Array.from(e.dataTransfer.files));
      return;
    }

    // Case 2: Dropping existing tier item back to pool dock
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;
      const data = JSON.parse(dataStr) as DragItemPayload;
      if (data && data.imageId) {
        onDropImage(data.imageId, data.sourceContainerId, 'pool', targetIndex);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full mt-6 space-y-3">
      {/* Header and Upload Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-zinc-500" />
          <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
            Unranked Images ({images.length})
          </h2>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-sm transition-colors cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            Upload Images
          </button>
        </div>
      </div>

      {/* Drop Target and Thumbnail Grid */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e)}
        className={`min-h-[140px] rounded-xl p-4 border transition-all duration-200 flex flex-wrap gap-3 items-center content-start ${
          isDragOver
            ? 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500 ring-2 ring-blue-500/30'
            : 'bg-zinc-100/80 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800'
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
              sourceContainerId="pool"
              shape={shape}
              index={idx}
              onRemove={onDeleteImage}
            />
          </div>
        ))}

        {images.length === 0 && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-8 flex flex-col items-center justify-center text-center cursor-pointer select-none space-y-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            <UploadCloud className="w-8 h-8 stroke-1" />
            <p className="text-sm font-medium">
              Upload images or drag & drop files here
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Drag images back here to unassign them from tier rows
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

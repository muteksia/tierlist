'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  TierListState,
  TierRowData,
  ImageItem,
  ImageShape,
  DEFAULT_TIERS,
  DEFAULT_CANVAS_BG,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  TIER_COLOR_PALETTE,
} from '@/types/tierlist';

const createInitialRows = (): TierRowData[] =>
  DEFAULT_TIERS.map((tier) => ({
    ...tier,
    images: [],
  }));

const getInitialState = (): TierListState => ({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  imageShape: 'square',
  canvasBgColor: DEFAULT_CANVAS_BG,
  rows: createInitialRows(),
  poolImages: [],
});

export function useTierListState() {
  const [state, setState] = useState<TierListState>(getInitialState);
  const trackedUrlsRef = useRef<Set<string>>(new Set());

  // Track created object URLs for cleanup on unmount
  useEffect(() => {
    const urls = trackedUrlsRef.current;
    return () => {
      urls.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      });
      urls.clear();
    };
  }, []);

  const setTitle = useCallback((title: string) => {
    setState((prev) => ({ ...prev, title }));
  }, []);

  const setDescription = useCallback((description: string) => {
    setState((prev) => ({ ...prev, description }));
  }, []);

  const setImageShape = useCallback((imageShape: ImageShape) => {
    setState((prev) => ({ ...prev, imageShape }));
  }, []);

  const setCanvasBgColor = useCallback((canvasBgColor: string) => {
    setState((prev) => ({ ...prev, canvasBgColor }));
  }, []);

  const addPoolImages = useCallback((files: File[]) => {
    const validFiles = files.filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    const newItems: ImageItem[] = validFiles.map((file) => {
      const url = URL.createObjectURL(file);
      trackedUrlsRef.current.add(url);
      return {
        id: crypto.randomUUID(),
        url,
        name: file.name,
      };
    });

    setState((prev) => ({
      ...prev,
      poolImages: [...prev.poolImages, ...newItems],
    }));
  }, []);

  const deletePoolImage = useCallback((imageId: string) => {
    setState((prev) => {
      const item = prev.poolImages.find((img) => img.id === imageId);
      if (item) {
        try {
          URL.revokeObjectURL(item.url);
          trackedUrlsRef.current.delete(item.url);
        } catch {
          // ignore
        }
      }
      return {
        ...prev,
        poolImages: prev.poolImages.filter((img) => img.id !== imageId),
      };
    });
  }, []);

  const moveRow = useCallback((index: number, direction: 'up' | 'down') => {
    setState((prev) => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.rows.length) return prev;

      const newRows = [...prev.rows];
      const temp = newRows[index];
      newRows[index] = newRows[targetIndex];
      newRows[targetIndex] = temp;

      return { ...prev, rows: newRows };
    });
  }, []);

  const addRow = useCallback(
    (targetIndex: number, position: 'above' | 'below') => {
      setState((prev) => {
        const insertIndex = position === 'above' ? targetIndex : targetIndex + 1;
        const color = TIER_COLOR_PALETTE[prev.rows.length % TIER_COLOR_PALETTE.length];
        const newRow: TierRowData = {
          id: `tier-${crypto.randomUUID()}`,
          label: 'NEW',
          color,
          images: [],
        };

        const newRows = [...prev.rows];
        newRows.splice(insertIndex, 0, newRow);
        return { ...prev, rows: newRows };
      });
    },
    []
  );

  const deleteRow = useCallback((rowId: string) => {
    setState((prev) => {
      const targetRow = prev.rows.find((r) => r.id === rowId);
      if (!targetRow) return prev;

      // Safely return any contained images to pool dock
      const updatedPool = [...prev.poolImages, ...targetRow.images];
      const updatedRows = prev.rows.filter((r) => r.id !== rowId);

      return {
        ...prev,
        poolImages: updatedPool,
        rows: updatedRows,
      };
    });
  }, []);

  const clearRowImages = useCallback((rowId: string) => {
    setState((prev) => {
      const targetRow = prev.rows.find((r) => r.id === rowId);
      if (!targetRow || targetRow.images.length === 0) return prev;

      const updatedPool = [...prev.poolImages, ...targetRow.images];
      const updatedRows = prev.rows.map((r) =>
        r.id === rowId ? { ...r, images: [] } : r
      );

      return {
        ...prev,
        poolImages: updatedPool,
        rows: updatedRows,
      };
    });
  }, []);

  const updateTierRow = useCallback(
    (rowId: string, updates: Partial<TierRowData>) => {
      setState((prev) => ({
        ...prev,
        rows: prev.rows.map((row) =>
          row.id === rowId ? { ...row, ...updates } : row
        ),
      }));
    },
    []
  );

  const moveImage = useCallback(
    (
      imageId: string,
      sourceContainerId: string,
      destContainerId: string,
      targetIndex?: number
    ) => {
      setState((prev) => {
        let draggedImage: ImageItem | undefined;

        // Locate dragged item
        if (sourceContainerId === 'pool') {
          draggedImage = prev.poolImages.find((img) => img.id === imageId);
        } else {
          const sourceRow = prev.rows.find((r) => r.id === sourceContainerId);
          draggedImage = sourceRow?.images.find((img) => img.id === imageId);
        }

        if (!draggedImage) return prev;

        // Same container reorder
        if (sourceContainerId === destContainerId) {
          if (sourceContainerId === 'pool') {
            const currentImages = [...prev.poolImages];
            const currentIndex = currentImages.findIndex((img) => img.id === imageId);
            if (currentIndex === -1) return prev;
            currentImages.splice(currentIndex, 1);
            const insertAt =
              typeof targetIndex === 'number' && targetIndex >= 0
                ? Math.min(targetIndex, currentImages.length)
                : currentImages.length;
            currentImages.splice(insertAt, 0, draggedImage);
            return { ...prev, poolImages: currentImages };
          } else {
            const updatedRows = prev.rows.map((row) => {
              if (row.id !== sourceContainerId) return row;
              const currentImages = [...row.images];
              const currentIndex = currentImages.findIndex((img) => img.id === imageId);
              if (currentIndex === -1) return row;
              currentImages.splice(currentIndex, 1);
              const insertAt =
                typeof targetIndex === 'number' && targetIndex >= 0
                  ? Math.min(targetIndex, currentImages.length)
                  : currentImages.length;
              currentImages.splice(insertAt, 0, draggedImage);
              return { ...row, images: currentImages };
            });
            return { ...prev, rows: updatedRows };
          }
        }

        // Cross container move
        let newPoolImages = [...prev.poolImages];
        let newRows = prev.rows.map((r) => ({ ...r, images: [...r.images] }));

        // 1. Remove from source
        if (sourceContainerId === 'pool') {
          newPoolImages = newPoolImages.filter((img) => img.id !== imageId);
        } else {
          newRows = newRows.map((r) =>
            r.id === sourceContainerId
              ? { ...r, images: r.images.filter((img) => img.id !== imageId) }
              : r
          );
        }

        // 2. Add to destination
        if (destContainerId === 'pool') {
          const insertAt =
            typeof targetIndex === 'number' && targetIndex >= 0
              ? Math.min(targetIndex, newPoolImages.length)
              : newPoolImages.length;
          newPoolImages.splice(insertAt, 0, draggedImage);
        } else {
          newRows = newRows.map((r) => {
            if (r.id !== destContainerId) return r;
            const updated = [...r.images];
            const insertAt =
              typeof targetIndex === 'number' && targetIndex >= 0
                ? Math.min(targetIndex, updated.length)
                : updated.length;
            updated.splice(insertAt, 0, draggedImage);
            return { ...r, images: updated };
          });
        }

        return {
          ...prev,
          poolImages: newPoolImages,
          rows: newRows,
        };
      });
    },
    []
  );

  const resetState = useCallback((mode: 'full' | 'images-only') => {
    if (mode === 'images-only') {
      setState((prev) => {
        // Collect all images from rows and move back to pool dock
        const rowImages = prev.rows.flatMap((r) => r.images);
        const updatedRows = prev.rows.map((r) => ({ ...r, images: [] }));
        return {
          ...prev,
          rows: updatedRows,
          poolImages: [...prev.poolImages, ...rowImages],
        };
      });
    } else {
      // Full reset: revoke all URLs and restore defaults
      trackedUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      });
      trackedUrlsRef.current.clear();
      setState(getInitialState());
    }
  }, []);

  return {
    state,
    setTitle,
    setDescription,
    setImageShape,
    setCanvasBgColor,
    addPoolImages,
    deletePoolImage,
    moveRow,
    addRow,
    deleteRow,
    clearRowImages,
    updateTierRow,
    moveImage,
    resetState,
  };
}

'use client';

import React, { useRef, useState } from 'react';
import { useTierListState } from './useTierListState';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import { HeaderSection } from './HeaderSection';
import { Toolbar } from './Toolbar';
import { TierListCanvas } from './TierListCanvas';
import { ImagePoolDock } from './ImagePoolDock';
import { ConfirmDialog } from './ConfirmDialog';
import { toPng } from 'html-to-image';

export function TierListBoard() {
  const {
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
  } = useTierListState();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const handleExport = async () => {
    if (!canvasRef.current || isExporting) return;
    setIsExporting(true);

    try {
      const dataUrl = await toPng(canvasRef.current, {
        cacheBust: false,
        skipFonts: true,
        pixelRatio: 2,
        filter: (node) => {
          if (node instanceof HTMLElement) {
            if (
              node.classList?.contains('hide-on-export') ||
              node.getAttribute('data-export-hide') === 'true'
            ) {
              return false;
            }
          }
          return true;
        },
      });

      const link = document.createElement('a');
      link.download = `tier-list-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null
          ? JSON.stringify(err)
          : String(err);
      console.error('Failed to export tier list image:', errorMessage, err);
      alert('Could not export tier list image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className={`w-full mx-auto px-4 py-8 sm:py-12 flex flex-col flex-1 transition-all duration-300 ease-in-out ${
        isPresentationMode ? 'max-w-[96vw]' : 'max-w-5xl'
      }`}
    >
      {/* Top Application Header */}
      <AppHeader
        isPresentationMode={isPresentationMode}
        onTogglePresentationMode={() => setIsPresentationMode((prev) => !prev)}
      />

      {/* Header section: Editable Title & Description */}
      <HeaderSection
        title={state.title}
        description={state.description}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
      />

      {/* Toolbar: Shapes, Canvas Bg, Reset, Export */}
      <Toolbar
        imageShape={state.imageShape}
        canvasBgColor={state.canvasBgColor}
        isExporting={isExporting}
        onImageShapeChange={setImageShape}
        onCanvasBgColorChange={setCanvasBgColor}
        onOpenResetDialog={() => setIsResetDialogOpen(true)}
        onExport={handleExport}
      />

      {/* Main Tier List Canvas (Capture Target) */}
      <TierListCanvas
        ref={canvasRef}
        rows={state.rows}
        shape={state.imageShape}
        canvasBgColor={state.canvasBgColor}
        onRenameRow={(rowId, newLabel) => updateTierRow(rowId, { label: newLabel })}
        onChangeRowColor={(rowId, newColor) => updateTierRow(rowId, { color: newColor })}
        onMoveRow={moveRow}
        onAddRow={addRow}
        onClearRow={clearRowImages}
        onDeleteRow={deleteRow}
        onDropImage={moveImage}
        onReturnToPool={(imgId) => {
          // Find source row
          const sourceRow = state.rows.find((r) =>
            r.images.some((img) => img.id === imgId)
          );
          if (sourceRow) {
            moveImage(imgId, sourceRow.id, 'pool');
          }
        }}
      />

      {/* Image Upload Dock (Unranked Images) */}
      <ImagePoolDock
        images={state.poolImages}
        shape={state.imageShape}
        onAddImages={addPoolImages}
        onDeleteImage={deletePoolImage}
        onDropImage={moveImage}
      />

      {/* Application Footer */}
      <AppFooter />

      {/* Confirmation Modal for Reset Actions */}
      <ConfirmDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onClearImages={() => resetState('images-only')}
        onFullReset={() => resetState('full')}
      />
    </div>
  );
}

export type ImageShape = 'square' | 'landscape' | 'portrait' | 'round' | 'no-crop';

export interface ImageItem {
  id: string;
  url: string;
  name: string;
}

export interface TierRowData {
  id: string;
  label: string;
  color: string;
  images: ImageItem[];
}

export interface DragItemPayload {
  imageId: string;
  sourceContainerId: string; // 'pool' or row id
}

export interface TierListState {
  title: string;
  description: string;
  imageShape: ImageShape;
  canvasBgColor: string;
  rows: TierRowData[];
  poolImages: ImageItem[];
}

export const DEFAULT_TIER_COLORS = {
  S: '#FF7E7E',
  A: '#FFB87E',
  B: '#FFE07E',
  C: '#A5F58D',
  D: '#8DDAF5',
  F: '#D8A8F8',
} as const;

export const DEFAULT_TIERS: Omit<TierRowData, 'images'>[] = [
  { id: 'tier-s', label: 'S', color: DEFAULT_TIER_COLORS.S },
  { id: 'tier-a', label: 'A', color: DEFAULT_TIER_COLORS.A },
  { id: 'tier-b', label: 'B', color: DEFAULT_TIER_COLORS.B },
  { id: 'tier-c', label: 'C', color: DEFAULT_TIER_COLORS.C },
  { id: 'tier-d', label: 'D', color: DEFAULT_TIER_COLORS.D },
];

export const TIER_COLOR_PALETTE = [
  '#FF7E7E',
  '#FFB87E',
  '#FFE07E',
  '#A5F58D',
  '#8DDAF5',
  '#D8A8F8',
  '#FCA5A5',
  '#FDBA74',
  '#FDE047',
  '#86EFAC',
  '#93C5FD',
  '#C4B5FD',
  '#F472B6',
  '#E2E8F0',
  '#94A3B8',
];

export const CANVAS_BG_SWATCHES = [
  { label: 'Deep Zinc', value: '#18181b' },
  { label: 'Pure Dark', value: '#09090b' },
  { label: 'Clean Slate', value: '#334155' },
  { label: 'Soft Light', value: '#f4f4f5' },
  { label: 'Warm Sand', value: '#fdfbf7' },
];

export const DEFAULT_CANVAS_BG = '#18181b';
export const DEFAULT_TITLE = 'Title';
export const DEFAULT_DESCRIPTION = 'Description';

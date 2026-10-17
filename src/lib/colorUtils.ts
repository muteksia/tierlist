/**
 * Determines whether text on top of the given hex color should be light or dark.
 * Returns true if the background is dark (meaning text should be white), false otherwise.
 */
export function isDarkColor(hexColor: string): boolean {
  let hex = hexColor.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  if (hex.length !== 6) return false;

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Relative luminance estimation
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 140;
}

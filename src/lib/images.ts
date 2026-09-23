import { imageAssets, type ImageAssetId } from '../generated/imageAssets';

const BASE = '/images';
export const FORMATS = ['avif', 'webp'] as const;

export function assetInfo(id: ImageAssetId) {
  return imageAssets[id];
}

export function srcSet(id: ImageAssetId, ext: string) {
  const a = imageAssets[id];
  return a.widths.map((w) => `${BASE}/${id}-${w}.${ext} ${w}w`).join(', ');
}

/** Largest JPEG, used as <img src> fallback and for Open Graph. */
export function fallbackSrc(id: ImageAssetId, maxWidth = 1200) {
  const a = imageAssets[id];
  const w = [...a.widths].reverse().find((x) => x <= maxWidth) ?? a.widths[0];
  return `${BASE}/${id}-${w}.jpg`;
}

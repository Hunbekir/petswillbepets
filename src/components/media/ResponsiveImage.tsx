import type { CSSProperties } from 'react';
import type { ImageRole } from '../../content/types';
import { FORMATS, assetInfo, fallbackSrc, srcSet } from '../../lib/images';

interface Props {
  role: ImageRole;
  /** The `sizes` attribute — describe the rendered width per breakpoint. */
  sizes: string;
  /** Above-the-fold hero only: eager load + high fetch priority. */
  priority?: boolean;
  /**
   * cover: fills a sized frame (frame sets aspect/height), honoring role.focus.
   * natural: intrinsic aspect ratio, never cropped.
   */
  fit?: 'cover' | 'natural';
  className?: string;
}

/**
 * <picture> with AVIF → WebP → JPEG. width/height are always set from the
 * generated manifest so the browser reserves space (no layout shift).
 */
export function ResponsiveImage({ role, sizes, priority, fit = 'cover', className }: Props) {
  if (!role.asset) {
    if (import.meta.env.DEV) {
      return (
        <div className={`img-missing ${className ?? ''}`} role="note">
          Missing asset — {role.note ?? role.alt}
        </div>
      );
    }
    return null;
  }

  const info = assetInfo(role.asset);
  const m = role.focus?.mobile;
  const d = role.focus?.desktop ?? m;
  const style = {
    '--fx': `${m?.x ?? 50}%`,
    '--fy': `${m?.y ?? 50}%`,
    '--fz': m?.zoom ?? 1,
    '--fx-d': `${d?.x ?? 50}%`,
    '--fy-d': `${d?.y ?? 50}%`,
    '--fz-d': d?.zoom ?? 1,
  } as CSSProperties;

  return (
    <picture className={`rimg rimg--${fit} ${className ?? ''}`} style={style}>
      {FORMATS.map((ext) => (
        <source key={ext} type={`image/${ext}`} srcSet={srcSet(role.asset!, ext)} sizes={sizes} />
      ))}
      <img
        src={fallbackSrc(role.asset)}
        srcSet={srcSet(role.asset, 'jpg')}
        sizes={sizes}
        width={info.width}
        height={info.height}
        alt={role.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  );
}

import type { SectionCopy as Copy } from '../../content/types';

interface Props {
  copy: Copy;
  /** Heading level. The hero owns the page's only h1. */
  level?: 1 | 2;
  size?: 'display' | 'xl' | 'lg';
  className?: string;
}

export function SectionCopy({ copy, level = 2, size = 'xl', className = '' }: Props) {
  const H = level === 1 ? 'h1' : 'h2';
  return (
    <div className={`copy ${className}`}>
      {copy.eyebrow && <p className="eyebrow">{copy.eyebrow}</p>}
      <H className={`headline headline--${size}`}>{copy.headline}</H>
      {copy.body && <p className="lede">{copy.body}</p>}
    </div>
  );
}

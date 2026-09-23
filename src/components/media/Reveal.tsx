import type { ElementType, ReactNode } from 'react';
import { useInView } from '../../lib/useInView';

interface Props {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Stagger in ms. */
  delay?: number;
  onView?: () => void;
}

/** Gentle opacity/translate reveal. Disabled under prefers-reduced-motion (CSS). */
export function Reveal({ as: Tag = 'div', className = '', children, delay = 0, onView }: Props) {
  const { ref, inView } = useInView<HTMLElement>(onView, 0.15);
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

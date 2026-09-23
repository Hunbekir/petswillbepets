import { useEffect, useRef, useState } from 'react';

/**
 * Fires once when the element first enters the viewport. Used for reveal
 * motion and "viewed" analytics. SSR-safe: starts false, content stays visible
 * without JS because the reveal CSS only applies under html.js.
 */
export function useInView<T extends Element>(onEnter?: () => void, threshold = 0.25) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const cb = useRef(onEnter);
  cb.current = onEnter;

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          cb.current?.();
          io.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

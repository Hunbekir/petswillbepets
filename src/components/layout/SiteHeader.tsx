import { useEffect, useRef, useState } from 'react';
import { brand } from '../../content/brand';
import { BrandMark } from './BrandMark';

export interface MenuLink {
  label: string;
  href: string;
}

interface Props {
  /** Label for the right-hand CTA (resolved from launch mode). */
  ctaLabel: string;
  ctaHref: string;
  shopHref: string;
  /** In-page chapters listed in the menu. */
  menuLinks: MenuLink[];
  /** Element id of the full-screen hero; header is transparent while it is on screen. */
  heroId?: string;
}

export function SiteHeader({ ctaLabel, ctaHref, shopHref, menuLinks, heroId }: Props) {
  const [solid, setSolid] = useState(!heroId);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Transparent over the hero, warm off-white once the hero has mostly scrolled away.
  useEffect(() => {
    if (!heroId) return;
    const hero = document.getElementById(heroId);
    if (!hero || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting), {
      rootMargin: '-72px 0px 0px 0px',
      threshold: 0,
    });
    io.observe(hero);
    return () => io.disconnect();
  }, [heroId]);

  // Menu: Escape closes, focus moves in and returns to the toggle, background doesn't scroll.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add('menu-open');
    const first = menuRef.current?.querySelector<HTMLElement>('a, button');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'Tab' && menuRef.current) {
        const items = [...menuRef.current.querySelectorAll<HTMLElement>('a, button')];
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      root.classList.remove('menu-open');
      document.removeEventListener('keydown', onKey);
      toggleRef.current?.focus();
    };
  }, [open]);

  const state = open ? 'open' : solid ? 'solid' : 'clear';

  return (
    <header className="site-header" data-state={state}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="site-header__bar">
        <a className="brandmark" href={brand.homeHref} aria-label={`${brand.name} — home`}>
          <BrandMark onDark={state === 'clear'} />
        </a>
        <nav className="site-header__nav" aria-label="Primary">
          <a className="site-header__link" href={shopHref}>
            Shop
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="site-header__link site-header__menu-btn"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
          <a className="btn btn--small site-header__cta" href={ctaHref}>
            {ctaLabel}
          </a>
        </nav>
      </div>

      <div
        id="site-menu"
        ref={menuRef}
        className="site-menu"
        hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="site-menu__inner">
          <p className="eyebrow">On this page</p>
          <ul className="site-menu__list">
            {menuLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn--primary site-menu__cta" href={ctaHref} onClick={() => setOpen(false)}>
            {ctaLabel}
          </a>
        </div>
      </div>
    </header>
  );
}

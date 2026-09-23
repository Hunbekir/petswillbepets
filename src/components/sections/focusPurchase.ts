import type { MouseEvent } from 'react';

export const PURCHASE_INPUT_ID = 'purchase-email';

/**
 * In-page CTAs that point at #purchase scroll there and put focus in the email
 * field (waitlist) or the purchase module, so keyboard and screen-reader users
 * land where the action is.
 */
export function focusPurchase(e: MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById('purchase');
  if (!target) return;
  e.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', '#purchase');
  const input = document.getElementById(PURCHASE_INPUT_ID) ?? target.querySelector<HTMLElement>('button, a');
  window.setTimeout(() => input?.focus({ preventScroll: true }), reduce ? 0 : 450);
}

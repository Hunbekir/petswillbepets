import type { LaunchMode, ProductConfig } from '../content/types';
import { commerce } from './commerce';

/**
 * The launch mode the page actually renders. "preorder" and "live" need a real
 * price, SKU and a connected cart; anything missing falls back to "waitlist" so
 * no button ever leads nowhere.
 */
export function resolveLaunchMode(product: ProductConfig): LaunchMode {
  const { launchMode, price, sku } = product.commerce;
  if (launchMode === 'waitlist') return 'waitlist';
  if (!price || !sku || !commerce.cartConfigured()) return 'waitlist';
  return launchMode;
}

export function primaryCtaLabel(product: ProductConfig): string {
  return product.ctaLabels[resolveLaunchMode(product)];
}

export function formatMoney({ amount, currencyCode }: { amount: string; currencyCode: string }) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(Number(amount));
}

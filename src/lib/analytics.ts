/**
 * Typed analytics events. No provider is connected: events are pushed to
 * window.dataLayer (if a tag manager is later installed it picks them up) and
 * re-dispatched as a DOM CustomEvent "pwbp:analytics" for any other listener.
 */

export type AnalyticsEvent =
  | { name: 'hero_cta_clicked'; productId: string; cta: 'primary' | 'secondary'; launchMode: string }
  | { name: 'feature_viewed'; productId: string; featureId: string }
  | { name: 'carry_mechanism_viewed'; productId: string; step?: 'tie' | 'clip' | 'walk' }
  | { name: 'purchase_module_viewed'; productId: string; launchMode: string }
  | { name: 'add_to_cart_clicked'; productId: string; sku: string; quantity: number; purchaseOption: 'one_time' | 'subscription' }
  | { name: 'waitlist_submitted'; productId: string; source: string; ok: boolean };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return;
  const { name, ...params } = event;
  window.dataLayer?.push({ event: name, ...params });
  window.dispatchEvent(new CustomEvent('pwbp:analytics', { detail: event }));
  if (import.meta.env.DEV) console.debug('[analytics]', name, params);
}

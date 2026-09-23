import { site } from '../content/site';

/**
 * Commerce adapter. The page talks only to this interface; a Shopify (or other)
 * integration replaces the default by calling setCommerceAdapter() at startup.
 */

export interface CartLine {
  productId: string;
  sku: string;
  quantity: number;
  purchaseOption: 'one_time' | 'subscription';
  subscriptionIntervalDays?: number;
}

export interface WaitlistEntry {
  email: string;
  productId: string;
  source: string;
}

export type CommerceResult =
  | { ok: true; mode: 'sent' | 'preview'; redirectUrl?: string }
  | { ok: false; message: string };

export interface CommerceAdapter {
  /** True when addToCart is wired to a real cart. Gates preorder/live modes. */
  cartConfigured(): boolean;
  addToCart(line: CartLine): Promise<CommerceResult>;
  joinWaitlist(entry: WaitlistEntry): Promise<CommerceResult>;
}

const defaultAdapter: CommerceAdapter = {
  cartConfigured: () => false,

  async addToCart() {
    return { ok: false, message: 'Checkout is not open yet.' };
  },

  async joinWaitlist(entry) {
    if (!site.waitlistEndpoint) {
      // No service connected: be explicit rather than pretend it was stored.
      return { ok: true, mode: 'preview' };
    }
    try {
      const res = await fetch(site.waitlistEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(entry),
      });
      if (!res.ok) return { ok: false, message: 'Something went wrong. Please try again.' };
      return { ok: true, mode: 'sent' };
    } catch {
      return { ok: false, message: 'We couldn’t reach the server. Please try again.' };
    }
  },
};

let active: CommerceAdapter = defaultAdapter;

export function setCommerceAdapter(adapter: CommerceAdapter) {
  active = adapter;
}

/** Stable facade so callers never hold a stale adapter reference. */
export const commerce: CommerceAdapter = {
  cartConfigured: () => active.cartConfigured(),
  addToCart: (line) => active.addToCart(line),
  joinWaitlist: (entry) => active.joinWaitlist(entry),
};

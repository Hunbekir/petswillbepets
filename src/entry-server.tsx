import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App';
import { products, productRoute } from './content/products';
import { guardedTerms } from './content/productClaims';
import { isClaimLive } from './lib/claims';
import { productHead } from './lib/seo';
import type { ClaimId } from './content/productClaims';

export const routes = products.map((p) => ({ path: productRoute(p), product: p }));

export function render(path: string) {
  const route = routes.find((r) => r.path === path);
  if (!route) throw new Error(`No route for ${path}`);
  const html = renderToString(
    <StrictMode>
      <App pathname={path} />
    </StrictMode>,
  );
  return { html, head: productHead(route.product) };
}

/** Patterns that must not appear in rendered text because their claim is not live. */
export function blockedTerms(): { claimId: string; pattern: RegExp }[] {
  return Object.entries(guardedTerms)
    .filter(([id]) => !isClaimLive(id as ClaimId))
    .map(([claimId, pattern]) => ({ claimId, pattern }));
}

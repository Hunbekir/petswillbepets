import { productClaims, type ClaimId, type ProductClaim } from '../content/productClaims';

/** True only when a claim is verified, evidenced and has approved wording. */
export function isClaimLive(id: ClaimId): boolean {
  const c: ProductClaim = productClaims[id];
  return c.status === 'verified' && !!c.supportingEvidence && !!c.approvedCustomerCopy;
}

/** Approved customer copy for a live claim, otherwise null. */
export function claimCopy(id: ClaimId): string | null {
  return isClaimLive(id) ? productClaims[id].approvedCustomerCopy : null;
}

/** Filter any list of items carrying a claimId down to the live ones. */
export function liveOnly<T extends { claimId: ClaimId }>(items: readonly T[]): T[] {
  return items.filter((item) => isClaimLive(item.claimId));
}

export function claimsForProduct(productId: string) {
  return (Object.entries(productClaims) as [ClaimId, ProductClaim][]).filter(
    ([, c]) => c.products.includes(productId) || c.products.includes('*'),
  );
}

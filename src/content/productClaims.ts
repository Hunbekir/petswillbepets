/**
 * Claim control — the single source of truth for every factual statement the
 * product pages are allowed to make.
 *
 * Rules
 * - Only claims with status "verified" AND a non-null approvedCustomerCopy can
 *   render on a live page. Everything else is filtered out by `lib/claims.ts`.
 * - "provisional" = believed true or designed-for, but not yet evidenced.
 *   Moving a claim to "verified" requires the evidence to be recorded here
 *   (test report, supplier certificate, spec sheet reference) in the same change.
 * - "rejected" = never use. These are kept on file so nobody reintroduces them;
 *   the prerender step also scans page output for the banned terms below.
 *
 * Packaging photography may already show provisional copy. That is accepted
 * because the photos cannot be edited; the page itself must not repeat it.
 */

export type ClaimStatus = 'provisional' | 'verified' | 'rejected';

export interface ProductClaim {
  /** Internal statement of the claim, as it would be asserted. */
  claim: string;
  status: ClaimStatus;
  /** Where the proof lives. Required before status can be "verified". */
  supportingEvidence: string | null;
  /** Exact customer-facing wording. Null = not approved for display. */
  approvedCustomerCopy: string | null;
  /** Product ids this claim applies to. */
  products: readonly string[];
  /** Internal note for whoever validates the claim next. */
  note?: string;
}

const WB = ['waste-bags'] as const;

export const productClaims = {
  // ── Product format: confirmed in the finalized product specification ──────
  'wb-count-120': {
    claim: '120 bags per box',
    status: 'verified',
    supportingEvidence: 'Finalized product specification, waste-bag launch brief (Sep 2026).',
    approvedCustomerCopy: '120 bags',
    products: WB,
  },
  'wb-rolls-8': {
    claim: '8 compact rolls per box',
    status: 'verified',
    supportingEvidence: 'Finalized product specification, waste-bag launch brief (Sep 2026).',
    approvedCustomerCopy: '8 rolls',
    products: WB,
  },
  'wb-per-roll-15': {
    claim: '15 bags per roll',
    status: 'verified',
    supportingEvidence: 'Finalized product specification, waste-bag launch brief (Sep 2026).',
    approvedCustomerCopy: '15 bags per roll',
    products: WB,
  },
  'wb-size-9x13': {
    claim: 'Bag measures approximately 9 × 13 inches',
    status: 'verified',
    supportingEvidence: 'Finalized product specification, waste-bag launch brief (Sep 2026). Stated as approximate.',
    approvedCustomerCopy: 'Approx. 9 × 13 in',
    products: WB,
    note: 'Re-measure against the first production sample; keep the word "approx." until then.',
  },

  // ── Provisional: shown on packaging artwork, not yet evidenced ────────────
  'wb-unscented': {
    claim: 'Unscented',
    status: 'provisional',
    supportingEvidence: null,
    approvedCustomerCopy: null,
    products: WB,
    note: 'Printed on packaging render. Needs confirmation in the factory material spec.',
  },
  'wb-standard-dispenser-fit': {
    claim: 'Rolls fit standard dispensers',
    status: 'provisional',
    supportingEvidence: null,
    approvedCustomerCopy: null,
    products: WB,
    note: 'Printed on packaging render. Needs roll OD/core measurements and a fit test across common dispensers.',
  },
  'wb-leak-proof': {
    claim: 'Leak-proof',
    status: 'provisional',
    supportingEvidence: null,
    approvedCustomerCopy: null,
    products: WB,
    note: 'Largest line on the packaging render. Requires a defined leak test protocol and passing results before any use.',
  },
  'wb-gauge-22-micron': {
    claim: '22 micron heavy gauge film',
    status: 'provisional',
    supportingEvidence: null,
    approvedCustomerCopy: null,
    products: WB,
    note: 'Requires factory spec sheet plus independent thickness measurement of production film.',
  },
  'wb-pcr-65': {
    claim: '65% post-consumer recycled (PCR) plastic',
    status: 'provisional',
    supportingEvidence: null,
    approvedCustomerCopy: null,
    products: WB,
    note: 'Requires resin supplier documentation and chain-of-custody. Subject to FTC Green Guides.',
  },
  'wb-recycled-content': {
    claim: 'Made with recycled content (any percentage)',
    status: 'provisional',
    supportingEvidence: null,
    approvedCustomerCopy: null,
    products: WB,
    note: 'Gates the product name "Recycled Waste Bags". Until verified the page uses "Waste Bags".',
  },
  'wb-puncture-strength': {
    claim: 'Puncture resistance / strength',
    status: 'provisional',
    supportingEvidence: null,
    approvedCustomerCopy: null,
    products: WB,
    note: 'Honeycomb copy must not imply strength until tested (e.g. ASTM D1709 dart impact).',
  },
  'wb-weight-capacity': {
    claim: 'Load / weight capacity',
    status: 'provisional',
    supportingEvidence: null,
    approvedCustomerCopy: null,
    products: WB,
  },
  'wb-environmental-benefit': {
    claim: 'Any environmental benefit statement',
    status: 'provisional',
    supportingEvidence: null,
    approvedCustomerCopy: null,
    products: WB,
    note: 'Any environmental statement needs substantiation under the FTC Green Guides.',
  },
  'wb-dispenser-dimensions': {
    claim: 'Dispenser mini-carabiner approx. 22 × 13 mm',
    status: 'provisional',
    supportingEvidence: null,
    approvedCustomerCopy: null,
    products: WB,
    note: 'Internal design target only. Not a production specification.',
  },
  'wb-dispenser-included': {
    claim: 'Dispenser is included with the 120-bag box',
    status: 'provisional',
    supportingEvidence: null,
    approvedCustomerCopy: null,
    products: WB,
    note: 'Unresolved: the brief describes the dispenser as separate. Commerce must confirm bundle vs. separate SKU.',
  },

  // ── Rejected: never use, on any product ───────────────────────────────────
  'banned-biodegradable': { claim: 'Biodegradable', status: 'rejected', supportingEvidence: null, approvedCustomerCopy: null, products: ['*'] },
  'banned-compostable': { claim: 'Compostable', status: 'rejected', supportingEvidence: null, approvedCustomerCopy: null, products: ['*'] },
  'banned-eco-friendly': { claim: 'Eco-friendly', status: 'rejected', supportingEvidence: null, approvedCustomerCopy: null, products: ['*'] },
  'banned-bpa-free': { claim: 'BPA-free', status: 'rejected', supportingEvidence: null, approvedCustomerCopy: null, products: ['*'] },
  'banned-non-toxic': { claim: 'Non-toxic', status: 'rejected', supportingEvidence: null, approvedCustomerCopy: null, products: ['*'] },
  'banned-certified-recycled': { claim: 'Certified recycled', status: 'rejected', supportingEvidence: null, approvedCustomerCopy: null, products: ['*'] },
} as const satisfies Record<string, ProductClaim>;

export type ClaimId = keyof typeof productClaims;

/**
 * Terms that must never appear in rendered page text unless the matching claim
 * is verified. Checked at prerender time (scripts/prerender.mjs reads this list
 * from the server bundle). Keys are claim ids; values are case-insensitive
 * patterns.
 */
export const guardedTerms: Record<string, RegExp> = {
  'wb-leak-proof': /leak[\s-]?proof/i,
  'wb-gauge-22-micron': /\bmicron\b|\bgauge\b/i,
  'wb-pcr-65': /\bPCR\b|post[\s-]?consumer/i,
  'wb-recycled-content': /\brecycl/i,
  'wb-puncture-strength': /puncture/i,
  'wb-unscented': /unscented/i,
  'banned-biodegradable': /biodegrad/i,
  'banned-compostable': /compostab/i,
  'banned-eco-friendly': /eco[\s-]?friendly/i,
  'banned-bpa-free': /BPA/i,
  'banned-non-toxic': /non[\s-]?toxic/i,
  'banned-certified-recycled': /certified recycled/i,
};

import type { ImageAssetId } from '../generated/imageAssets';
import type { ClaimId } from './productClaims';

// ── Images ────────────────────────────────────────────────────────────────
/** How an image sits in its frame at a breakpoint. x/y are object-position %, zoom ≥ 1 crops in toward x/y. */
export interface ImageFocus {
  x: number;
  y: number;
  zoom?: number;
}

export interface ImageRole {
  /** Derivative id from src/generated/imageAssets.ts. null = asset not supplied. */
  asset: ImageAssetId | null;
  /**
   * approved: the correct asset for this role.
   * interim: an approved photo standing in for a role whose dedicated asset is missing.
   * missing: nothing suitable exists; the section renders without it.
   */
  status: 'approved' | 'interim' | 'missing';
  alt: string;
  focus?: { mobile?: ImageFocus; desktop?: ImageFocus };
  /** Internal QC / substitution note. Never rendered. */
  note?: string;
}

// ── Commerce ──────────────────────────────────────────────────────────────
export type LaunchMode = 'waitlist' | 'preorder' | 'live';

export interface Money {
  /** Minor units avoided on purpose: amount is a decimal string, e.g. "18.00". */
  amount: string;
  currencyCode: string;
}

export interface CommerceConfig {
  /** Requested launch mode. Falls back to "waitlist" if price/sku/cart are not configured (see lib/launch.ts). */
  launchMode: LaunchMode;
  sku: string | null;
  price: Money | null;
  availability: 'coming_soon' | 'preorder' | 'in_stock' | 'out_of_stock';
  purchaseOptions: {
    oneTime: boolean;
    /** Leave null until subscription pricing exists. */
    subscription: { intervalsInDays: number[]; price: Money } | null;
  };
  maxQuantity: number;
  /** Seller entity for structured data. Null = no Product JSON-LD. */
  seller: { name: string; url: string } | null;
  gtin: string | null;
}

// ── Copy & specs ──────────────────────────────────────────────────────────
export interface SectionCopy {
  eyebrow?: string;
  headline: string;
  body?: string;
}

export interface SpecFigure {
  id: string;
  claimId: ClaimId;
  /** Large display value, e.g. "120". */
  value: string;
  /** Supporting label, e.g. "bags". */
  label: string;
}

export interface Callout {
  label: string;
  detail: string;
}

// ── Sections ──────────────────────────────────────────────────────────────
interface SectionBase {
  /** DOM id; also the in-page anchor. */
  id: string;
  /** Used for feature_viewed analytics. */
  featureId?: string;
  tone?: 'paper' | 'ink' | 'clay';
  /** Label in the header menu's "On this page" list. Omit to leave it out. */
  menuLabel?: string;
}

export type SectionConfig<R extends string = string> =
  | (SectionBase & { type: 'hero'; image: R; copy: SectionCopy; secondaryCta: { label: string; href: string } })
  | (SectionBase & { type: 'reveal'; image: R; copy: SectionCopy; specIds: string[] })
  | (SectionBase & {
      type: 'story';
      /**
       * split-sticky: image and copy side by side, copy sticks on desktop.
       * intimate: framed image with close, human copy.
       * stacked: image then copy, nothing overlaid on the image.
       * full-bleed: edge-to-edge image, copy below.
       * pair: two images, the first dominant.
       */
      layout: 'split-sticky' | 'intimate' | 'stacked' | 'full-bleed' | 'pair';
      images: R[];
      copy: SectionCopy;
      callouts?: Callout[];
    })
  | (SectionBase & { type: 'custom'; component: string; copy: SectionCopy })
  | (SectionBase & { type: 'figures'; image?: R; copy: SectionCopy; specIds: string[] })
  | (SectionBase & { type: 'purchase'; copy: SectionCopy })
  | (SectionBase & { type: 'brand-moment'; image?: R; copy: SectionCopy; ctaLabel: string });

// ── Product ───────────────────────────────────────────────────────────────
export interface ProductConfig<R extends string = string> {
  id: string;
  slug: string;
  /** Category line, e.g. "Clean". */
  category: string;
  /** Name used whenever the qualified name's claim is not live. */
  name: string;
  /** Optional richer name gated behind a claim (e.g. "Recycled Waste Bags"). */
  qualifiedName?: { claimId: ClaimId; name: string };
  seo: { title: string; description: string; ogImage: R };
  /** Per-product accent derived from the product itself. */
  theme: { accent: string; accentInk: string };
  images: Record<R, ImageRole>;
  specs: SpecFigure[];
  sections: SectionConfig<R>[];
  commerce: CommerceConfig;
  /** Extra per-product data consumed by custom storytelling components. */
  extras?: Record<string, unknown>;
  /** CTA labels by resolved launch mode. */
  ctaLabels: Record<LaunchMode, string>;
}

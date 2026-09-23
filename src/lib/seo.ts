import { brand } from '../content/brand';
import { productRoute } from '../content/products';
import { site } from '../content/site';
import type { ProductConfig } from '../content/types';
import { FORMATS, assetInfo, fallbackSrc, srcSet } from './images';
import { displayName, imageRole } from './product';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const abs = (path: string) => `${site.url}${path}`;

/**
 * Product JSON-LD only when real commerce data exists: price, seller and an
 * availability that is not "coming soon". Never emits ratings or reviews.
 */
export function productJsonLd(p: ProductConfig): Record<string, unknown> | null {
  const { price, seller, availability, sku, gtin } = p.commerce;
  if (!price || !seller || availability === 'coming_soon' || !site.url) return null;
  const og = imageRole(p, p.seo.ogImage);
  const availabilityUrl = {
    in_stock: 'https://schema.org/InStock',
    out_of_stock: 'https://schema.org/OutOfStock',
    preorder: 'https://schema.org/PreOrder',
  }[availability];
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${brand.name} ${displayName(p)}`,
    description: p.seo.description,
    brand: { '@type': 'Brand', name: brand.name },
    ...(og?.asset ? { image: abs(fallbackSrc(og.asset)) } : {}),
    ...(sku ? { sku } : {}),
    ...(gtin ? { gtin } : {}),
    offers: {
      '@type': 'Offer',
      url: abs(productRoute(p)),
      price: price.amount,
      priceCurrency: price.currencyCode,
      availability: availabilityUrl,
      seller: { '@type': 'Organization', name: seller.name, url: seller.url },
    },
  };
}

/** <head> tags for a product page, as an HTML string (prerender + dev). */
export function productHead(p: ProductConfig): string {
  const url = abs(productRoute(p));
  const og = imageRole(p, p.seo.ogImage);
  const heroSection = p.sections.find((s) => s.type === 'hero');
  const hero = heroSection ? imageRole(p, heroSection.image) : null;
  const tags = [
    `<title>${esc(p.seo.title)}</title>`,
    `<meta name="description" content="${esc(p.seo.description)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="product" />`,
    `<meta property="og:site_name" content="${esc(brand.name)}" />`,
    `<meta property="og:locale" content="${site.locale}" />`,
    `<meta property="og:title" content="${esc(p.seo.title)}" />`,
    `<meta property="og:description" content="${esc(p.seo.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  if (og?.asset) {
    const info = assetInfo(og.asset);
    const w = Math.min(1200, info.width);
    tags.push(
      `<meta property="og:image" content="${esc(abs(fallbackSrc(og.asset)))}" />`,
      `<meta property="og:image:width" content="${w}" />`,
      `<meta property="og:image:height" content="${Math.round((info.height / info.width) * w)}" />`,
      `<meta property="og:image:alt" content="${esc(og.alt)}" />`,
    );
  }
  // Preload only the hero image (AVIF — every browser that supports imagesrcset preload also decodes AVIF or ignores the hint).
  if (hero?.asset) {
    tags.push(
      `<link rel="preload" as="image" type="image/${FORMATS[0]}" imagesrcset="${srcSet(hero.asset, FORMATS[0])}" imagesizes="100vw" fetchpriority="high" />`,
    );
  }
  const ld = productJsonLd(p);
  if (ld) tags.push(`<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`);
  return tags.join('\n    ');
}

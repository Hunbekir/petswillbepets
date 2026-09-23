import type { CSSProperties } from 'react';
import type { ProductConfig, SectionConfig } from '../content/types';
import { SiteFooter } from '../components/layout/SiteFooter';
import { SiteHeader } from '../components/layout/SiteHeader';
import { BrandMoment } from '../components/sections/BrandMoment';
import { ProductHero } from '../components/sections/ProductHero';
import { ProductReveal } from '../components/sections/ProductReveal';
import { PurchaseModule } from '../components/sections/PurchaseModule';
import { SpecFigures } from '../components/sections/SpecFigures';
import { StorySection } from '../components/sections/StorySection';
import { primaryCtaLabel } from '../lib/launch';
import { customSections } from '../products/registry';
import { productRoute } from '../content/products';

function renderSection(product: ProductConfig, section: SectionConfig) {
  switch (section.type) {
    case 'hero':
      return <ProductHero key={section.id} product={product} section={section} />;
    case 'reveal':
      return <ProductReveal key={section.id} product={product} section={section} />;
    case 'story':
      return <StorySection key={section.id} product={product} section={section} />;
    case 'figures':
      return <SpecFigures key={section.id} product={product} section={section} />;
    case 'purchase':
      return <PurchaseModule key={section.id} product={product} section={section} />;
    case 'brand-moment':
      return <BrandMoment key={section.id} product={product} section={section} />;
    case 'custom': {
      const Custom = customSections[section.component];
      return Custom ? <Custom key={section.id} product={product} section={section} /> : null;
    }
  }
}

/** The shared launch-page template. Everything product-specific comes from `product`. */
export function ProductLaunchPage({ product }: { product: ProductConfig }) {
  const hero = product.sections.find((s) => s.type === 'hero');
  const menuLinks = product.sections
    .filter((s) => s.menuLabel)
    .map((s) => ({ label: s.menuLabel!, href: `#${s.id}` }));
  const theme = { '--accent': product.theme.accent, '--accent-ink': product.theme.accentInk } as CSSProperties;

  return (
    <div className="page" style={theme}>
      <SiteHeader
        ctaLabel={primaryCtaLabel(product)}
        ctaHref="#purchase"
        shopHref={`${productRoute(product)}#purchase`}
        menuLinks={menuLinks}
        heroId={hero?.id}
      />
      <main id="main" tabIndex={-1}>
        {product.sections.map((s) => renderSection(product, s))}
      </main>
      <SiteFooter productId={product.id} />
    </div>
  );
}

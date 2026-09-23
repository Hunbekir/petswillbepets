import type { ProductConfig, SectionConfig } from '../../content/types';
import { track } from '../../lib/analytics';
import { primaryCtaLabel, resolveLaunchMode } from '../../lib/launch';
import { imageRole } from '../../lib/product';
import { ResponsiveImage } from '../media/ResponsiveImage';
import { focusPurchase } from './focusPurchase';

type Hero = Extract<SectionConfig, { type: 'hero' }>;

export function ProductHero({ product, section }: { product: ProductConfig; section: Hero }) {
  const role = imageRole(product, section.image);
  const mode = resolveLaunchMode(product);
  const { copy } = section;

  return (
    <section id={section.id} className="hero" aria-labelledby={`${section.id}-title`}>
      {role && (
        <div className="hero__media">
          <ResponsiveImage role={role} sizes="100vw" priority />
        </div>
      )}
      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__content container">
        {copy.eyebrow && <p className="eyebrow hero__eyebrow">{copy.eyebrow}</p>}
        <h1 id={`${section.id}-title`} className="headline headline--display hero__title">
          {copy.headline}
        </h1>
        {copy.body && <p className="hero__lede">{copy.body}</p>}
        <div className="hero__actions">
          <a
            className="btn btn--light"
            href="#purchase"
            onClick={(e) => {
              track({ name: 'hero_cta_clicked', productId: product.id, cta: 'primary', launchMode: mode });
              focusPurchase(e);
            }}
          >
            {primaryCtaLabel(product)}
          </a>
          <a
            className="btn btn--ghost-light"
            href={section.secondaryCta.href}
            onClick={() => track({ name: 'hero_cta_clicked', productId: product.id, cta: 'secondary', launchMode: mode })}
          >
            {section.secondaryCta.label}
          </a>
        </div>
      </div>
    </section>
  );
}

import type { ProductConfig, SectionConfig } from '../../content/types';
import { track } from '../../lib/analytics';
import { imageRole, liveSpecs } from '../../lib/product';
import { Reveal } from '../media/Reveal';
import { ResponsiveImage } from '../media/ResponsiveImage';
import { SectionCopy } from './SectionCopy';

type RevealSection = Extract<SectionConfig, { type: 'reveal' }>;

export function ProductReveal({ product, section }: { product: ProductConfig; section: RevealSection }) {
  const role = imageRole(product, section.image);
  const specs = liveSpecs(product, section.specIds);
  const onView = () =>
    section.featureId && track({ name: 'feature_viewed', productId: product.id, featureId: section.featureId });

  return (
    <section id={section.id} className="section reveal-section tone-paper">
      <div className="container reveal-section__grid">
        <Reveal className="reveal-section__copy" onView={onView}>
          <SectionCopy copy={section.copy} size="xl" />
        </Reveal>
        {role && (
          <Reveal className="reveal-section__media" delay={120}>
            <ResponsiveImage role={role} fit="natural" sizes="(min-width: 1024px) 46vw, (min-width: 700px) 70vw, 92vw" />
          </Reveal>
        )}
        {specs.length > 0 && (
          <Reveal as="dl" className="format-line" delay={200}>
            {specs.map((s) => (
              <div key={s.id} className="format-line__item">
                <dt className="format-line__label">{s.label}</dt>
                <dd className="format-line__value">{s.value}</dd>
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}

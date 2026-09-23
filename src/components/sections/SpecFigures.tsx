import type { ProductConfig, SectionConfig } from '../../content/types';
import { track } from '../../lib/analytics';
import { imageRole, liveSpecs } from '../../lib/product';
import { Reveal } from '../media/Reveal';
import { ResponsiveImage } from '../media/ResponsiveImage';

type Figures = Extract<SectionConfig, { type: 'figures' }>;

/** Large, calm numbers. Only verified specs render; unverified ones are dropped, not greyed out. */
export function SpecFigures({ product, section }: { product: ProductConfig; section: Figures }) {
  const specs = liveSpecs(product, section.specIds);
  const role = imageRole(product, section.image);
  const onView = () =>
    section.featureId && track({ name: 'feature_viewed', productId: product.id, featureId: section.featureId });

  return (
    <section
      id={section.id}
      className={`section figures tone-${section.tone ?? 'paper'} ${role ? 'figures--with-media' : ''}`}
      aria-labelledby={`${section.id}-title`}
    >
      <div className="container">
        <Reveal onView={onView}>
          <h2 id={`${section.id}-title`} className="headline headline--xl figures__title">
            {section.copy.headline}
          </h2>
        </Reveal>
        {role && (
          <Reveal className="figures__media">
            <ResponsiveImage role={role} fit="natural" sizes="(min-width: 1024px) 60vw, 100vw" />
          </Reveal>
        )}
        <dl className="figures__list">
          {specs.map((s, i) => (
            <Reveal key={s.id} className="figures__item" delay={i * 70}>
              <dt className="figures__label">{s.label}</dt>
              <dd className="figures__value">{s.value}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

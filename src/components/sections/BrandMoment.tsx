import type { ProductConfig, SectionConfig } from '../../content/types';
import { primaryCtaLabel, resolveLaunchMode } from '../../lib/launch';
import { imageRole } from '../../lib/product';
import { Reveal } from '../media/Reveal';
import { ResponsiveImage } from '../media/ResponsiveImage';
import { focusPurchase } from './focusPurchase';

type Moment = Extract<SectionConfig, { type: 'brand-moment' }>;

export function BrandMoment({ product, section }: { product: ProductConfig; section: Moment }) {
  const role = imageRole(product, section.image);
  // The configured label is the waitlist line; once live, follow the launch mode.
  const label = resolveLaunchMode(product) === 'waitlist' ? section.ctaLabel : primaryCtaLabel(product);
  return (
    <section
      id={section.id}
      className={`section moment tone-${section.tone ?? 'ink'}`}
      aria-labelledby={`${section.id}-title`}
    >
      <div className="container moment__inner">
        <Reveal>
          <h2 id={`${section.id}-title`} className="headline headline--display moment__title">
            {section.copy.headline}
          </h2>
          {section.copy.body && <p className="moment__tagline">{section.copy.body}</p>}
          <a className="btn btn--light moment__cta" href="#purchase" onClick={focusPurchase}>
            {label}
          </a>
        </Reveal>
        {role && (
          <Reveal className="moment__media" delay={120}>
            <ResponsiveImage role={role} fit="natural" sizes="(min-width: 1024px) 30vw, 60vw" />
          </Reveal>
        )}
      </div>
    </section>
  );
}

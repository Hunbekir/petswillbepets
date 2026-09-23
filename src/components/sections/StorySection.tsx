import type { ImageRole, ProductConfig, SectionConfig } from '../../content/types';
import { track } from '../../lib/analytics';
import { imageRole } from '../../lib/product';
import { Reveal } from '../media/Reveal';
import { ResponsiveImage } from '../media/ResponsiveImage';

type Story = Extract<SectionConfig, { type: 'story' }>;

/** `sizes` per layout — keeps the browser from over-fetching on mobile. */
const SIZES: Record<Story['layout'], string[]> = {
  'split-sticky': ['(min-width: 1024px) 55vw, 100vw'],
  intimate: ['(min-width: 1024px) 44vw, (min-width: 700px) 70vw, 88vw'],
  stacked: ['(min-width: 1024px) 70vw, 100vw'],
  'full-bleed': ['100vw'],
  pair: ['(min-width: 1024px) 50vw, 100vw', '(min-width: 1024px) 40vw, 100vw'],
};

export function StorySection({ product, section }: { product: ProductConfig; section: Story }) {
  const roles = section.images.map((k) => imageRole(product, k)).filter((r): r is ImageRole => !!r);
  const sizes = SIZES[section.layout];
  const tone = section.tone ?? 'paper';
  const onView = () =>
    section.featureId && track({ name: 'feature_viewed', productId: product.id, featureId: section.featureId });

  const callouts = section.callouts?.length ? (
    <ul className="callouts">
      {section.callouts.map((c) => (
        <li key={c.label} className="callouts__item">
          <span className="callouts__label">{c.label}</span>
          <span className="callouts__detail">{c.detail}</span>
        </li>
      ))}
    </ul>
  ) : null;

  const media = (i: number, className = '') =>
    roles[i] ? (
      <div className={`story__media ${className}`}>
        <ResponsiveImage role={roles[i]} sizes={sizes[i] ?? sizes[0]} />
      </div>
    ) : null;

  return (
    <section
      id={section.id}
      className={`section story story--${section.layout} tone-${tone}`}
      aria-labelledby={`${section.id}-title`}
    >
      {section.layout === 'full-bleed' ? (
        <>
          <Reveal className="story__bleed">{media(0)}</Reveal>
          <div className="container">
            <Reveal className="story__copy" onView={onView}>
              <Heading section={section} size="display" />
            </Reveal>
          </div>
        </>
      ) : section.layout === 'split-sticky' ? (
        <div className="story__split">
          <Reveal className="story__split-media">{media(0)}</Reveal>
          <div className="story__split-copy">
            <Reveal className="story__sticky" onView={onView}>
              <Heading section={section} />
              {callouts}
            </Reveal>
          </div>
        </div>
      ) : section.layout === 'pair' ? (
        <div className="container story__pair">
          <Reveal className="story__copy" onView={onView}>
            <Heading section={section} />
          </Reveal>
          <Reveal className="story__pair-primary">{media(0)}</Reveal>
          <div className="story__pair-secondary">
            <Reveal>{media(1)}</Reveal>
            <Reveal delay={100}>{callouts}</Reveal>
          </div>
        </div>
      ) : (
        <div className={`container story__${section.layout}`}>
          <Reveal className="story__frame">{media(0)}</Reveal>
          <Reveal className="story__copy" onView={onView} delay={80}>
            <Heading section={section} />
            {callouts}
          </Reveal>
        </div>
      )}
    </section>
  );
}

function Heading({ section, size = 'xl' }: { section: Story; size?: 'display' | 'xl' }) {
  return (
    <div className="copy">
      {section.copy.eyebrow && <p className="eyebrow">{section.copy.eyebrow}</p>}
      <h2 id={`${section.id}-title`} className={`headline headline--${size}`}>
        {section.copy.headline}
      </h2>
      {section.copy.body && <p className="lede">{section.copy.body}</p>}
    </div>
  );
}

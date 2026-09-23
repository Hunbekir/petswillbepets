import { useRef, useState, type KeyboardEvent } from 'react';
import type { ImageFocus, ImageRole, ProductConfig, SectionConfig } from '../../content/types';
import { track } from '../../lib/analytics';
import { imageRole } from '../../lib/product';
import { Reveal } from '../../components/media/Reveal';
import { ResponsiveImage } from '../../components/media/ResponsiveImage';

type Custom = Extract<SectionConfig, { type: 'custom' }>;

interface CarryStep {
  key: 'tie' | 'clip' | 'walk';
  label: string;
  text: string;
  image: string;
  alt: string;
  focus: { mobile: ImageFocus; desktop: ImageFocus };
}

/**
 * Waste-bag specific: the carry-slit story.
 * 1. The construction flat-lay shows the two matching slits (bag spread open).
 * 2. A three-step tab set — Tie / Clip / Keep walking — re-frames approved
 *    photography. The hook is only ever shown through the slit, never the knot.
 */
export function CarryMechanism({ product, section }: { product: ProductConfig; section: Custom }) {
  const steps = (product.extras?.carrySteps ?? []) as CarryStep[];
  const flatLay = imageRole(product, 'constructionFlatLay');
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number, focus = false) => {
    setActive(i);
    if (focus) tabs.current[i]?.focus();
    track({ name: 'carry_mechanism_viewed', productId: product.id, step: steps[i].key });
  };

  const onKey = (e: KeyboardEvent) => {
    const last = steps.length - 1;
    const map: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (e.key in map) {
      e.preventDefault();
      select(map[e.key], true);
    }
  };

  return (
    <section id={section.id} className="section carry tone-paper" aria-labelledby={`${section.id}-title`}>
      <div className="container carry__top">
        <Reveal
          className="copy"
          onView={() => track({ name: 'carry_mechanism_viewed', productId: product.id })}
        >
          {section.copy.eyebrow && <p className="eyebrow">{section.copy.eyebrow}</p>}
          <h2 id={`${section.id}-title`} className="headline headline--xl">
            {section.copy.headline}
          </h2>
          {section.copy.body && <p className="lede">{section.copy.body}</p>}
        </Reveal>

        {flatLay && (
          <Reveal as="figure" className="carry__figure" delay={100}>
            <div className="carry__figure-frame">
              <ResponsiveImage role={flatLay} sizes="(min-width: 1024px) 34vw, (min-width: 700px) 60vw, 92vw" />
            </div>
            <figcaption className="carry__caption">
              <span>Spread open, the front and rear layers each show their slit.</span>
              <span>Laid flat, the two align as one.</span>
            </figcaption>
          </Reveal>
        )}
      </div>

      {steps.length > 0 && (
        <div className="container carry__steps">
          <div className="carry__tablist" role="tablist" aria-label="How the carry slit works" onKeyDown={onKey}>
            {steps.map((s, i) => (
              <button
                key={s.key}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                type="button"
                id={`carry-tab-${s.key}`}
                aria-selected={i === active}
                aria-controls={`carry-panel-${s.key}`}
                tabIndex={i === active ? 0 : -1}
                className="carry__tab"
                onClick={() => select(i)}
              >
                <span className="carry__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="carry__tab-label">{s.label}</span>
              </button>
            ))}
          </div>

          {steps.map((s, i) => {
            const base = imageRole(product, s.image);
            const role: ImageRole | null = base && { ...base, alt: s.alt, focus: s.focus };
            return (
              <div
                key={s.key}
                role="tabpanel"
                id={`carry-panel-${s.key}`}
                aria-labelledby={`carry-tab-${s.key}`}
                className={`carry__panel ${i === active ? 'is-active' : ''}`}
                hidden={i !== active}
              >
                {role && (
                  <div className="carry__panel-media">
                    <ResponsiveImage role={role} sizes="(min-width: 1024px) 50vw, 100vw" />
                  </div>
                )}
                <p className="carry__panel-text">
                  <span className="carry__panel-step">{s.label}.</span> {s.text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

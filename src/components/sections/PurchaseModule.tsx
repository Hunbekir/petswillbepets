import { useState } from 'react';
import type { ProductConfig, SectionConfig } from '../../content/types';
import { track } from '../../lib/analytics';
import { commerce } from '../../lib/commerce';
import { formatMoney, primaryCtaLabel, resolveLaunchMode } from '../../lib/launch';
import { displayName, liveSpecs } from '../../lib/product';
import { WaitlistForm } from '../forms/WaitlistForm';
import { Reveal } from '../media/Reveal';
import { PURCHASE_INPUT_ID } from './focusPurchase';

type Purchase = Extract<SectionConfig, { type: 'purchase' }>;

const AVAILABILITY: Record<ProductConfig['commerce']['availability'], string> = {
  coming_soon: 'Coming soon',
  preorder: 'Available to preorder',
  in_stock: 'In stock',
  out_of_stock: 'Out of stock',
};

/**
 * One module, three launch modes. Every value shown comes from product.commerce;
 * nothing is shown that the config does not supply (no invented price,
 * savings or shipping promise).
 */
export function PurchaseModule({ product, section }: { product: ProductConfig; section: Purchase }) {
  const mode = resolveLaunchMode(product);
  const { commerce: cfg } = product;
  const specs = liveSpecs(product, product.specs.map((s) => s.id));
  const [qty, setQty] = useState(1);
  const [option, setOption] = useState<'one_time' | 'subscription'>('one_time');
  const [interval, setIntervalDays] = useState(cfg.purchaseOptions.subscription?.intervalsInDays[0]);
  const [status, setStatus] = useState<{ busy: boolean; message: string }>({ busy: false, message: '' });

  const price = option === 'subscription' && cfg.purchaseOptions.subscription ? cfg.purchaseOptions.subscription.price : cfg.price;
  const onView = () => track({ name: 'purchase_module_viewed', productId: product.id, launchMode: mode });

  async function addToCart() {
    if (!cfg.sku) return;
    track({ name: 'add_to_cart_clicked', productId: product.id, sku: cfg.sku, quantity: qty, purchaseOption: option });
    setStatus({ busy: true, message: '' });
    const res = await commerce.addToCart({
      productId: product.id,
      sku: cfg.sku,
      quantity: qty,
      purchaseOption: option,
      subscriptionIntervalDays: option === 'subscription' ? interval : undefined,
    });
    if (res.ok && res.redirectUrl) window.location.assign(res.redirectUrl);
    setStatus({ busy: false, message: res.ok ? 'Added to your cart.' : res.message });
  }

  return (
    <section id={section.id} className="section purchase tone-paper" aria-labelledby={`${section.id}-title`}>
      <div className="container">
        <Reveal className="purchase__card" onView={onView}>
          <div className="purchase__head">
            {section.copy.eyebrow && <p className="eyebrow">{section.copy.eyebrow}</p>}
            <h2 id={`${section.id}-title`} className="headline headline--xl">
              {displayName(product)}
            </h2>
            {specs.length > 0 && (
              <p className="purchase__format">{specs.slice(0, 3).map((s) => `${s.value} ${s.label}`).join(' · ')}</p>
            )}
          </div>

          <div className="purchase__body">
            <p className="purchase__availability">
              <span className="purchase__dot" aria-hidden="true" />
              {AVAILABILITY[cfg.availability]}
            </p>

            {mode === 'waitlist' ? (
              <>
                {section.copy.body && <p className="purchase__lede">{section.copy.body}</p>}
                <WaitlistForm
                  productId={product.id}
                  source="purchase"
                  submitLabel={primaryCtaLabel(product)}
                  inputId={PURCHASE_INPUT_ID}
                />
              </>
            ) : (
              <>
                {price && <p className="purchase__price">{formatMoney(price)}</p>}

                {cfg.purchaseOptions.subscription && (
                  <fieldset className="purchase__options">
                    <legend className="purchase__legend">Purchase</legend>
                    {cfg.purchaseOptions.oneTime && (
                      <label className="choice">
                        <input type="radio" name="option" checked={option === 'one_time'} onChange={() => setOption('one_time')} />
                        <span>One-time purchase</span>
                      </label>
                    )}
                    <label className="choice">
                      <input type="radio" name="option" checked={option === 'subscription'} onChange={() => setOption('subscription')} />
                      <span>Subscribe</span>
                    </label>
                    {option === 'subscription' && (
                      <label className="purchase__interval">
                        Deliver every
                        <select value={interval} onChange={(e) => setIntervalDays(Number(e.target.value))}>
                          {cfg.purchaseOptions.subscription.intervalsInDays.map((d) => (
                            <option key={d} value={d}>
                              {d} days
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                  </fieldset>
                )}

                <div className="purchase__row">
                  <div className="qty" role="group" aria-label="Quantity">
                    <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" disabled={qty <= 1}>
                      −
                    </button>
                    <output aria-live="polite">{qty}</output>
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.min(cfg.maxQuantity, q + 1))}
                      aria-label="Increase quantity"
                      disabled={qty >= cfg.maxQuantity}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn btn--primary purchase__add"
                    onClick={addToCart}
                    disabled={status.busy || cfg.availability === 'out_of_stock'}
                  >
                    {primaryCtaLabel(product)}
                  </button>
                </div>
                <p className="purchase__status" aria-live="polite">
                  {status.message}
                </p>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

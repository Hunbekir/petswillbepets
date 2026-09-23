# PETS WILL BE PETS — product launch pages

Static, prerendered launch pages built with React, TypeScript and Vite. The first page is **Waste Bags** at **`/products/waste-bags`**. The same template is meant for the next seven products.

```bash
npm install
npm run dev        # http://localhost:5173/products/waste-bags
npm run build      # typecheck → client → SSR → prerender + claim check → dist/
npm run preview    # serve dist/ on :4173
npm run images     # regenerate AVIF/WebP/JPEG derivatives from assets/originals
```

Build-time environment variables (both optional; without them the build prints a warning):

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Production site address, e.g. `https://…`. Used to make the canonical and Open Graph URLs absolute. |
| `VITE_WAITLIST_ENDPOINT` | Address that waitlist sign-ups are POSTed to as JSON `{ email, productId, source }`. Without it, forms run in **preview mode** and say on screen that the address was not stored. |

## Architecture

```
assets/originals/waste-bags/     approved source photos (never modified)
assets/image-sources.json        photo id → source file (+ white-border trim flag)
scripts/optimize-images.mjs      makes the public/images/* derivatives and src/generated/imageAssets.ts
scripts/prerender.mjs            writes the static HTML; fails the build if unverified claim wording appears

src/content/
  productClaims.ts               CLAIM CONTROL — provisional | verified | rejected
  products/waste-bags.ts         PRODUCT CONFIG — image manifest, copy, specs, section order, commerce
  products/index.ts              product registry → routes (/products/<slug>)
  brand.ts                       logo, footer links, social (brand-wide)
  site.ts                        env-driven site URL + waitlist endpoint
  types.ts                       ProductConfig / SectionConfig / ImageRole types

src/pages/ProductLaunchPage.tsx  the shared template: header + sections from config + footer
src/components/
  layout/   SiteHeader (transparent → solid, accessible menu), SiteFooter, BrandMark
  sections/ ProductHero, ProductReveal, StorySection (split-sticky | intimate | stacked | full-bleed | pair),
            SpecFigures, PurchaseModule, BrandMoment
  media/    ResponsiveImage (<picture> AVIF→WebP→JPEG, focus/zoom framing, reserved dimensions), Reveal
  forms/    WaitlistForm
src/products/
  registry.ts                    custom section key → component
  waste-bags/CarryMechanism.tsx  the one waste-bag-specific component (Tie / Clip / Keep walking)
src/lib/
  claims.ts   isClaimLive / liveOnly    launch.ts   resolveLaunchMode (falls back to waitlist)
  commerce.ts CommerceAdapter + setCommerceAdapter()   analytics.ts typed events
  seo.ts      head tags, hero preload, Product JSON-LD (only with real price + seller)
```

### Guardrails built into the code

- **Claims.** Specs and gated names each reference a claim id. Only claims that are `verified`, have recorded evidence and have approved wording are shown. Anything else is left out, not greyed out. The prerender step scans the rendered text, alt text and head tags for wording tied to claims that are not verified (leak-proof, micron/gauge, PCR, recycled, puncture, unscented) and for banned wording (biodegradable, compostable, eco-friendly, BPA, non-toxic, certified recycled). If it finds any, the build fails.
- **Product name.** "Recycled Waste Bags" appears only once `wb-recycled-content` is verified. Until then the page says "Waste Bags".
- **Commerce.** `preorder` or `live` takes effect only when a price, a SKU and a connected cart adapter all exist. Otherwise the page falls back to waitlist mode, so no button leads nowhere. Nothing shows a price, discount, subscription saving or shipping promise unless it is in the config.
- **Links.** Footer links with no destination show as "Soon" labels. They are never dead links.
- **Logo.** `BrandMark` shows the official logo once `brand.logo` is set. Until then it shows the brand name as plain text and makes no attempt to imitate the logo.

### Analytics events (typed, no provider connected)

`hero_cta_clicked`, `feature_viewed`, `carry_mechanism_viewed`, `purchase_module_viewed`, `add_to_cart_clicked`, `waitlist_submitted`. Each event is pushed to `window.dataLayer` when that exists, and also sent as a `pwbp:analytics` DOM event.

### Adding the next product page

1. Put the approved photos in `assets/originals/<slug>/` and list them in `assets/image-sources.json`, then run `npm run images`.
2. Copy `src/content/products/waste-bags.ts` to `<slug>.ts`. Define its image roles, copy, specs (each tied to a claim), section order, theme accent and commerce.
3. Add the product's claims to `productClaims.ts`, starting them all as `provisional`.
4. Register the product in `src/content/products/index.ts`. The route `/products/<slug>` is prerendered automatically.
5. Only when a product has a story the standard sections can't tell: add a component under `src/products/<slug>/`, register it in `src/products/registry.ts`, and use `{ type: 'custom', component: '<key>' }`.

## QA (last run)

Tested at 390×844, 430×932, 820×1180 (tablet), 1440×900 and 1920×1080. Screenshots are in `docs/screenshots/`.

- No horizontal overflow at any width. No console errors or warnings. No failed requests.
- Lighthouse, mobile: Performance 99, Accessibility 100, Best Practices 100. SEO scored 100 with `VITE_SITE_URL` set and 85 without it, because the canonical URL is then relative. LCP 1.8 s, CLS 0, TBT 0 ms.
- Lighthouse, desktop: 100 / 100 / 100 / 100.
- Interaction tests all passed:
  - header turns solid on scroll
  - hero CTA scrolls to and focuses the waitlist email field
  - secondary CTA and every in-page anchor resolve
  - carry tabs work by click and by arrow keys
  - menu handles focus and closes on Escape
  - waitlist validates the address and shows the honest preview message
  - all 6 analytics events fire
  - only the hero image loads eagerly, and there is a single h1
  - content still shows with JavaScript off
  - reduced-motion mode shows everything with no transforms
- Claim guard: adding "leak-proof" to the copy fails the build.

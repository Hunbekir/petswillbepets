import type { ProductConfig } from '../types';

/**
 * PETS WILL BE PETS — Waste Bags
 * Route: /products/waste-bags
 *
 * Everything product-specific lives here: image manifest, copy, specs,
 * section order and commerce. Components never reference filenames.
 */

type WasteBagImage =
  | 'lifestyleHero'
  | 'packageHero'
  | 'rollStack'
  | 'constructionFlatLay'
  | 'honeycombMacro'
  | 'easyOpenCloseup'
  | 'carrySlitCloseup'
  | 'handsFreeCarry'
  | 'dispenserHero'
  | 'attachmentMechanism'
  | 'pickupInUse';

export const wasteBags: ProductConfig<WasteBagImage> = {
  id: 'waste-bags',
  slug: 'waste-bags',
  category: 'Clean',
  name: 'Waste Bags',
  // Only becomes the display name once the recycled-content claim is verified.
  qualifiedName: { claimId: 'wb-recycled-content', name: 'Recycled Waste Bags' },

  seo: {
    title: 'Waste Bags — The poop bag, rebuilt | PETS WILL BE PETS',
    description:
      'A waste bag reconsidered: an asymmetric top that opens on the first try, a honeycomb-embossed film for grip, and a carry slit that clips to the dispenser so you can walk hands-free. 120 bags on 8 rolls.',
    ogImage: 'packageHero',
  },

  theme: { accent: '#B68C76', accentInk: '#1F3550' },

  // ── Image manifest ─────────────────────────────────────────────────────
  // Source files: assets/originals/waste-bags/*  →  ids in assets/image-sources.json
  images: {
    lifestyleHero: {
      asset: 'wb-walk-handsfree',
      status: 'interim',
      alt: 'A golden retriever on a morning walk along a waterfront path, the leash held loosely by its owner.',
      focus: { mobile: { x: 6, y: 50 }, desktop: { x: 50, y: 42 } },
      note: 'No dedicated cinematic hero was supplied. Uses the hands-free walk photo (4.png) with a different crop to the hands-free section.',
    },
    packageHero: {
      asset: 'wb-package-studio',
      status: 'approved',
      alt: 'The PETS WILL BE PETS waste-bag box in ink blue and kraft, with a charcoal dispenser, a clay-colored roll and a flat honeycomb-textured bag.',
      note: 'Packaging artwork carries provisional claims (LEAK-PROOF, 22 MICRON, 65% PCR). Image may not be edited; page copy must not repeat them.',
    },
    rollStack: {
      asset: null,
      status: 'missing',
      alt: 'Eight clay-colored waste-bag rolls arranged in a sculptural stack.',
      note: 'MISSING: eight-roll sculptural product shot. "What\'s inside" and the closing section render typographically until supplied.',
    },
    constructionFlatLay: {
      asset: 'wb-construction-flatlay',
      status: 'approved',
      alt: 'A clay-colored bag laid flat with its top spread open. The rear layer rises above the front, and a matching carry slit sits in each layer. A roll, a texture detail and the dispenser appear alongside.',
      // Framed (3:5) on the bag and its slits; the lower-right inset is kept out of frame.
      focus: { mobile: { x: 0, y: 28, zoom: 1.58 }, desktop: { x: 0, y: 28, zoom: 1.58 } },
      note: 'The inset in the lower right shows the bag clipped to the upper leash hardware — an earlier mechanism. Do not crop to that inset to explain the lower carabiner.',
    },
    honeycombMacro: {
      asset: 'wb-honeycomb-macro',
      status: 'approved',
      alt: 'Macro view of the bag film: a uniform geometric hexagon pattern embossed into clay-colored film.',
      focus: { mobile: { x: 55, y: 60 }, desktop: { x: 50, y: 50 } },
    },
    easyOpenCloseup: {
      asset: 'wb-construction-flatlay',
      status: 'interim',
      alt: 'Close view of the bag top: the rear film layer is cut higher than the front, so the two edges sit apart and are easy to separate.',
      focus: { mobile: { x: 30, y: 18, zoom: 2.1 }, desktop: { x: 30, y: 17, zoom: 2.2 } },
      note: 'MISSING: dedicated easy-opening close-up. Interim: crop of the flat-lay top edge, which does show the asymmetric opening.',
    },
    carrySlitCloseup: {
      asset: 'wb-carry-slit-macro',
      status: 'approved',
      alt: 'Fingers hold the top edge of the bag; one fingertip passes through the narrow carry slit just below the edge.',
      focus: { mobile: { x: 55, y: 40 }, desktop: { x: 55, y: 45 } },
    },
    handsFreeCarry: {
      asset: 'wb-walk-handsfree',
      status: 'approved',
      alt: 'A tied waste bag hangs beside the charcoal dispenser on the leash while a golden retriever walks ahead in low sun.',
      focus: { mobile: { x: 84, y: 40 }, desktop: { x: 84, y: 30, zoom: 1.2 } },
      note: 'QC: in this render the bag hangs from the upper leash hardware, not the dispenser’s lower mini-carabiner. Acceptable as lifestyle mood; do not use to explain the mechanism. Reshoot recommended.',
    },
    dispenserHero: {
      asset: 'wb-dispenser-studio',
      status: 'approved',
      alt: 'The charcoal capsule dispenser hanging from a leash, with a front window showing the roll, an upper leash attachment and a small D-shaped carabiner below.',
    },
    attachmentMechanism: {
      asset: 'wb-attachment-sequence',
      status: 'approved',
      alt: 'Two views: fingers open the dispenser’s lower mini-carabiner to clip a tied bag above its knot, and the dispenser on a leash with the tied bag hanging from the closed carabiner.',
      note: 'QC: bag film reads lighter/beige here than the clay film elsewhere. Color match should be corrected at the next shoot.',
    },
    pickupInUse: {
      asset: 'wb-pickup-lawn',
      status: 'approved',
      alt: 'A hand inside a honeycomb-textured bag reaches down to the grass for a pickup; the two carry slits are visible at the open top.',
      focus: { mobile: { x: 55, y: 50 }, desktop: { x: 55, y: 50 } },
      note: 'QC: film renders paler and more translucent than the clay reference color.',
    },
  },

  // ── Specifications (each gated by a claim) ─────────────────────────────
  specs: [
    { id: 'bags', claimId: 'wb-count-120', value: '120', label: 'bags' },
    { id: 'rolls', claimId: 'wb-rolls-8', value: '8', label: 'compact rolls' },
    { id: 'per-roll', claimId: 'wb-per-roll-15', value: '15', label: 'bags per roll' },
    { id: 'size', claimId: 'wb-size-9x13', value: '9 × 13', label: 'inches, approx. per bag' },
    { id: 'unscented', claimId: 'wb-unscented', value: 'Unscented', label: 'film' },
    { id: 'dispenser-fit', claimId: 'wb-standard-dispenser-fit', value: 'Standard', label: 'dispenser fit' },
  ],

  // ── Page sequence ──────────────────────────────────────────────────────
  sections: [
    {
      type: 'hero',
      id: 'top',
      image: 'lifestyleHero',
      tone: 'ink',
      copy: {
        eyebrow: 'Clean / Waste Bags',
        headline: 'The poop bag, rebuilt.',
        body: 'Opens without the struggle. Grips with confidence. Carries hands-free when the trash can is nowhere nearby.',
      },
      secondaryCta: { label: 'See what changed', href: '#what-changed' },
    },
    {
      type: 'reveal',
      id: 'what-changed',
      menuLabel: 'What changed',
      featureId: 'product-reveal',
      image: 'packageHero',
      copy: {
        headline: 'An everyday essential. Thought all the way through.',
        body: 'Most waste bags have barely changed. We reconsidered how the bag opens, feels, performs and travels after the pickup.',
      },
      specIds: ['bags', 'rolls', 'per-roll'],
    },
    {
      type: 'story',
      id: 'grip',
      menuLabel: 'Honeycomb grip',
      featureId: 'honeycomb-grip',
      layout: 'split-sticky',
      images: ['honeycombMacro'],
      copy: {
        eyebrow: 'Material',
        headline: 'Grip, built into the bag.',
        body: 'A uniform geometric micro-emboss creates a more tactile, substantial feel while helping the film stay controlled in your hand.',
      },
      callouts: [
        { label: 'Embossed, not printed', detail: 'The honeycomb is pressed into the film itself.' },
        { label: 'Uniform geometry', detail: 'An even hexagon pattern across the whole bag.' },
      ],
    },
    {
      type: 'story',
      id: 'easy-open',
      menuLabel: 'Easy opening',
      featureId: 'easy-open',
      layout: 'intimate',
      images: ['easyOpenCloseup'],
      copy: {
        eyebrow: 'Opening',
        headline: 'Open on the first try.',
        body: 'An asymmetric top makes the two slippery film layers easier to find and separate—without licking your fingers, rubbing the bag or fighting with the opening.',
      },
    },
    {
      type: 'story',
      id: 'pickup',
      menuLabel: 'The pickup',
      featureId: 'clean-pickup',
      layout: 'stacked',
      images: ['pickupInUse'],
      copy: {
        eyebrow: 'Pickup',
        headline: 'Made for the moment that matters.',
        body: 'Flexible film conforms naturally around the pickup while the tactile surface helps the bag feel controlled in your hand.',
      },
    },
    {
      type: 'custom',
      id: 'carry',
      menuLabel: 'Carry slit',
      featureId: 'carry-slit',
      component: 'carry-mechanism',
      copy: {
        eyebrow: 'Carry',
        headline: 'A tiny slit changes the rest of the walk.',
        body: 'Tie the bag. Push through the aligned carry slit. Attach it to the dispenser’s lower carabiner. Keep both hands free until you reach a trash can.',
      },
    },
    {
      type: 'story',
      id: 'hands-free',
      menuLabel: 'Hands-free',
      featureId: 'hands-free',
      layout: 'full-bleed',
      tone: 'ink',
      images: ['handsFreeCarry'],
      copy: {
        headline: 'Carry the walk. Not the bag.',
        body: 'The filled bag hangs from the dispenser instead of your hand—secure, separate and out of the way.',
      },
    },
    {
      type: 'story',
      id: 'dispenser',
      menuLabel: 'Dispenser',
      featureId: 'dispenser',
      layout: 'pair',
      images: ['dispenserHero', 'attachmentMechanism'],
      copy: {
        eyebrow: 'Dispenser',
        headline: 'The case carries more than the roll.',
        body: 'A compact dispenser holds the fresh bags above and includes a dedicated flush-closing mini-carabiner below for carrying the tied bag.',
      },
      callouts: [
        { label: 'Upper attachment', detail: 'Clips to the leash.' },
        { label: 'Front window', detail: 'See the roll. Pull the next bag.' },
        { label: 'Lower mini-carabiner', detail: 'A dedicated D-shaped clip for the tied bag.' },
        { label: 'Flush gate', detail: 'The spring gate closes completely against the nose.' },
      ],
    },
    {
      type: 'figures',
      id: 'whats-inside',
      menuLabel: 'What’s inside',
      featureId: 'whats-inside',
      image: 'rollStack',
      tone: 'ink',
      copy: { headline: 'Eight rolls. Ready for every walk.' },
      specIds: ['bags', 'rolls', 'per-roll', 'size', 'unscented', 'dispenser-fit'],
    },
    {
      type: 'purchase',
      id: 'purchase',
      menuLabel: 'Join the first drop',
      copy: {
        eyebrow: 'First drop',
        headline: 'Waste Bags',
        body: 'Join the list to hear when the first production run is ready.',
      },
    },
    {
      type: 'brand-moment',
      id: 'closing',
      tone: 'ink',
      copy: {
        headline: 'Better walks start with better basics.',
        body: 'Everything they need to be themselves.',
      },
      ctaLabel: 'Join the first drop',
    },
  ],

  // ── Carry mechanism steps (custom component data) ─────────────────────
  // Each step points at an approved image role and re-frames it. The hook is
  // always shown passing through the carry slit — never through the knot.
  extras: {
    carrySteps: [
      {
        key: 'tie',
        label: 'Tie',
        text: 'Tie the bag closed below the carry slit. The knot does its own job and stays separate.',
        image: 'carrySlitCloseup',
        focus: { mobile: { x: 50, y: 38, zoom: 1.35 }, desktop: { x: 50, y: 40, zoom: 1.3 } },
        alt: 'A fingertip passes through the narrow carry slit at the top edge of the bag.',
      },
      {
        key: 'clip',
        label: 'Clip',
        text: 'Open the dispenser’s lower mini-carabiner and pass it through the aligned slit—above the knot, never through it.',
        image: 'attachmentMechanism',
        focus: { mobile: { x: 22, y: 40, zoom: 1.6 }, desktop: { x: 22, y: 42, zoom: 1.55 } },
        alt: 'Fingers open the dispenser’s lower mini-carabiner and clip it to the tied bag above the knot.',
      },
      {
        key: 'walk',
        label: 'Keep walking',
        text: 'The gate closes flush. The bag hangs below the dispenser, out of your hands, until you reach a trash can.',
        image: 'attachmentMechanism',
        focus: { mobile: { x: 100, y: 40, zoom: 2.1 }, desktop: { x: 100, y: 38, zoom: 2 } },
        alt: 'The dispenser on a leash with the tied bag hanging from its closed lower carabiner.',
      },
    ],
  },

  // ── Commerce ───────────────────────────────────────────────────────────
  // No price, SKU or cart integration has been supplied, so the page resolves
  // to waitlist mode regardless of launchMode. See lib/launch.ts.
  commerce: {
    launchMode: 'waitlist',
    sku: null,
    price: null,
    availability: 'coming_soon',
    purchaseOptions: { oneTime: true, subscription: null },
    maxQuantity: 6,
    seller: null,
    gtin: null,
  },
  ctaLabels: {
    waitlist: 'Join the first drop',
    preorder: 'Preorder',
    live: 'Shop waste bags',
  },
};

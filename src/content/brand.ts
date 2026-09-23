/**
 * Brand-level configuration shared by every product page.
 * Links with href: null have no destination yet; they render as
 * non-interactive "Soon" labels so the page never ships a dead link.
 */

export interface NavLink {
  label: string;
  href: string | null;
}

export const brand = {
  name: 'PETS WILL BE PETS',
  tagline: 'Everything they need to be themselves.',

  /**
   * Official logo. MISSING: no standalone logo file was supplied (the logo only
   * appears printed on the packaging photograph, which cannot be cropped into a
   * logo). Drop the supplied SVG into /public/brand/ and set `src`, `width`,
   * `height` here — BrandMark will switch to it automatically.
   */
  logo: null as null | { src: string; srcOnDark?: string; width: number; height: number },

  /** Until a home page exists, the brand mark links to the first product. */
  homeHref: '/products/waste-bags',

  footer: {
    groups: [
      {
        title: 'Shop',
        links: [
          { label: 'Waste Bags', href: '/products/waste-bags' },
          { label: 'Join the first drop', href: '/products/waste-bags#purchase' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'Our approach', href: null },
          { label: 'Contact', href: null },
          { label: 'FAQ', href: null },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy', href: null },
          { label: 'Terms', href: null },
        ],
      },
    ] satisfies { title: string; links: NavLink[] }[],
    /** Only real account URLs. Empty = no social links rendered. */
    social: [] as NavLink[],
  },
} as const;

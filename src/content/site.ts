/**
 * Deployment-level settings. Absolute URLs (canonical, Open Graph) require the
 * production origin, supplied via VITE_SITE_URL at build time. Without it the
 * page emits root-relative URLs rather than inventing a domain.
 */
export const site = {
  url: (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ?? '',
  locale: 'en_US',
  /** POST endpoint for waitlist sign-ups (JSON: { email, productId, source }). */
  waitlistEndpoint: (import.meta.env.VITE_WAITLIST_ENDPOINT as string | undefined) ?? '',
};

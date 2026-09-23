import { brand } from '../../content/brand';
import { WaitlistForm } from '../forms/WaitlistForm';
import { BrandMark } from './BrandMark';

export function SiteFooter({ productId }: { productId: string }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer tone-ink">
      <div className="container site-footer__grid">
        <div className="site-footer__signup">
          <a className="brandmark brandmark--footer" href={brand.homeHref} aria-label={`${brand.name} — home`}>
            <BrandMark onDark />
          </a>
          <p className="site-footer__tagline">{brand.tagline}</p>
          <h2 className="site-footer__signup-title">Hear about new essentials first.</h2>
          <WaitlistForm productId={productId} source="footer" submitLabel="Sign up" tone="ink" />
        </div>

        {brand.footer.groups.map((g) => (
          <nav key={g.title} className="site-footer__group" aria-label={g.title}>
            <h2 className="site-footer__heading">{g.title}</h2>
            <ul>
              {g.links.map((l) => (
                <li key={l.label}>
                  {l.href ? (
                    <a href={l.href}>{l.label}</a>
                  ) : (
                    <span className="site-footer__pending">
                      {l.label} <span className="site-footer__soon">Soon</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {brand.footer.social.length > 0 && (
          <nav className="site-footer__group" aria-label="Social">
            <h2 className="site-footer__heading">Follow</h2>
            <ul>
              {brand.footer.social.map((s) => (
                <li key={s.label}>{s.href && <a href={s.href} rel="noopener">{s.label}</a>}</li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      <div className="container site-footer__legal">
        <p>© {year} {brand.name}</p>
      </div>
    </footer>
  );
}

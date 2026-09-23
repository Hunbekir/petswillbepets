import { brand } from '../../content/brand';

/**
 * Renders the official logo file when brand.logo is configured.
 * Until the file is supplied it renders the brand name as plain, unstyled
 * text — deliberately NOT an imitation of the logo lettering.
 */
export function BrandMark({ onDark = false }: { onDark?: boolean }) {
  const logo = brand.logo;
  if (logo) {
    return (
      <img
        className="brandmark__img"
        src={onDark && logo.srcOnDark ? logo.srcOnDark : logo.src}
        width={logo.width}
        height={logo.height}
        alt={brand.name}
      />
    );
  }
  return (
    <span className="brandmark__text" data-logo-missing="true">
      {brand.name}
    </span>
  );
}

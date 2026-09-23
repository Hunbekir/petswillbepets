import type { ProductConfig } from '../types';
import { wasteBags } from './waste-bags';

/**
 * Registry of launch pages. Adding a product = add its config file here.
 * Route for every entry: /products/<slug>
 */
export const products: ProductConfig[] = [wasteBags as unknown as ProductConfig];

export const productRoute = (p: ProductConfig) => `/products/${p.slug}`;

export function productForPath(pathname: string): ProductConfig | undefined {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return products.find((p) => productRoute(p) === clean);
}

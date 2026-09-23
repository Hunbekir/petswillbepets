import { productForPath, products } from './content/products';
import { ProductLaunchPage } from './pages/ProductLaunchPage';

export function App({ pathname }: { pathname: string }) {
  const product = productForPath(pathname) ?? products[0];
  return <ProductLaunchPage product={product} />;
}

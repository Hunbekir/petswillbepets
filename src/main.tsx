import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import { productForPath, products, productRoute } from './content/products';
import './styles/index.css';

const root = document.getElementById('root')!;
const { pathname } = window.location;

// Dev server serves the SPA shell at every path; send "/" to the first launch page.
if (!productForPath(pathname) && pathname === '/' && import.meta.env.DEV) {
  window.history.replaceState(null, '', productRoute(products[0]));
}

const app = (
  <StrictMode>
    <App pathname={window.location.pathname} />
  </StrictMode>
);

if (root.hasChildNodes()) hydrateRoot(root, app);
else {
  const p = productForPath(window.location.pathname) ?? products[0];
  document.title = p.seo.title;
  createRoot(root).render(app);
}

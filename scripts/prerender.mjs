// Prerenders every product route to static HTML and enforces claim control:
// the build fails if rendered text contains a term whose claim is not verified.
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const server = await import(pathToFileURL(path.join(root, 'dist-server/entry-server.js')).href);

const NO_JS_BOOT = `<script>document.documentElement.classList.add('js')</script>`;

// Visible text + alt/aria text, excluding <script>/<style>.
function textOf(html) {
  const alts = [...html.matchAll(/\s(?:alt|aria-label|content)="([^"]*)"/g)].map((m) => m[1]);
  const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');
  return `${body} ${alts.join(' ')}`.replace(/&amp;/g, '&').replace(/\s+/g, ' ');
}

const blocked = server.blockedTerms();
let failed = false;

for (const { path: route } of server.routes) {
  const { html, head } = server.render(route);
  const text = textOf(html + head);
  for (const { claimId, pattern } of blocked) {
    const m = text.match(pattern);
    if (m) {
      failed = true;
      console.error(`✗ ${route}: "${m[0]}" rendered but claim "${claimId}" is not verified`);
    }
  }
  const page = template
    .replace('<!--app-head-->', `${NO_JS_BOOT}\n    ${head}`)
    .replace('<!--app-html-->', html);
  // Emit both /route/index.html and /route.html so the page resolves with or
  // without a trailing slash on any static host.
  const out = path.join(dist, route.replace(/^\//, ''), 'index.html');
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, page);
  await writeFile(path.join(dist, `${route.replace(/^\//, '')}.html`), page);
  console.log(`✓ ${route} → ${path.relative(root, out)}`);
}

// No home page yet: "/" forwards to the first launch page.
const first = server.routes[0].path;
await writeFile(
  path.join(dist, 'index.html'),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>PETS WILL BE PETS</title><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${first}"><link rel="canonical" href="${first}"></head><body><a href="${first}">Continue</a></body></html>`,
);

if (!process.env.VITE_WAITLIST_ENDPOINT) {
  console.warn('⚠ VITE_WAITLIST_ENDPOINT is not set — waitlist forms run in preview mode and do not store emails.');
}
if (!process.env.VITE_SITE_URL) {
  console.warn('⚠ VITE_SITE_URL is not set — canonical and Open Graph URLs are root-relative.');
}

await rm(path.join(root, 'dist-server'), { recursive: true, force: true });
if (failed) {
  console.error('Claim control failed. Fix copy or verify the claim in src/content/productClaims.ts.');
  process.exit(1);
}

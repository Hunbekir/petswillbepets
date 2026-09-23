// Builds a single-page preview bundle (inline CSS/JS, relative image paths)
// for sharing as a hosted preview. Output: preview/index.html + preview/images/*
import { execSync } from 'node:child_process';
import { readFile, writeFile, mkdir, cp, rm, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const run = (c) => execSync(c, { cwd: root, stdio: 'inherit', env: { ...process.env, VITE_BASE: './' } });
run('npx vite build --base=./ --outDir dist-preview');
run('npx vite build --ssr src/entry-server.tsx --outDir dist-server --base=./');

const { pathToFileURL } = await import('node:url');
const server = await import(pathToFileURL(path.join(root, 'dist-server/entry-server.js')).href);
const route = server.routes[0].path;
const { html } = server.render(route);

const assets = await readdir(path.join(root, 'dist-preview/assets'));
const css = await readFile(path.join(root, 'dist-preview/assets', assets.find((f) => f.endsWith('.css'))), 'utf8');
const js = await readFile(path.join(root, 'dist-preview/assets', assets.find((f) => f.endsWith('.js'))), 'utf8');

// In-preview, links to the route itself become in-page anchors.
const body = html
  .replaceAll(`href="${route}#purchase"`, 'href="#purchase"')
  .replaceAll(`href="${route}"`, 'href="#top"')
  // SSR ignores a relative base; make image URLs relative to the page.
  .replace(/(src|srcSet)="([^"]*)"/g, (_m, a, v) => `${a}="${v.replaceAll('/images/', 'images/')}"`);

const page = `<title>PETS WILL BE PETS Waste Bags</title>
<meta name="description" content="Preview of the Waste Bags launch page." />
<script>document.documentElement.classList.add('js')</script>
<style>${css}</style>
<div id="root">${body}</div>
<script type="module">${js.replace(/<\/script/g, '<\\/script')}</script>
`;
const out = path.join(root, 'preview');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await writeFile(path.join(out, 'index.html'), page);
await cp(path.join(root, 'public/images'), path.join(out, 'images'), { recursive: true });
await rm(path.join(root, 'dist-preview'), { recursive: true, force: true });
await rm(path.join(root, 'dist-server'), { recursive: true, force: true });
console.log('preview/index.html', (page.length / 1024).toFixed(0) + 'KB');

// Which pages does the desk's own index (KbIndex.svelte) actually see?
import { createServer } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const kbRoot = resolve(here, '..');

const server = await createServer({
  configFile: false,
  root: kbRoot,
  logLevel: 'warn',
  appType: 'custom',
  server: { middlewareMode: true },
  plugins: [svelte({ extensions: ['.svelte', '.svx'], preprocess: mdsvex() })],
  resolve: { alias: { '#lib': resolve(kbRoot, 'src/lib') } }
});
try {
  const m = await server.ssrLoadModule('/src/lib/kb/KbIndex.svelte');
  console.log('loaded KbIndex', Object.keys(m));
  const pages = await server.ssrLoadModule('/src/routes/kb/+page.svx');
  console.log('kb index page keys', Object.keys(pages));
} catch (e) {
  console.log('ERR', e.message);
}
// print what the glob resolves to, through vite's own transform
try {
  const g = await server.ssrLoadModule('/tools/probe-glob.js');
  console.log('glob ->', Object.keys(g.default));
} catch (e) {
  console.log('glob ERR', e.message);
} finally {
  await server.close();
}

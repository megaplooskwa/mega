// Renders the page this Challenge asks for, with the desk's own components.
//
//   npm run render
//
// Builds the .svx through Vite with mdsvex and the desk's Svelte components, renders it on the
// server inside the runbook frame, and writes the result to ../rendered/<page>.html.
import { build } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const kbRoot = resolve(here, '..');
const outDir = resolve(kbRoot, '..');
const ssrDir = resolve(kbRoot, 'tools/.render');

await build({
  configFile: false,
  root: kbRoot,
  mode: 'production',
  logLevel: 'warn',
  plugins: [svelte({ extensions: ['.svelte', '.svx'], preprocess: mdsvex() })],
  resolve: { alias: { '#lib': resolve(kbRoot, 'src/lib') } },
  build: {
    ssr: resolve(kbRoot, 'tools/render/entry.js'),
    outDir: ssrDir,
    emptyOutDir: true,
    ssrEmitAssets: false,
    rollupOptions: { output: { format: 'es', entryFileNames: 'entry.mjs' } }
  }
});

const { renderPage } = await import(pathToFileURL(resolve(ssrDir, 'entry.mjs')).href);
const { head, body } = renderPage();

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>#4471 · two problems, one ticket · support kb</title>
${head}
</head>
<body>
${body}
</body>
</html>
`;

mkdirSync(outDir, { recursive: true });
const out = resolve(outDir, 'what-it-shows.html');
writeFileSync(out, html, 'utf8');
console.log('wrote', out, html.length, 'bytes');

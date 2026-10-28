import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      // mdsvex reads the layout from disk as this path and imports it as this specifier.
      'src/lib/layouts/runbook.svelte': resolve(import.meta.dirname, 'src/lib/layouts/runbook.svelte')
    }
  }
});

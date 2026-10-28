import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
export default {
  extensions: ['.svelte', '.svx'],
  preprocess: [
    mdsvex({
      // `layout: runbook` in a page's frontmatter is the frame every kb page shares.
      // The value is read from disk relative to this project, so vite.config.js aliases
      // that same string to the component for the pages that import it.
      layout: { runbook: 'src/lib/layouts/runbook.svelte' }
    })
  ],
  kit: {
    // `docs/` is the built site, and the folder GitHub Pages serves this repo from.
    adapter: adapter({ pages: 'docs', assets: 'docs', fallback: undefined, strict: false }),
    alias: { '#lib': 'src/lib' },
    prerender: {
      entries: ['/kb', '/kb/triage/dedupe', '/kb/incidents/4471', '/kb/incidents/4471-two-problems', '/kb/decisions/0001-dedupe-by-subject']
    }
  }
};

// SSR entry: renders the kb page with the desk's own components.
import { render } from 'svelte/server';
import Page from './Page.svelte';

export function renderPage() {
  return render(Page);
}

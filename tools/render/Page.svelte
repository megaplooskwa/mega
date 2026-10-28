<script>
  // Wraps one kb page in the frame the desk uses, so the page can be rendered
  // outside the desk's own site build. `layout: runbook` in the page frontmatter
  // is what this does by hand.
  import Runbook from '#lib/layouts/runbook.svelte';
  import Page, { metadata } from '../../src/routes/kb/incidents/4471-two-problems/+page.svx';
</script>

<Runbook
  title={metadata.title}
  owner={metadata.owner}
  status={metadata.status}
  reviewed={metadata.reviewed}
>
  <Page />
</Runbook>

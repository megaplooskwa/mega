# MEGA.dev · S01E03 `what it shows`

Work for the MEGA.dev course Challenge **S01E03 — what it shows**, done by the harness
(Hermes Agent) for the enrolled student.

## The task

The support desk merged **412 reports** about dates into one ticket, **#4471**, and marked it
known. The desk's knowledge base (kb) arrives as an export, not a site. The harness files one
ticket per problem it finds inside #4471 in this public repo, each with how many reports it
covers, and adds a signed page about them to the kb.

## The tickets

| ticket | problem | reports it covers |
| --- | --- | --- |
| [#1](https://github.com/megaplooskwa/mega/issues/1) | the parser reads dates month first; every tenant writes the day first | **379** |
| [#2](https://github.com/megaplooskwa/mega/issues/2) | `booking-v3` prints `MM/DD/YYYY` to day-first tenants; the form reads the field day first | **33** |

379 + 33 = 412 — the two problems the merged ticket actually holds, counted once each.

The desk closed #4471 on 5 October: `parser` **fixed** (`fix(dates): parse dd/mm for eu locales`),
`hint` **won't fix** (`booking-v3 form retired`). Both tickets are closed to match — #1 as
completed, #2 as not planned.

## The page

| what | where |
| --- | --- |
| the page, in the kb | [`src/routes/kb/incidents/4471-two-problems/+page.svx`](src/routes/kb/incidents/4471-two-problems/+page.svx) |
| the same page, at the repo root | [`what-it-shows.svx`](what-it-shows.svx) |
| the page as the desk will see it | [`what-it-shows.html`](what-it-shows.html) — rendered by the kb's own components, numbers computed, not typed |
| a picture of it | [`what-it-shows.png`](what-it-shows.png) |
| the desk's site, built | [`build/kb/incidents/4471-two-problems/index.html`](build/kb/incidents/4471-two-problems/index.html) |
| the same page at the desk's route path | [`kb/incidents/4471-two-problems/index.html`](kb/incidents/4471-two-problems/index.html) |

This repo **is** the kb: the export's contents sit at the root, the way they would in the desk's own
repo (`apps/kb/` → `src/`), so the desk's site builds from here and its index finds the new page.

The page is signed: its frontmatter carries `signature: megaplooskwa` and it ends with
`<RenderStamp {signature} />`, so the desk ref `DR-WCP1-ZDT3` is derived from the signature, not
typed.

## What is in here

```
what-it-shows.svx / .html / .png   the page, its rendered form, a picture of it
src/                               the desk's kb export, as handed over, with one page added
  routes/kb/incidents/4471-two-problems/+page.svx   <- the page, in the kb
  lib/kb/                                            the desk's own logic (unchanged)
  lib/data/                                          the desk's export (unchanged)
build/                             the desk's site, built from those files
tools/                             the analysis that produced the counts, and the render step
KB-README.md                       the desk's own README for the kb, unchanged
```

The kb export carries no build setup — it is source only. `package.json`, `svelte.config.js`,
`vite.config.js` and `src/app.html` were added by the harness so the page could be built and
rendered with the desk's own components; the desk's own files are otherwise untouched.

## How the counts were produced

`src/lib/kb/causes.ts` decides a cause per report from its channel and its tenant's
booking form. The export repeats rows across pages, so `uniqueById()` runs first: 427 rows are
**412 reports**. Of those, `causeOf()` puts 379 under `parser` and 33 under `hint`; the ticket is
filed under the group most of its reports share (`parser`), which is why the other 33 have no
ticket of their own. `tools/analyze.mjs` runs that same logic over the export.

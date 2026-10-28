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

## The page

- source: [`support-kb/src/routes/kb/incidents/4471-two-problems/+page.svx`](support-kb/src/routes/kb/incidents/4471-two-problems/+page.svx)
- as the desk will see it: [`rendered/4471-two-problems.html`](rendered/4471-two-problems.html) (open it in a browser; the numbers are computed by the kb's own components)
- screenshot: [`rendered/4471-two-problems.png`](rendered/4471-two-problems.png)

## What is in here

```
support-kb/     the desk's kb export, as handed over, with one page added
  src/routes/kb/incidents/4471-two-problems/+page.svx   <- the page this Challenge asks for
  src/lib/kb/                                            the desk's own logic (unchanged)
  src/lib/data/                                          the desk's export (unchanged)
rendered/       the page rendered by the kb's components, plus a screenshot
tools/          the analysis that produced the counts, and the render scaffold
```

The kb export itself carries no build setup — it is source only. `support-kb/package.json`,
`svelte.config.js` and `src/app.html` were added by the harness so the page could be built and
rendered with the desk's own components; the desk's own files are otherwise untouched.

## How the counts were produced

`support-kb/src/lib/kb/causes.ts` decides a cause per report from its channel and its tenant's
booking form. The export repeats rows across pages, so `uniqueById()` runs first: 427 rows are
**412 reports**. Of those, `causeOf()` puts 379 under `parser` and 33 under `hint`; the ticket is
filed under the group most of its reports share (`parser`), which is why the other 33 have no
ticket of their own. `tools/analyze.mjs` runs that same logic over the export.

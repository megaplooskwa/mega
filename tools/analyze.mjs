// Runs the kb's own logic (causes.ts, locales.ts) over reports-4471.json.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Run from the repo root: node tools/analyze.mjs
const SRC = new URL('../support-kb/src', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const dataDir = join(SRC, 'lib/data');

const reports = JSON.parse(readFileSync(join(dataDir, 'reports-4471.json'), 'utf8'));
const notes = JSON.parse(readFileSync(join(dataDir, 'desk-notes.json'), 'utf8'));
const tenants = readdirSync(join(dataDir, 'tenants')).map((f) =>
  JSON.parse(readFileSync(join(dataDir, 'tenants', f), 'utf8'))
);
const byHandle = new Map(tenants.map((t) => [t.handle, t]));
const tenantOf = (r) => byHandle.get(r.tenant);

const DATE_HINT = { 'booking-v2': 'DD/MM/YYYY', 'booking-v3': 'MM/DD/YYYY' };
function dayFirst(locale) {
  const order = new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(new Date(Date.UTC(2026, 0, 2, 12)))
    .map((p) => p.type);
  return order.indexOf('day') < order.indexOf('month');
}
function causeOf(r, t) {
  if (!t || !dayFirst(t.locale)) return null;
  return r.channel === 'form' && DATE_HINT[t.form].startsWith('MM') ? 'hint' : 'parser';
}
const uniqueById = (rs) => [...new Map(rs.map((r) => [r.id, r])).values()];

const merged = uniqueById(reports).filter((r) => r.mergedInto === 4471);
const byCause = new Map();
for (const r of merged) {
  const c = causeOf(r, tenantOf(r)) ?? 'unplaced';
  byCause.set(c, [...(byCause.get(c) ?? []), r]);
}
const groups = [...byCause.entries()].map(([cause, rs]) => {
  const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
  return {
    cause,
    n: rs.length,
    taggedAs: rs.reduce((a, r) => ((a[r.meta.intakeTag] = (a[r.meta.intakeTag] ?? 0) + 1), a), {}),
    tenants: [...new Set(rs.map((r) => r.tenant))].sort(),
    firstSeen: days[0],
    lastSeen: days[days.length - 1],
    oneDayMove: rs.filter((r) => notes.oneDayMove.includes(r.id)).map((r) => r.id),
    channels: rs.reduce((a, r) => ((a[r.channel] = (a[r.channel] ?? 0) + 1), a), {}),
  };
}).sort((a, b) => b.n - a.n);

const owner = groups[0].cause; // ticketCause: the group most reports share

console.log('rows in export        :', reports.length);
console.log('unique reports        :', uniqueById(reports).length);
console.log('merged into #4471     :', merged.length);
console.log('ticket cause (owner)  :', owner);
console.log('duplicate rows        :', reports.length - uniqueById(reports).length);
console.log('\ngroups:');
for (const g of groups) console.log(JSON.stringify(g, null, 1));

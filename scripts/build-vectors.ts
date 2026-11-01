import { mkdirSync, writeFileSync } from 'node:fs';
import { loadAllAnswers } from '../src/lib/catalog-checks';
import { getQuestions } from '../src/lib/data';
import { computeVector } from '../src/lib/scoring';
import type { Vector } from '../src/lib/types';

const qs = getQuestions();
const out: { schools: Record<string, Vector>; thinkers: Record<string, Vector> } = { schools: {}, thinkers: {} };
for (const pa of loadAllAnswers()) {
  (pa.kind === 'school' ? out.schools : out.thinkers)[pa.profileId] = computeVector(qs, pa.answers);
}
const sorted = (r: Record<string, Vector>) => Object.fromEntries(Object.entries(r).sort(([a], [b]) => a.localeCompare(b)));
mkdirSync('data/generated', { recursive: true });
writeFileSync('data/generated/vectors.json', JSON.stringify({ schools: sorted(out.schools), thinkers: sorted(out.thinkers) }, null, 2) + '\n');
console.log(`vetores: ${Object.keys(out.schools).length} escolas, ${Object.keys(out.thinkers).length} pensadores`);

import { checkProfileAnswers, findNearDuplicate, loadAllAnswers } from '../src/lib/catalog-checks';
import { getQuestions } from '../src/lib/data';
import { computeVector } from '../src/lib/scoring';

const [kind, id] = process.argv.slice(2);
if ((kind !== 'school' && kind !== 'thinker') || !id) {
  console.error('uso: npm run validate -- <school|thinker> <id>');
  process.exit(1);
}
const qs = getQuestions();
const todos = loadAllAnswers();
const perfil = todos.find(p => p.kind === kind && p.profileId === id);
if (!perfil) {
  console.error(`não achei data/answers/${kind}/${id}.json`);
  process.exit(1);
}
const erros = checkProfileAnswers(perfil, qs);
const outros = Object.fromEntries(
  todos.filter(p => p.kind === kind && p.profileId !== id).map(p => [p.profileId, computeVector(qs, p.answers)]),
);
const dup = findNearDuplicate(computeVector(qs, perfil.answers), outros);
if (dup) erros.push(`quase duplicado de ${dup}`);
if (erros.length) {
  console.error(`✗ ${kind}/${id}\n- ${erros.join('\n- ')}`);
  process.exit(1);
}
console.log(`✓ ${kind}/${id}`, computeVector(qs, perfil.answers));

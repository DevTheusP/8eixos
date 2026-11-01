import { axisCorrelations } from '../src/lib/catalog-checks';
import { getVectors } from '../src/lib/data';

const LIMITE = 0.7;
const { schools, thinkers } = getVectors();
const todos = [...Object.values(schools), ...Object.values(thinkers)];
if (todos.length < 3) {
  console.log('catálogo pequeno demais pra medir correlação');
  process.exit(0);
}
const pares = axisCorrelations(todos).sort((x, y) => Math.abs(y.r) - Math.abs(x.r));
for (const p of pares.slice(0, 8)) console.log(`${p.a.padEnd(9)} × ${p.b.padEnd(9)} r = ${p.r.toFixed(2)}`);
const ruins = pares.filter(p => Math.abs(p.r) > LIMITE);
if (ruins.length) {
  console.error(`✗ ${ruins.length} par(es) com |r| > ${LIMITE}: eixos redundantes`);
  process.exit(1);
}
console.log(`✓ nenhum par com |r| > ${LIMITE}`);

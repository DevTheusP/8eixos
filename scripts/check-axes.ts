import { axisCorrelations, limiteDoPar } from '../src/lib/catalog-checks';
import { getVectors } from '../src/lib/data';

const { schools, thinkers } = getVectors();
const todos = [...Object.values(schools), ...Object.values(thinkers)];
if (todos.length < 3) {
  console.log('catálogo pequeno demais pra medir correlação');
  process.exit(0);
}
const pares = axisCorrelations(todos).sort((x, y) => Math.abs(y.r) - Math.abs(x.r));
for (const p of pares.slice(0, 8)) console.log(`${p.a.padEnd(9)} × ${p.b.padEnd(9)} r = ${p.r.toFixed(2)}`);
const ruins = pares.filter(p => Math.abs(p.r) > limiteDoPar(p.a, p.b));
if (ruins.length) {
  console.error(`✗ ${ruins.length} par(es) acima do limite: eixos redundantes`);
  process.exit(1);
}
console.log('✓ nenhum par acima do limite (0,7; bem viver × sentido 0,8)');

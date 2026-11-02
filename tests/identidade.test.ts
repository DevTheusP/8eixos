import { execSync } from 'node:child_process';
import { FORMATOS } from '@/lib/selection';

// Textos idênticos aos do 12axes não podem voltar: o 8eixos tem voz própria.
const PROIBIDOS = ['Análise concluída', 'O que te distingue', 'Também próximos, por dimensão', 'Nesta página', 'MATCH', 'Avançar ao responder', 'Todos os formatos usam os mesmos', 'Seus 8 eixos'];

test.each(PROIBIDOS)('nenhum texto da interface repete "%s"', frase => {
  const achados = execSync(`grep -rlF ${JSON.stringify(frase)} src || true`, { encoding: 'utf8' }).trim();
  expect(achados).toBe('');
});

test('formatos com nomes próprios', () => {
  expect([FORMATOS.curta.titulo, FORMATOS.completa.titulo, FORMATOS.profunda.titulo]).toEqual(['Rápida', 'Equilibrada', 'Profunda']);
});

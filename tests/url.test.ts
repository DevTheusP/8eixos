import { paramsToVector, parseResultLink, vectorToParams } from '@/lib/url';
import type { Vector } from '@/lib/types';

const v: Vector = { controle: 72, bemviver: 22.5, sentido: 50, mundo: 40, eu: 62, rotina: 30, guia: 25, verdade: 64 };
const params = (x: Vector) => Object.fromEntries(new URLSearchParams(vectorToParams(x)));

test('ida e volta', () => {
  expect(vectorToParams(v)).toBe('c=72&b=22.5&s=50&m=40&e=62&r=30&g=25&v=64');
  expect(paramsToVector(params(v))).toEqual(v);
});
test.each([[{}], [{ c: 'abc' }], [{ ...params(v), c: '150' }], [{ ...params(v), g: '-3' }], [{ ...params(v), s: '' }]])(
  'inválido → null (%j)',
  p => {
    expect(paramsToVector(p)).toBeNull();
  },
);
test('link de amigo', () => {
  expect(parseResultLink(`https://qualquer.site/resultado?${vectorToParams(v)}`)).toEqual(v);
  expect(parseResultLink(vectorToParams(v))).toEqual(v);
  expect(parseResultLink('oi tudo bem')).toBeNull();
  expect(parseResultLink('https://google.com')).toBeNull();
});

test('letras da URL batem com data/axes.json', async () => {
  const { getAxes } = await import('@/lib/data');
  const { AXIS_PARAMS } = await import('@/lib/url');
  for (const a of getAxes()) expect(AXIS_PARAMS[a.id]).toBe(a.param);
});

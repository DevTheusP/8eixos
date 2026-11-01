// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { Retrato } from '@/components/Retrato';

const base = { id: 'x', descriptor: 'd', years: 'y', schoolId: null, bio: 'b' };

test('sem retrato mostra iniciais', () => {
  const { container } = render(<Retrato thinker={{ ...base, name: 'Viktor Frankl', portrait: null }} size={40} />);
  expect(container.textContent).toBe('VF');
  expect(container.querySelector('img')).toBeNull();
});
test('nome com parênteses e preposição', () => {
  const { container } = render(<Retrato thinker={{ ...base, name: 'Buda (Sidarta Gautama)', portrait: null }} size={40} />);
  expect(container.textContent).toBe('B');
  const r2 = render(<Retrato thinker={{ ...base, name: 'Simone de Beauvoir', portrait: null }} size={40} />);
  expect(r2.container.textContent).toBe('SB');
});
test('com retrato usa a imagem', () => {
  const { container } = render(<Retrato thinker={{ ...base, name: 'Sêneca', portrait: { file: 'seneca.webp', source: 's', license: 'PD' } }} size={40} />);
  expect(container.querySelector('img')?.getAttribute('src')).toBe('/retratos/seneca.webp');
});

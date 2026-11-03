// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react';
import { CompararNaPagina } from '@/components/CompararNaPagina';
import { opcoesComparacao } from '@/lib/alvos';
import { getAxes, getVectors } from '@/lib/data';

const eu = { controle: 20, bemviver: 15, sentido: 10, mundo: 40, eu: 60, rotina: 20, guia: 10, verdade: 30 };
const props = { vector: eu, opcoes: opcoesComparacao(), axes: getAxes() };

beforeAll(() => { Element.prototype.scrollIntoView = () => {}; });

test('comparar com um pensador mostra o resultado na própria página', () => {
  render(<CompararNaPagina {...props} />);
  expect(screen.queryByRole('region', { name: /Você e/ })).toBeNull();
  const campo = screen.getByRole('combobox', { name: /pensador ou escola/i });
  fireEvent.change(campo, { target: { value: 'kant' } });
  fireEvent.keyDown(campo, { key: 'Enter' });
  fireEvent.click(within(campo.closest('form')!).getByRole('button', { name: /Comparar/ }));
  const regiao = screen.getByRole('region', { name: 'Você e Immanuel Kant' });
  expect(regiao.textContent).toMatch(/\d+% de compatibilidade/);
  expect(within(regiao).getByText('Onde vocês concordam')).toBeTruthy();
  expect(within(regiao).getAllByRole('listitem').length).toBeGreaterThanOrEqual(8);
});

test('colar o link de um amigo compara ali mesmo, com os nomes digitados', () => {
  const v = getVectors().schools.estoicismo;
  render(<CompararNaPagina {...props} />);
  fireEvent.change(screen.getByPlaceholderText(/resultado\?c=/), { target: { value: `https://8eixos.vercel.app/resultado?c=${v.controle}&b=${v.bemviver}&s=${v.sentido}&m=${v.mundo}&e=${v.eu}&r=${v.rotina}&g=${v.guia}&v=${v.verdade}` } });
  fireEvent.change(screen.getByLabelText('Seu nome'), { target: { value: 'Ana' } });
  fireEvent.change(screen.getByLabelText('Nome da pessoa'), { target: { value: 'Bia' } });
  fireEvent.submit(screen.getByPlaceholderText(/resultado\?c=/).closest('form')!);
  expect(screen.getByRole('region', { name: 'Ana e Bia' })).toBeTruthy();
});

test('link que não é de resultado avisa sem sair da página', () => {
  render(<CompararNaPagina {...props} />);
  fireEvent.change(screen.getByPlaceholderText(/resultado\?c=/), { target: { value: 'https://exemplo.com/qualquer' } });
  fireEvent.submit(screen.getByPlaceholderText(/resultado\?c=/).closest('form')!);
  expect(screen.getByRole('alert').textContent).toMatch(/não é de um resultado/);
  expect(screen.queryByRole('region', { name: /Você e/ })).toBeNull();
});

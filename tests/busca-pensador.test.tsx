// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { BuscaPensador } from '@/components/BuscaPensador';
import { opcoesComparacao, resolverAlvo } from '@/lib/alvos';

const opcoes = opcoesComparacao();

test('lista pensadores e escolas, cada um resolvendo para um vetor', () => {
  expect(opcoes.some(o => o.valor === 'pensador:agostinho')).toBe(true);
  expect(opcoes.some(o => o.valor === 'escola:estoicismo' && o.tipo === 'Escola')).toBe(true);
  for (const o of opcoes) expect(resolverAlvo(o.valor)?.nome).toBe(o.nome);
  expect(resolverAlvo('escola:nao-existe')).toBeNull();
  expect(resolverAlvo('pensador:../x')).toBeNull();
});

test('digitar filtra sem ligar para acento e maiúscula, e escolher preenche o formulário', () => {
  render(<form><BuscaPensador opcoes={opcoes} /></form>);
  const campo = screen.getByRole('combobox', { name: /pensador ou escola/i });
  fireEvent.change(campo, { target: { value: 'AGOSTI' } });
  const itens = screen.getAllByRole('option');
  expect(itens[0].textContent).toContain('Agostinho de Hipona');
  fireEvent.change(campo, { target: { value: 'estoic' } });
  expect(screen.getAllByRole('option').some(o => o.textContent?.includes('Estoicismo'))).toBe(true);
  fireEvent.change(campo, { target: { value: 'nietzs' } });
  fireEvent.keyDown(campo, { key: 'Enter' });
  expect((campo as HTMLInputElement).value).toBe('Friedrich Nietzsche');
  expect((document.querySelector('input[name="outro"]') as HTMLInputElement).value).toBe('pensador:nietzsche');
  expect(screen.getByRole('button', { name: /Comparar/ }).hasAttribute('disabled')).toBe(false);
});

test('sem escolha não dá para comparar, e busca sem resultado avisa', () => {
  render(<form><BuscaPensador opcoes={opcoes} /></form>);
  expect(screen.getByRole('button', { name: /Comparar/ }).hasAttribute('disabled')).toBe(true);
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'zzzz' } });
  expect(screen.getByText(/Nenhum pensador ou escola/)).toBeTruthy();
});

test('setas mudam o item ativo', () => {
  render(<form><BuscaPensador opcoes={opcoes} /></form>);
  const campo = screen.getByRole('combobox');
  fireEvent.change(campo, { target: { value: 'simone' } });
  fireEvent.keyDown(campo, { key: 'ArrowDown' });
  const ativo = campo.getAttribute('aria-activedescendant');
  expect(ativo && document.getElementById(ativo)?.getAttribute('aria-selected')).toBe('true');
});

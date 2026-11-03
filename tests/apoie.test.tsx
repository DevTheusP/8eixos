// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { Apoie } from '@/components/Apoie';
import { PIX_CHAVE } from '@/lib/site';

test('apoio por Pix: valores sugeridos entram no copia e cola, e dá pra copiar', () => {
  render(<Apoie />);
  const codigo = screen.getByLabelText('Pix copia e cola') as HTMLTextAreaElement;
  expect(codigo.value).toContain(PIX_CHAVE);
  fireEvent.click(screen.getByRole('button', { name: 'R$ 10' }));
  expect(codigo.value).toContain('540510.00');
  fireEvent.click(screen.getByRole('button', { name: 'R$ 1' }));
  expect(codigo.value).toContain('54041.00');
  fireEvent.click(screen.getByRole('button', { name: 'Outro valor' }));
  expect(codigo.value).not.toMatch(/54\d{2}\d+\.\d{2}/);
  expect(screen.getByRole('button', { name: /Copiar código Pix/ })).toBeTruthy();
});

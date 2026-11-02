import { textoCompartilhar, whatsappUrl } from '@/lib/share';

const dados = { escola: 'Estoicismo', score: 91.4, pensador: 'Marco Aurélio', url: 'https://8eixos.vercel.app/resultado?c=1' };

test('texto de compartilhar com escola, compatibilidade, pensador e convite', () => {
  expect(textoCompartilhar(dados)).toBe('Minha filosofia de vida é Estoicismo (91%) e eu penso como Marco Aurélio. Qual é a sua?');
});

test('link de WhatsApp com texto e endereço', () => {
  const u = new URL(whatsappUrl(dados));
  expect(u.origin).toBe('https://wa.me');
  expect(u.searchParams.get('text')).toBe(`${textoCompartilhar(dados)} ${dados.url}`);
});

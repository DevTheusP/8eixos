import { crc16, payloadPix } from '@/lib/pix';

test('CRC16-CCITT bate com o valor de referência do algoritmo', () => {
  expect(crc16('123456789')).toBe('29B1');
});

test('código Pix copia e cola no padrão do Banco Central', () => {
  const p = payloadPix({ chave: 'fea91e3a-8975-4edc-92de-80d025b66b63', nome: 'Matheus Persch', cidade: 'Brasil', valor: 10 });
  expect(p.startsWith('000201')).toBe(true);
  expect(p).toContain('0014br.gov.bcb.pix0136fea91e3a-8975-4edc-92de-80d025b66b63');
  expect(p).toContain('540510.00');
  expect(p).toContain('5802BR5914MATHEUS PERSCH6006BRASIL');
  expect(p.slice(-8, -4)).toBe('6304');
  expect(p.slice(-4)).toBe(crc16(p.slice(0, -4)));
});

test('sem valor, a pessoa digita quanto quer', () => {
  const p = payloadPix({ chave: 'abc', nome: 'Ana', cidade: 'Brasil' });
  expect(p).not.toMatch(/54\d{2}\d+\.\d{2}/);
});

test('CRC confere com o exemplo oficial do manual do Pix (Banco Central)', () => {
  const ex = '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***6304';
  expect(crc16(ex)).toBe('1D3D');
});

// Pix "copia e cola" (BR Code) no padrão EMV do Banco Central, para doações com chave aleatória.

// CRC16-CCITT (polinômio 0x1021, início 0xFFFF), exigido no fim do código Pix.
export function crc16(texto: string): string {
  let crc = 0xffff;
  for (const ch of texto) {
    crc ^= ch.charCodeAt(0) << 8;
    for (let i = 0; i < 8; i++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

const campo = (id: string, valor: string) => `${id}${String(valor.length).padStart(2, '0')}${valor}`;

// O padrão só aceita letras sem acento, em maiúsculas, com limite de tamanho.
const limpar = (t: string, max: number) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z0-9 ]/g, '').slice(0, max);

export function payloadPix({ chave, nome, cidade, valor }: { chave: string; nome: string; cidade: string; valor?: number }): string {
  const semCrc = [
    campo('00', '01'),
    campo('26', campo('00', 'br.gov.bcb.pix') + campo('01', chave)),
    campo('52', '0000'),
    campo('53', '986'),
    valor ? campo('54', valor.toFixed(2)) : '',
    campo('58', 'BR'),
    campo('59', limpar(nome, 25)),
    campo('60', limpar(cidade, 15)),
    campo('62', campo('05', '***')),
    '6304',
  ].join('');
  return semCrc + crc16(semCrc);
}

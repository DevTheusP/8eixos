export function resumo(texto: string, max = 155): string {
  if (texto.length <= max) return texto;
  const corte = texto.slice(0, max - 1);
  return `${corte.slice(0, corte.lastIndexOf(' '))}…`;
}

// Sem artigo: escolas têm gêneros diferentes (o estoicismo, a logoterapia).
export const tituloSofrimento = (nome: string): string => `${nome} e o sofrimento`;

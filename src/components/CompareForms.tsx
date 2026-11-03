import { opcoesComparacao } from '@/lib/alvos';
import { getAxes } from '@/lib/data';
import type { Vector } from '@/lib/types';
import { CompararNaPagina } from './CompararNaPagina';

// Os dados do catálogo saem do servidor; a comparação em si roda no navegador, na mesma página.
export function CompareForms({ vector }: { vector: Vector }) {
  return <CompararNaPagina vector={vector} opcoes={opcoesComparacao()} axes={getAxes()} />;
}

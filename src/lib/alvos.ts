import { getFamilies, getSchools, getThinkers, getVectors } from './data';
import type { Vector } from './types';

// Com quem dá para comparar o resultado: qualquer pensador ou escola do catálogo.
export type OpcaoComparacao = {
  valor: string; nome: string; descricao: string; tipo: 'Pensador' | 'Escola'; retrato?: string; cor: string; busca: string;
};

export const semAcento = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function opcoesComparacao(): OpcaoComparacao[] {
  const escolas = getSchools();
  const cor = new Map(getFamilies().map(f => [f.id, f.color]));
  const corEscola = new Map(escolas.map(e => [e.id, cor.get(e.familyId) ?? '#5b46d6']));
  const nomeEscola = new Map(escolas.map(e => [e.id, e.name]));
  const pensadores: OpcaoComparacao[] = getThinkers().map(t => ({
    valor: `pensador:${t.id}`, nome: t.name, descricao: t.descriptor ?? '', tipo: 'Pensador',
    retrato: t.portrait ? `/retratos/${t.portrait.file}` : undefined, cor: corEscola.get(t.schoolId ?? '') ?? '#5b46d6',
    busca: semAcento(`${t.name} ${t.descriptor ?? ''} ${nomeEscola.get(t.schoolId ?? '') ?? ''}`),
  }));
  const daEscola: OpcaoComparacao[] = escolas.map(e => ({
    valor: `escola:${e.id}`, nome: e.name, descricao: 'Escola filosófica', tipo: 'Escola', cor: corEscola.get(e.id)!,
    busca: semAcento(e.name),
  }));
  return [...pensadores, ...daEscola].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

export function resolverAlvo(valor: string): { nome: string; vector: Vector } | null {
  const [tipo, id] = valor.split(':');
  if (!id || !/^[a-z0-9-]+$/.test(id)) return null;
  const vetores = getVectors();
  if (tipo === 'pensador') {
    const t = getThinkers().find(x => x.id === id);
    return t && vetores.thinkers[id] ? { nome: t.name, vector: vetores.thinkers[id] } : null;
  }
  if (tipo === 'escola') {
    const e = getSchools().find(x => x.id === id);
    return e && vetores.schools[id] ? { nome: e.name, vector: vetores.schools[id] } : null;
  }
  return null;
}

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { profileAnswersSchema } from './schemas';
import { AXIS_IDS, type AxisId, type ProfileAnswers, type Question, type Vector } from './types';

const MAX_NEUTRAS = 0.4;
const DUPLICADO_ABAIXO_DE = 8;

export function checkProfileAnswers(pa: ProfileAnswers, questions: Question[]): string[] {
  const erros: string[] = [];
  const ids = new Set(questions.map(q => q.id));
  const faltando = questions.filter(q => pa.answers[q.id] === undefined).map(q => q.id);
  if (faltando.length) erros.push(`${faltando.length} pergunta(s) sem resposta: ${faltando.slice(0, 5).join(', ')}…`);
  const desconhecidas = Object.keys(pa.answers).filter(id => !ids.has(id));
  if (desconhecidas.length) erros.push(`id(s) desconhecido(s): ${desconhecidas.join(', ')}`);
  const respostas = Object.values(pa.answers);
  const neutras = respostas.filter(a => a === 2).length;
  if (respostas.length && neutras / respostas.length > MAX_NEUTRAS) {
    erros.push(`respostas neutras demais: ${neutras}/${respostas.length} (máximo ${MAX_NEUTRAS * 100}%)`);
  }
  return erros;
}

export function findNearDuplicate(v: Vector, others: Record<string, Vector>): string | null {
  for (const [id, o] of Object.entries(others)) {
    if (Math.max(...AXIS_IDS.map(a => Math.abs(v[a] - o[a]))) < DUPLICADO_ABAIXO_DE) return id;
  }
  return null;
}

function pearson(x: number[], y: number[]): number {
  const n = x.length;
  const mx = x.reduce((s, v) => s + v, 0) / n;
  const my = y.reduce((s, v) => s + v, 0) / n;
  let cov = 0, vx = 0, vy = 0;
  for (let i = 0; i < n; i++) {
    cov += (x[i] - mx) * (y[i] - my);
    vx += (x[i] - mx) ** 2;
    vy += (y[i] - my) ** 2;
  }
  return vx === 0 || vy === 0 ? 0 : cov / Math.sqrt(vx * vy);
}

export function axisCorrelations(vectors: Vector[]): { a: AxisId; b: AxisId; r: number }[] {
  const out: { a: AxisId; b: AxisId; r: number }[] = [];
  AXIS_IDS.forEach((a, i) => AXIS_IDS.slice(i + 1).forEach(b => {
    out.push({ a, b, r: pearson(vectors.map(v => v[a]), vectors.map(v => v[b])) });
  }));
  return out;
}

export function loadAllAnswers(root = path.join(process.cwd(), 'data', 'answers')): ProfileAnswers[] {
  return (['school', 'thinker'] as const).flatMap(kind => {
    const dir = path.join(root, kind);
    if (!existsSync(dir)) return [];
    return readdirSync(dir).filter(f => f.endsWith('.json')).sort().map(f => {
      const parsed = profileAnswersSchema.safeParse(JSON.parse(readFileSync(path.join(dir, f), 'utf8')));
      if (!parsed.success) throw new Error(`data/answers/${kind}/${f} inválido: ${parsed.error.message}`);
      if (parsed.data.kind !== kind || `${parsed.data.profileId}.json` !== f) {
        throw new Error(`data/answers/${kind}/${f}: kind/profileId não batem com o caminho`);
      }
      return parsed.data as ProfileAnswers;
    });
  });
}

// Acima disso, dois eixos medem quase a mesma coisa no catálogo e precisam ser revistos (spec, "Validação obrigatória").
export const LIMITE_CORRELACAO = 0.7;
// Exceção revista em 2026-11-03: as tradições religiosas são quase todas éticas da virtude e as filosofias do prazer quase
// todas sem Deus, então bem viver × sentido correlaciona no catálogo (0,79 nas escolas) sem que as perguntas se misturem.
// Os eixos seguem separados porque uma pessoa pode ser virtuosa sem Deus ou buscar prazer com fé.
const EXCECOES: Record<string, number> = { 'bemviver|sentido': 0.8 };

export function limiteDoPar(a: string, b: string): number {
  return EXCECOES[[a, b].sort().join('|')] ?? LIMITE_CORRELACAO;
}

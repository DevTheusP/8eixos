import type { Formato } from './selection';
import type { AnswerIndex, Question } from './types';

export interface QuizState {
  formato: Formato;
  questionIds: string[];
  answers: Record<string, AnswerIndex>;
  index: number;
  /** Perguntas que a pessoa pulou com "Trocar": não voltam a aparecer. */
  skipped?: string[];
}

const key = (f: Formato) => `quiz:${f}`;

export function select(s: QuizState, i: AnswerIndex): QuizState {
  const id = s.questionIds[s.index];
  return { ...s, answers: { ...s.answers, [id]: i } };
}

export function advance(s: QuizState): QuizState {
  const id = s.questionIds[s.index];
  return s.answers[id] === undefined ? s : { ...s, index: s.index + 1 };
}

export function answer(s: QuizState, i: AnswerIndex): QuizState {
  return advance(select(s, i));
}

// Troca só por outra do mesmo eixo e do mesmo polo, pra não desequilibrar o resultado.
function alternativas(s: QuizState, pool: Question[]): Question[] {
  const atual = pool.find(q => q.id === s.questionIds[s.index]);
  if (!atual) return [];
  const usadas = new Set([...s.questionIds, ...(s.skipped ?? [])]);
  return pool.filter(q => q.axis === atual.axis && q.polarity === atual.polarity && !usadas.has(q.id));
}

export function canSwap(s: QuizState, pool: Question[]): boolean {
  return alternativas(s, pool).length > 0;
}

export function swap(s: QuizState, pool: Question[], rng: () => number = Math.random): QuizState {
  const opcoes = alternativas(s, pool);
  if (opcoes.length === 0) return s;
  const antiga = s.questionIds[s.index];
  const nova = opcoes[Math.floor(rng() * opcoes.length)].id;
  const answers = { ...s.answers };
  delete answers[antiga];
  return {
    ...s,
    questionIds: s.questionIds.map((id, i) => (i === s.index ? nova : id)),
    answers,
    skipped: [...(s.skipped ?? []), antiga],
  };
}

export function back(s: QuizState): QuizState {
  return { ...s, index: Math.max(0, s.index - 1) };
}

export function isDone(s: QuizState): boolean {
  return s.index >= s.questionIds.length;
}

export function saveState(s: QuizState): void {
  try {
    localStorage.setItem(key(s.formato), JSON.stringify(s));
  } catch {
    // Sem storage (aba privada, bloqueio): o quiz segue sem salvar progresso.
    // localStorage e não sessionStorage: no celular a aba fecha o tempo todo e o progresso precisa sobreviver.
  }
}

export function clearState(f: Formato): void {
  try {
    localStorage.removeItem(key(f));
  } catch {
    // idem
  }
}

export function loadState(formato: Formato): QuizState | null {
  try {
    const raw = localStorage.getItem(key(formato));
    if (!raw) return null;
    const s = JSON.parse(raw);
    const valido = s && s.formato === formato && Array.isArray(s.questionIds) && typeof s.answers === 'object'
      && s.answers !== null && Number.isInteger(s.index) && s.index >= 0 && s.index <= s.questionIds.length;
    return valido ? (s as QuizState) : null;
  } catch {
    return null;
  }
}

const ULTIMO = 'quiz:ultimo-resultado';

export interface ResumoResultado { escola: string; familia: string; cor: string; score: number }

// Guarda os parâmetros do resultado e um resumo pra home mostrar a escola sem recalcular nada.
export function saveLastResult(params: string, resumo?: ResumoResultado): void {
  try {
    localStorage.setItem(ULTIMO, JSON.stringify({ params, resumo }));
  } catch {
    // sem storage: só não lembra o último resultado
  }
}

const PARAMS_OK = /^[a-z]=\d{1,3}(&[a-z]=\d{1,3}){7}$/;

function resumoValido(r: unknown): r is ResumoResultado {
  const x = r as Partial<ResumoResultado> | null;
  return !!x && typeof x.escola === 'string' && typeof x.familia === 'string' && typeof x.score === 'number'
    && typeof x.cor === 'string' && /^#[0-9a-f]{6}$/i.test(x.cor);
}

// Aceita também o formato antigo, que guardava só os parâmetros como texto.
export function loadLastResult(): { params: string; resumo?: ResumoResultado } | null {
  try {
    const raw = localStorage.getItem(ULTIMO);
    if (!raw) return null;
    const v = (raw.startsWith('{') ? JSON.parse(raw) : { params: raw }) as { params?: unknown; resumo?: unknown };
    // O que vem do navegador é validado: parâmetros no formato do resultado e um resumo com tipos e cor esperados.
    if (typeof v.params !== 'string' || !PARAMS_OK.test(v.params)) return null;
    return { params: v.params, resumo: resumoValido(v.resumo) ? v.resumo : undefined };
  } catch {
    return null;
  }
}

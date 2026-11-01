import type { Formato } from './selection';
import type { AnswerIndex } from './types';

export interface QuizState {
  formato: Formato;
  questionIds: string[];
  answers: Record<string, AnswerIndex>;
  index: number;
}

const key = (f: Formato) => `quiz:${f}`;

export function answer(s: QuizState, i: AnswerIndex): QuizState {
  const id = s.questionIds[s.index];
  return { ...s, answers: { ...s.answers, [id]: i }, index: s.index + 1 };
}

export function back(s: QuizState): QuizState {
  return { ...s, index: Math.max(0, s.index - 1) };
}

export function isDone(s: QuizState): boolean {
  return s.index >= s.questionIds.length;
}

export function saveState(s: QuizState): void {
  try {
    sessionStorage.setItem(key(s.formato), JSON.stringify(s));
  } catch {
    // Sem storage (aba privada, bloqueio): o quiz segue sem salvar progresso.
  }
}

export function clearState(f: Formato): void {
  try {
    sessionStorage.removeItem(key(f));
  } catch {
    // idem
  }
}

export function loadState(formato: Formato): QuizState | null {
  try {
    const raw = sessionStorage.getItem(key(formato));
    if (!raw) return null;
    const s = JSON.parse(raw);
    const valido = s && s.formato === formato && Array.isArray(s.questionIds) && typeof s.answers === 'object'
      && s.answers !== null && Number.isInteger(s.index) && s.index >= 0 && s.index <= s.questionIds.length;
    return valido ? (s as QuizState) : null;
  } catch {
    return null;
  }
}

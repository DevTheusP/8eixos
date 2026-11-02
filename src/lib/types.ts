export type AxisId = 'controle' | 'bemviver' | 'sentido' | 'mundo' | 'eu' | 'rotina' | 'guia' | 'verdade';

export const AXIS_IDS: readonly AxisId[] = ['controle', 'bemviver', 'sentido', 'mundo', 'eu', 'rotina', 'guia', 'verdade'];

export type Vector = Record<AxisId, number>;

export type AnswerIndex = 0 | 1 | 2 | 3 | 4;

export interface Axis { id: AxisId; name: string; poleA: string; poleB: string; param: string; descA: string; descB: string }

export interface Question {
  id: string;
  axis: AxisId;
  kind: 'likert' | 'forced';
  polarity: 'A' | 'B';
  text?: string;
  textLeft?: string;
  textRight?: string;
}

export interface Family { id: string; name: string; color: string; soft: string }

export interface School {
  id: string;
  name: string;
  familyId: string;
  quote: string;
  summary: string;
  lida: { sofrimento: string; morte: string; felicidade: string; relacoes: string };
  thinkerIds: string[];
}

export interface Thinker {
  id: string;
  name: string;
  descriptor: string;
  years: string;
  schoolId: string | null;
  bio: string;
  portrait: { file: string; source: string; license: string } | null;
}

export interface Book { id: string; thinkerId: string; title: string; year: number; amazonQuery: string }

export interface ProfileAnswers {
  profileId: string;
  kind: 'school' | 'thinker';
  answers: Record<string, AnswerIndex>;
  notes?: Record<string, string>;
}

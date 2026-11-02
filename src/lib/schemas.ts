import { z } from 'zod';
import { AXIS_IDS } from './types';

export const axisIdSchema = z.enum(AXIS_IDS as [string, ...string[]]);
export const answerIndexSchema = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)]);

export const axisSchema = z.object({
  id: axisIdSchema,
  name: z.string().min(1),
  poleA: z.string().min(1),
  poleB: z.string().min(1),
  param: z.string().length(1),
});

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/);
export const familySchema = z.object({ id: z.string().min(1), name: z.string().min(1), color: hex, soft: hex });

export const questionSchema = z.object({
  id: z.string().min(1),
  axis: axisIdSchema,
  kind: z.enum(['likert', 'forced']),
  polarity: z.enum(['A', 'B']),
  text: z.string().min(1).optional(),
  textLeft: z.string().min(1).optional(),
  textRight: z.string().min(1).optional(),
});

export const schoolSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  familyId: z.string().min(1),
  quote: z.string().min(1),
  summary: z.string().min(1),
  lida: z.object({ sofrimento: z.string(), morte: z.string(), felicidade: z.string(), relacoes: z.string() }),
  thinkerIds: z.array(z.string()),
});

export const thinkerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  descriptor: z.string().min(1),
  years: z.string().min(1),
  schoolId: z.string().nullable(),
  bio: z.string().min(1),
  portrait: z.object({ file: z.string(), source: z.string(), license: z.string() }).nullable(),
});

export const bookSchema = z.object({
  id: z.string().min(1),
  thinkerId: z.string().min(1),
  title: z.string().min(1),
  year: z.number().int(),
  amazonQuery: z.string().min(1),
});

const vectorSchema = z.object(Object.fromEntries(AXIS_IDS.map(a => [a, z.number().min(0).max(100)]))).strict();

export const vectorsSchema = z.object({
  schools: z.record(z.string(), vectorSchema),
  thinkers: z.record(z.string(), vectorSchema),
});

export const profileAnswersSchema = z.object({
  profileId: z.string().min(1),
  kind: z.enum(['school', 'thinker']),
  answers: z.record(z.string(), answerIndexSchema),
  notes: z.record(z.string(), z.string()).optional(),
});

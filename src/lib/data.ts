import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { z } from 'zod';
import {
  axisSchema, bookSchema, familySchema, questionSchema, schoolSchema, thinkerSchema, vectorsSchema,
} from './schemas';
import type { Axis, Book, Family, Question, School, Thinker, Vector } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

function load<T>(file: string, schema: z.ZodType<T>, empty: T): T {
  const full = path.join(DATA_DIR, file);
  if (!existsSync(full)) return empty;
  const parsed = schema.safeParse(JSON.parse(readFileSync(full, 'utf8')));
  if (!parsed.success) throw new Error(`data/${file} inválido: ${parsed.error.message}`);
  return parsed.data;
}

export const getAxes = (): Axis[] => load('axes.json', axisSchema.array(), []) as Axis[];
export const getFamilies = (): Family[] => load('families.json', familySchema.array(), []);
export const getQuestions = (): Question[] => load('questions.json', questionSchema.array(), []) as Question[];
export const getSchools = (): School[] => load('schools.json', schoolSchema.array(), []);
export const getThinkers = (): Thinker[] => load('thinkers.json', thinkerSchema.array(), []);
export const getBooks = (): Book[] => load('books.json', bookSchema.array(), []);
export const getVectors = (): { schools: Record<string, Vector>; thinkers: Record<string, Vector> } =>
  load('generated/vectors.json', vectorsSchema, { schools: {}, thinkers: {} }) as {
    schools: Record<string, Vector>;
    thinkers: Record<string, Vector>;
  };

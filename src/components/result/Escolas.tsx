import Link from 'next/link';
import type { Result } from '@/lib/result';

export function Escolas({ result }: { result: Result }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl bg-tile p-5">
        <p className="mb-2 font-semibold">Também próximas</p>
        <ul className="space-y-1">
          {result.otherSchools.map(s => (
            <li key={s.school.id} className="flex justify-between gap-2">
              <Link href={`/escolas/${s.school.id}`} className="hover:text-navy">{s.school.name}</Link>
              <span className="font-semibold text-navy">{Math.round(s.score)}%</span>
            </li>
          ))}
        </ul>
      </div>
      <Link href={`/escolas/${result.opposite.id}`} className="block rounded-2xl bg-soft p-5">
        <p className="font-semibold">Seu oposto filosófico</p>
        <p className="font-display text-3xl font-bold text-navy">{result.opposite.name}</p>
        <p className="mt-1 text-sm italic">“{result.opposite.quote}”</p>
      </Link>
    </div>
  );
}

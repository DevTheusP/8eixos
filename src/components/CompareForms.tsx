import { getThinkers } from '@/lib/data';
import { AXIS_IDS, type Vector } from '@/lib/types';
import { AXIS_PARAMS } from '@/lib/url';

function Hidden({ vector }: { vector: Vector }) {
  return AXIS_IDS.map(a => <input key={a} type="hidden" name={AXIS_PARAMS[a]} value={vector[a]} />);
}

export function CompareForms({ vector }: { vector: Vector }) {
  const thinkers = [...getThinkers()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <form action="/comparar" method="get" className="rounded-2xl bg-tile p-5">
        <Hidden vector={vector} />
        <label className="font-semibold" htmlFor="outro-link">Com um amigo</label>
        <p className="text-sm text-mute">Cole o link do resultado de outra pessoa.</p>
        <input id="outro-link" name="outro" required placeholder="https://…/resultado?c=…" className="mt-3 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm" />
        <button className="mt-3 rounded-full bg-[#14302a] px-4 py-2 text-sm font-semibold text-white">Comparar</button>
      </form>
      <form action="/comparar" method="get" className="rounded-2xl bg-tile p-5">
        <Hidden vector={vector} />
        <label className="font-semibold" htmlFor="outro-pensador">Com um pensador</label>
        <p className="text-sm text-mute">Veja eixo por eixo onde vocês concordam e onde brigariam.</p>
        <select id="outro-pensador" name="outro" className="mt-3 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm">
          {thinkers.map(t => <option key={t.id} value={`pensador:${t.id}`}>{t.name}</option>)}
        </select>
        <button className="mt-3 rounded-full bg-[#14302a] px-4 py-2 text-sm font-semibold text-white">Comparar</button>
      </form>
    </div>
  );
}

export function Indice({ itens }: { itens: { id: string; label: string; locked?: boolean }[] }) {
  return (
    <nav className="sticky top-6 hidden rounded-3xl border border-line bg-card p-4 lg:block" aria-label="Nesta página">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-mute">Nesta página</p>
      <ol>
        {itens.map((it, i) => (
          <li key={it.id}>
            <a href={`#${it.id}`} className={`flex gap-3 rounded-lg px-3 py-2 text-sm hover:bg-soft ${it.locked ? 'text-mute' : ''}`}>
              <span className="w-4 text-xs text-mute">{String(i + 1).padStart(2, '0')}</span>
              {it.label}{it.locked ? ' 🔒' : ''}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

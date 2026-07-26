import { Search, X } from 'lucide-react'
import { useCatalogMeta } from '../../hooks/useCatalogMeta'

const DURATIONS = [
  { label: '≤ 30 min', value: 30 },
  { label: '≤ 1 hora', value: 60 },
  { label: '≤ 2 horas', value: 120 },
  { label: '≤ 3 horas', value: 180 },
]

export default function GameFilters({ filters, onChange }) {
  const { categories, mechanics } = useCatalogMeta()

  function set(key, val) { onChange({ ...filters, [key]: val }) }
  function clear() { onChange({ search: '', players: '', maxDuration: '', category: '', mechanic: '' }) }

  const hasFilters = Object.values(filters).some(v => v !== '' && v !== null)

  return (
    <div className="card mb-5 space-y-3">
      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-xogun-muted" />
        <input className="input pl-8" placeholder="Buscar xogo..." value={filters.search || ''}
          onChange={e => set('search', e.target.value)} />
      </div>

      <div className="flex gap-2 flex-wrap">
        {/* Players */}
        <input type="number" className="input w-28" placeholder="Xogadores" min={1} max={20}
          value={filters.players || ''} onChange={e => set('players', e.target.value)} />

        {/* Duration */}
        <select className="input w-36" value={filters.maxDuration || ''}
          onChange={e => set('maxDuration', e.target.value)}>
          <option value="">Calquera duración</option>
          {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>

        {/* Category */}
        <select className="input w-40" value={filters.category || ''}
          onChange={e => set('category', e.target.value)}>
          <option value="">Todas as categorías</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
        </select>

        {/* Mechanic */}
        <select className="input w-48" value={filters.mechanic || ''}
          onChange={e => set('mechanic', e.target.value)}>
          <option value="">Todas as mecánicas</option>
          {mechanics.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>

        {hasFilters && (
          <button onClick={clear} className="btn-ghost flex items-center gap-1 text-xs">
            <X size={12} /> Limpar
          </button>
        )}
      </div>
    </div>
  )
}

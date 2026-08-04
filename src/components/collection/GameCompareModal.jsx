import { useState } from 'react'
import { X, Search, Plus, Users, Clock, Star, Trash2 } from 'lucide-react'
import { useGames } from '../../hooks/useGames'
import { useCatalogMeta } from '../../hooks/useCatalogMeta'
import ImagePreview from '../shared/ImagePreview'

const MAX_GAMES = 3

function GamePicker({ excludeIds, onAdd }) {
  const [search, setSearch] = useState('')
  const { games } = useGames({ search })

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-xogun-muted" />
        <input className="input pl-8" placeholder="Buscar xogo para comparar..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {search && (
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {games.filter(g => !excludeIds.includes(g.id)).slice(0, 6).map(g => (
            <button key={g.id} onClick={() => { onAdd(g); setSearch('') }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-xogun-surface transition-colors text-sm text-left">
              {g.images?.[0] ? <img src={g.images[0]} className="w-6 h-6 rounded object-cover" /> : <span>🎲</span>}
              {g.name}
              <Plus size={12} className="ml-auto text-xogun-muted flex-shrink-0" />
            </button>
          ))}
          {games.length === 0 && <p className="text-xogun-muted text-xs py-2 px-1">Sen resultados</p>}
        </div>
      )}
    </div>
  )
}

function playersLabel(g) {
  if (!g.min_players && !g.max_players) return '—'
  return g.min_players === g.max_players ? `${g.min_players}` : `${g.min_players ?? '?'}–${g.max_players ?? '?'}`
}
function durationLabel(g) {
  if (!g.min_duration) return '—'
  return g.max_duration && g.max_duration !== g.min_duration ? `${g.min_duration}–${g.max_duration} min` : `${g.min_duration} min`
}

const ROWS = [
  { label: 'Xogadores', get: playersLabel },
  { label: 'Duración', get: durationLabel },
  { label: 'Idade recomendada', get: g => g.age ? `${g.age}+` : '—' },
  { label: 'Complexidade', get: g => g.complexity ? `${Number(g.complexity).toFixed(1)} / 5` : '—' },
  { label: 'Valoración BGG', get: g => g.bgg_rating ? Number(g.bgg_rating).toFixed(1) : '—' },
  { label: 'Editorial', get: g => g.publisher || '—' },
  { label: 'Deseñador', get: g => g.designer || '—' },
  { label: 'Ano', get: g => g.year_published || '—' },
]

export default function GameCompareModal({ onClose }) {
  const [selected, setSelected] = useState([])
  const { categories, mechanics } = useCatalogMeta()

  function addGame(g) {
    if (selected.length >= MAX_GAMES) return
    setSelected(s => [...s, g])
  }
  function removeGame(id) {
    setSelected(s => s.filter(g => g.id !== id))
  }

  function namesFor(g, ids, list) {
    return (ids || []).map(id => list.find(c => c.id === id)?.name).filter(Boolean).join(', ') || '—'
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal max-w-3xl" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-display text-sm text-xogun-accent">Comparar xogos</h3>
          <button onClick={onClose}><X size={18} className="text-xogun-muted" /></button>
        </div>

        <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
          {selected.length < MAX_GAMES && (
            <GamePicker excludeIds={selected.map(g => g.id)} onAdd={addGame} />
          )}

          {selected.length === 0 ? (
            <p className="text-xogun-muted text-sm text-center py-8">Busca e engade polo menos dous xogos para compáralos.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <td className="w-28"></td>
                    {selected.map(g => (
                      <td key={g.id} className="px-3 pb-3 text-center align-top">
                        <div className="flex flex-col items-center gap-1.5">
                          <ImagePreview src={g.images?.[0]} alt={g.name} size={64} fallbackIcon="🎲" />
                          <span className="font-display text-sm text-xogun-text leading-tight">{g.name}</span>
                          <button onClick={() => removeGame(g.id)} className="text-xogun-muted hover:text-xogun-red">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map(row => (
                    <tr key={row.label} className="border-t border-xogun-border">
                      <td className="py-2 pr-2 text-xogun-muted text-xs whitespace-nowrap">{row.label}</td>
                      {selected.map(g => (
                        <td key={g.id} className="py-2 px-3 text-center text-xogun-text">{row.get(g)}</td>
                      ))}
                    </tr>
                  ))}
                  <tr className="border-t border-xogun-border">
                    <td className="py-2 pr-2 text-xogun-muted text-xs whitespace-nowrap">Categorías</td>
                    {selected.map(g => (
                      <td key={g.id} className="py-2 px-3 text-center text-xogun-text text-xs">{namesFor(g, g.category_ids, categories)}</td>
                    ))}
                  </tr>
                  <tr className="border-t border-xogun-border">
                    <td className="py-2 pr-2 text-xogun-muted text-xs whitespace-nowrap">Mecánicas</td>
                    {selected.map(g => (
                      <td key={g.id} className="py-2 px-3 text-center text-xogun-text text-xs">{namesFor(g, g.mechanic_ids, mechanics)}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Plus, Trash2, X, Search, ListPlus } from 'lucide-react'
import { useGameLists, useGameListItems } from '../../hooks/useGameLists'
import { useGames } from '../../hooks/useGames'
import { VISIBILITY_OPTIONS } from '../../hooks/useCollection'
import GameListRow from '../shared/GameListRow'

const EMOJI_OPTIONS = ['📋', '🎒', '🚗', '🏕️', '🎉', '🏠', '✈️', '🎯']

function NewListForm({ onCreate, onCancel }) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('📋')
  const [visibility, setVisibility] = useState('private')

  return (
    <div className="card space-y-3">
      <div className="flex gap-2 items-center">
        <select className="input w-16 text-center" value={emoji} onChange={e => setEmoji(e.target.value)}>
          {EMOJI_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        <input className="input flex-1" placeholder="Nome da lista (ex: Excursión agosto)" value={name}
          onChange={e => setName(e.target.value)} autoFocus />
      </div>
      <div>
        <label className="label">Visibilidade</label>
        <div className="flex gap-2">
          {VISIBILITY_OPTIONS.map(v => (
            <button key={v.id} onClick={() => setVisibility(v.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border transition-colors ${visibility === v.id ? 'border-xogun-accent text-xogun-accent bg-xogun-accent/10' : 'border-xogun-border text-xogun-muted hover:border-xogun-accent'}`}>
              {v.emoji} {v.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onCancel} className="btn-secondary flex-1">Cancelar</button>
        <button onClick={() => name.trim() && onCreate(name.trim(), emoji, visibility)} disabled={!name.trim()}
          className="btn-primary flex-1 disabled:opacity-50">Crear lista</button>
      </div>
    </div>
  )
}

function AddGameToList({ listId, onAdded, excludeIds }) {
  const [search, setSearch] = useState('')
  const { games } = useGames({ search })
  const { addGame } = useGameListItems(listId)

  async function handleAdd(gameId) {
    await addGame(gameId)
    setSearch('')
    onAdded?.()
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-xogun-muted" />
        <input className="input pl-8" placeholder="Buscar xogo para engadir..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {search && (
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {games.filter(g => !excludeIds.includes(g.id)).slice(0, 8).map(g => (
            <button key={g.id} onClick={() => handleAdd(g.id)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-xogun-surface transition-colors text-sm text-left">
              {g.images?.[0] ? <img src={g.images[0]} className="w-6 h-6 rounded object-cover" /> : <span>🎲</span>}
              {g.name}
              <Plus size={12} className="ml-auto text-xogun-muted" />
            </button>
          ))}
          {games.length === 0 && <p className="text-xogun-muted text-xs py-2 px-1">Sen resultados</p>}
        </div>
      )}
    </div>
  )
}

function ListDetail({ list, onBack, onDeleted }) {
  const { items, removeGame } = useGameListItems(list.id)
  const { deleteList } = useGameLists()

  async function handleDelete() {
    if (!confirm(`Eliminar a lista "${list.name}"?`)) return
    await deleteList(list.id)
    onDeleted?.()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="btn-ghost text-xs">← Volver</button>
        <h2 className="font-display text-lg text-xogun-accent flex-1 truncate">{list.emoji} {list.name}</h2>
        <button onClick={handleDelete} className="btn-ghost p-1.5 hover:text-xogun-red"><Trash2 size={14} /></button>
      </div>

      <div className="card">
        <label className="label flex items-center gap-1.5"><ListPlus size={12} /> Engadir xogo á lista</label>
        <AddGameToList listId={list.id} excludeIds={items.map(i => i.game_id)} />
      </div>

      {items.length === 0 ? (
        <p className="text-xogun-muted text-sm text-center py-10">Esta lista está baleira. Busca un xogo arriba para engadilo.</p>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="relative">
              <GameListRow game={item.games} />
              <button onClick={() => removeGame(item.game_id)}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-xogun-muted hover:text-xogun-red">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function GameListsPanel({ userId }) {
  const { lists, loading, createList } = useGameLists(userId)
  const [selected, setSelected] = useState(null)
  const [showNew, setShowNew] = useState(false)

  async function handleCreate(name, emoji, visibility) {
    const { data } = await createList(name, { emoji, visibility })
    setShowNew(false)
    if (data) setSelected(data)
  }

  if (selected) {
    return <ListDetail list={selected} onBack={() => setSelected(null)} onDeleted={() => setSelected(null)} />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xogun-muted text-sm">Listas para agrupar xogos con calquera propósito — unha excursión, unha quedada, o que queiras.</p>
        <button onClick={() => setShowNew(s => !s)} className="btn-secondary flex items-center gap-1.5 text-xs flex-shrink-0">
          <Plus size={13} /> Nova lista
        </button>
      </div>

      {showNew && <NewListForm onCreate={handleCreate} onCancel={() => setShowNew(false)} />}

      {loading ? (
        <p className="text-xogun-muted text-sm text-center py-10">Cargando...</p>
      ) : lists.length === 0 ? (
        <p className="text-xogun-muted text-sm text-center py-10">Aínda non tes listas. Crea a primeira arriba.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {lists.map(l => (
            <button key={l.id} onClick={() => setSelected(l)}
              className="card-hover text-left flex items-center gap-3">
              <span className="text-2xl flex-shrink-0">{l.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{l.name}</p>
                <p className="text-xogun-muted text-xs">{l.game_list_items?.[0]?.count || 0} xogos</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useCollection, COLLECTION_STATUSES } from '../hooks/useCollection'
import GameCard from '../components/shared/GameCard'
import { Search, X } from 'lucide-react'

export default function CollectionPage() {
  const { user } = useAuth()
  const { collection, loading, removeFromCollection, updateEntry } = useCollection(user?.id)
  const [activeStatus, setActiveStatus] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = collection.filter(entry => {
    const g = entry.games
    const matchStatus = activeStatus === 'all' || entry.status === activeStatus
    const matchSearch = !search || g?.name?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const countByStatus = (s) => collection.filter(e => e.status === s).length

  return (
    <div>
      <div className="mb-6">
        <h1 className="section-title">A miña colección</h1>
        <p className="section-subtitle">{collection.length} xogos</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        <button onClick={() => setActiveStatus('all')}
          className={`badge transition-colors ${activeStatus === 'all' ? 'border-xogun-accent text-xogun-accent bg-xogun-accent/10' : 'border-xogun-border text-xogun-muted hover:border-xogun-accent'}`}>
          Todos ({collection.length})
        </button>
        {COLLECTION_STATUSES.map(s => (
          <button key={s.id} onClick={() => setActiveStatus(s.id)}
            className={`badge transition-colors ${activeStatus === s.id ? 'border-xogun-accent text-xogun-accent bg-xogun-accent/10' : 'border-xogun-border text-xogun-muted hover:border-xogun-accent'}`}>
            {s.emoji} {s.label} ({countByStatus(s.id)})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-xogun-muted" />
        <input className="input pl-8" placeholder="Buscar na miña colección..." value={search}
          onChange={e => setSearch(e.target.value)} />
        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xogun-muted hover:text-xogun-text"><X size={13} /></button>}
      </div>

      {loading ? (
        <div className="text-center text-xogun-muted py-20">Cargando colección...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xogun-muted">
            {collection.length === 0 ? 'A túa colección está baleira. Vai ao catálogo para engadir xogos.' : 'Non hai resultados para esa busca.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map(entry => (
            <div key={entry.id} className="relative">
              <div className="absolute top-2 left-2 z-10">
                <span className="badge border-transparent text-xs" style={{ backgroundColor: COLLECTION_STATUSES.find(s=>s.id===entry.status)?.color+'33', color: COLLECTION_STATUSES.find(s=>s.id===entry.status)?.color }}>
                  {COLLECTION_STATUSES.find(s=>s.id===entry.status)?.emoji}
                </span>
              </div>
              <GameCard game={entry.games} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Plus, Shuffle, LayoutGrid, List, Library, BookOpen, ListChecks } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useGames } from '../hooks/useGames'
import { useCollection, COLLECTION_STATUSES } from '../hooks/useCollection'
import GameCard from '../components/shared/GameCard'
import GameListRow from '../components/shared/GameListRow'
import GameFilters from '../components/shared/GameFilters'
import GameForm from '../components/collection/GameForm'
import GameDetail from '../components/collection/GameDetail'
import BggImport from '../components/collection/BggImport'
import GameListsPanel from '../components/collection/GameListsPanel'

export default function GamesPage() {
  const { user, profile } = useAuth()
  const [mode, setMode] = useState('catalog') // 'catalog' | 'collection' | 'lists'
  const [statusFilter, setStatusFilter] = useState('all')
  const [filters, setFilters] = useState({ search: '', players: '', maxDuration: '', category: '', mechanic: '' })
  const [showForm, setShowForm]     = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [editGame, setEditGame]     = useState(null)
  const [detailGame, setDetailGame] = useState(null)
  const [view, setView]             = useState('grid')

  const { games, loading: catalogLoading, refetch } = useGames(filters)
  const { collection, loading: collectionLoading, addToCollection, removeFromCollection, setVisibility, hasGame, getEntry } = useCollection(user?.id)

  const canEdit = !!user

  // En modo colección, partimos das entradas propias e aplicamos os mesmos filtros de xogo + estado
  const collectionGames = collection
    .filter(entry => statusFilter === 'all' || entry.status === statusFilter)
    .map(entry => ({ ...entry.games, _entry: entry }))
    .filter(g => {
      if (!g) return false
      const q = filters.search?.toLowerCase()
      if (q && !g.name?.toLowerCase().includes(q)) return false
      if (filters.players && (g.min_players > filters.players || g.max_players < filters.players)) return false
      if (filters.maxDuration && g.min_duration > filters.maxDuration) return false
      if (filters.category && !g.category_ids?.includes(Number(filters.category))) return false
      if (filters.mechanic && !g.mechanic_ids?.includes(Number(filters.mechanic))) return false
      return true
    })
    .sort((a, b) => a.name?.localeCompare(b.name, 'gl') || 0)

  const displayedGames = mode === 'catalog' ? games : collectionGames
  const loading = mode === 'catalog' ? catalogLoading : collectionLoading

  function pickRandom() {
    if (!displayedGames.length) return
    const g = displayedGames[Math.floor(Math.random() * displayedGames.length)]
    setDetailGame(g)
  }

  async function handleSetStatus(game, statusId) {
    if (!user) { alert('Necesitas iniciar sesión para xestionar a túa colección'); return }
    if (statusId === null) await removeFromCollection(game.id)
    else await addToCollection(game.id, statusId, profile?.collection_visibility)
  }

  async function handleSetVisibility(game, visibility) {
    await setVisibility(game.id, visibility)
  }

  function handleEdit(game) {
    setDetailGame(null)
    setEditGame(game)
    setShowForm(true)
  }

  const countByStatus = (s) => collection.filter(e => e.status === s).length

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="section-title">Xogos</h1>
          <p className="section-subtitle">
            {mode === 'catalog' ? `${games.length} xogos no catálogo` : mode === 'collection' ? `${collection.length} na túa colección` : 'Listas persoais'}
          </p>
        </div>
        {mode !== 'lists' && (
          <div className="flex gap-2 items-center flex-wrap">
            <div className="flex rounded-lg overflow-hidden border border-xogun-border">
              <button onClick={() => setView('grid')} className={`p-2 transition-colors ${view === 'grid' ? 'bg-xogun-accent text-xogun-bg' : 'bg-xogun-card text-xogun-muted hover:text-xogun-text'}`}>
                <LayoutGrid size={15} />
              </button>
              <button onClick={() => setView('list')} className={`p-2 transition-colors ${view === 'list' ? 'bg-xogun-accent text-xogun-bg' : 'bg-xogun-card text-xogun-muted hover:text-xogun-text'}`}>
                <List size={15} />
              </button>
            </div>
            <button onClick={pickRandom} className="btn-ghost flex items-center gap-1.5 text-xs">
              <Shuffle size={13} /> Aleatorio
            </button>
            {user && <button onClick={() => setShowImport(true)} className="btn-secondary text-xs">Importar BGG</button>}
            <button onClick={() => { setEditGame(null); setShowForm(true) }} className="btn-primary flex items-center gap-1.5 text-xs">
              <Plus size={13} /> Engadir xogo
            </button>
          </div>
        )}
      </div>

      {/* Mode selector */}
      {user && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <button onClick={() => { setMode('catalog'); setStatusFilter('all') }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'catalog' ? 'bg-xogun-accent text-xogun-bg' : 'bg-xogun-card border border-xogun-border text-xogun-muted hover:text-xogun-text'}`}>
            <Library size={14} /> Todo o catálogo
          </button>
          <button onClick={() => setMode('collection')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'collection' ? 'bg-xogun-accent text-xogun-bg' : 'bg-xogun-card border border-xogun-border text-xogun-muted hover:text-xogun-text'}`}>
            <BookOpen size={14} /> A miña colección
          </button>
          <button onClick={() => setMode('lists')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'lists' ? 'bg-xogun-accent text-xogun-bg' : 'bg-xogun-card border border-xogun-border text-xogun-muted hover:text-xogun-text'}`}>
            <ListChecks size={14} /> As miñas listas
          </button>
        </div>
      )}

      {mode === 'lists' ? (
        <GameListsPanel userId={user.id} />
      ) : (
        <>
          {/* Status filter (only in collection mode) */}
          {mode === 'collection' && (
            <div className="flex gap-2 flex-wrap mb-4">
              <button onClick={() => setStatusFilter('all')}
                className={`badge transition-colors ${statusFilter === 'all' ? 'border-xogun-accent text-xogun-accent bg-xogun-accent/10' : 'border-xogun-border text-xogun-muted hover:border-xogun-accent'}`}>
                Todos ({collection.length})
              </button>
              {COLLECTION_STATUSES.map(s => (
                <button key={s.id} onClick={() => setStatusFilter(s.id)}
                  className={`badge transition-colors ${statusFilter === s.id ? 'border-xogun-accent text-xogun-accent bg-xogun-accent/10' : 'border-xogun-border text-xogun-muted hover:border-xogun-accent'}`}>
                  {s.emoji} {s.label} ({countByStatus(s.id)})
                </button>
              ))}
            </div>
          )}

          <GameFilters filters={filters} onChange={setFilters} />

          {loading ? (
            <div className="text-center text-xogun-muted py-20">Cargando...</div>
          ) : displayedGames.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xogun-muted mb-3">
                {mode === 'collection' && collection.length === 0
                  ? 'A túa colección está baleira. Cambia a "Todo o catálogo" para engadir xogos.'
                  : 'Non hai xogos para esa busca'}
              </p>
              {mode === 'catalog' && (
                <button onClick={() => { setEditGame(null); setShowForm(true) }} className="btn-primary">Engadir o primeiro xogo</button>
              )}
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {displayedGames.map(game => (
                <GameCard key={game.id} game={game}
                  userEntry={hasGame(game.id) ? getEntry(game.id) : null}
                  onSetStatus={handleSetStatus}
                  onSetVisibility={handleSetVisibility}
                  onEdit={handleEdit}
                  onOpenDetail={setDetailGame}
                  canEdit={canEdit} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {displayedGames.map(game => (
                <GameListRow key={game.id} game={game}
                  userEntry={hasGame(game.id) ? getEntry(game.id) : null}
                  onSetStatus={handleSetStatus}
                  onSetVisibility={handleSetVisibility}
                  onEdit={handleEdit}
                  onClick={setDetailGame}
                  canEdit={canEdit} />
              ))}
            </div>
          )}
        </>
      )}

      {detailGame && (
        <GameDetail game={detailGame} onClose={() => setDetailGame(null)} onEdit={handleEdit} canEdit={canEdit} />
      )}

      {showForm && (
        <GameForm
          game={editGame}
          onClose={() => { setShowForm(false); setEditGame(null) }}
          onSaved={refetch}
        />
      )}
      {showImport && <BggImport onClose={() => setShowImport(false)} onImported={refetch} userId={user?.id} />}
    </div>
  )
}

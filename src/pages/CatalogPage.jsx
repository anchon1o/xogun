import { useState } from 'react'
import { Plus, Shuffle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useGames } from '../hooks/useGames'
import { useCollection } from '../hooks/useCollection'
import GameCard from '../components/shared/GameCard'
import GameFilters from '../components/shared/GameFilters'
import GameForm from '../components/collection/GameForm'
import BggImport from '../components/collection/BggImport'

export default function CatalogPage() {
  const { user } = useAuth()
  const [filters, setFilters] = useState({ search: '', players: '', maxDuration: '', category: '', mechanic: '' })
  const [showForm, setShowForm]     = useState(false)
  const [showImport, setShowImport] = useState(false)
  const { games, loading, refetch } = useGames(filters)
  const { collection, addToCollection, hasGame } = useCollection(user?.id)

  function pickRandom() {
    if (!games.length) return
    const g = games[Math.floor(Math.random() * games.length)]
    alert(`🎲 Xogo aleatorio: ${g.name}`)
  }

  async function handleAddToCollection(game) {
    if (!user) { alert('Necesitas iniciar sesión para engadir xogos á túa colección'); return }
    await addToCollection(game.id, 'owned')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Catálogo de xogos</h1>
          <p className="section-subtitle">{games.length} xogos dispoñibles</p>
        </div>
        <div className="flex gap-2">
          <button onClick={pickRandom} className="btn-ghost flex items-center gap-1.5 text-xs">
            <Shuffle size={13} /> Aleatorio
          </button>
          {user && <button onClick={() => setShowImport(true)} className="btn-secondary text-xs">Importar BGG</button>}
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-1.5 text-xs">
            <Plus size={13} /> Engadir xogo
          </button>
        </div>
      </div>

      <GameFilters filters={filters} onChange={setFilters} />

      {loading ? (
        <div className="text-center text-xogun-muted py-20">Cargando catálogo...</div>
      ) : games.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xogun-muted mb-3">Non hai xogos para esa busca</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Engadir o primeiro xogo</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {games.map(game => (
            <GameCard key={game.id} game={game}
              userEntry={hasGame(game.id) ? collection.find(x => x.game_id === game.id) : null}
              onAddToCollection={handleAddToCollection} />
          ))}
        </div>
      )}

      {showForm && <GameForm onClose={() => setShowForm(false)} onSaved={refetch} />}
      {showImport && <BggImport onClose={() => setShowImport(false)} onImported={refetch} userId={user?.id} />}
    </div>
  )
}

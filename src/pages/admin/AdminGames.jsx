import { usePendingGames } from '../../hooks/useGames'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { CheckCircle, XCircle } from 'lucide-react'

export default function AdminGames() {
  const { user } = useAuth()
  const { games, loading, refetch } = usePendingGames()

  async function approve(game) {
    await supabase.from('games').update({ approved: true, approved_by: user.id, approved_at: new Date().toISOString() }).eq('id', game.id)
    refetch()
  }
  async function reject(game) {
    if (!confirm(`Rexeitar e eliminar "${game.name}"?`)) return
    await supabase.from('games').delete().eq('id', game.id)
    refetch()
  }

  return (
    <div>
      <h2 className="font-display text-xl text-xogun-accent mb-5">Xogos pendentes de aprobación</h2>
      {loading ? <p className="text-xogun-muted text-sm">Cargando...</p> :
        games.length === 0 ? <p className="text-xogun-muted text-sm">Non hai xogos pendentes. ✅</p> : (
          <div className="space-y-3">
            {games.map(g => (
              <div key={g.id} className="card flex items-start gap-4">
                {g.images?.[0] && <img src={g.images[0]} alt={g.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{g.name}</p>
                  {g.year_published && <p className="text-xogun-muted text-xs">{g.year_published}</p>}
                  <p className="text-xogun-muted text-xs mt-1">Engadido por: {g.profiles?.display_name || 'Descoñecido'}</p>
                  {g.description && <p className="text-xogun-muted text-xs mt-1 line-clamp-2">{g.description}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => approve(g)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors">
                    <CheckCircle size={13} /> Aprobar
                  </button>
                  <button onClick={() => reject(g)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-xogun-red/30 text-xogun-red hover:bg-xogun-red/10 transition-colors">
                    <XCircle size={13} /> Rexeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}

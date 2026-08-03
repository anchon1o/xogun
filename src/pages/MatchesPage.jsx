import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useMatches } from '../hooks/useMatches'
import { exportMatchesToCSV } from '../lib/exportMatches'
import { Plus, Calendar, Clock, Trophy, Users, Download } from 'lucide-react'

export default function MatchesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { matches, loading, deleteMatch } = useMatches(user?.id)
  const [activeTab, setActiveTab] = useState('finished')

  const filtered = matches.filter(m => {
    if (activeTab === 'planned')  return m.status === 'planned'
    if (activeTab === 'finished') return m.status === 'finished'
    return true
  })

  function handleExport() {
    exportMatchesToCSV(filtered, `xogun-partidas-${activeTab}.csv`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div>
          <h1 className="section-title">Historial de partidas</h1>
          <p className="section-subtitle">{matches.length} partidas rexistradas</p>
        </div>
        <div className="flex gap-2">
          {filtered.length > 0 && (
            <button onClick={handleExport} className="btn-secondary flex items-center gap-1.5 text-xs">
              <Download size={13} /> Exportar CSV
            </button>
          )}
          <button onClick={() => navigate('/ferramentas')} className="btn-primary flex items-center gap-1.5 text-xs">
            <Plus size={13} /> Nova partida
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 border-b border-xogun-border">
        {[['finished','Xogadas'],['planned','Planificadas'],['all','Todas']].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === id ? 'border-xogun-accent text-xogun-accent' : 'border-transparent text-xogun-muted hover:text-xogun-text'}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-xogun-muted py-20">Cargando partidas...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xogun-muted mb-3">Non hai partidas rexistradas aínda.</p>
          <button onClick={() => navigate('/ferramentas')} className="btn-primary">Ir ao Marcador</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(match => (
            <div key={match.id} className="card hover:border-xogun-accent/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">{match.game_name || match.games?.name || 'Sen xogo'}</h3>
                  <div className="flex gap-3 text-xogun-muted text-xs mt-1 flex-wrap">
                    {match.planned_at && (
                      <span className="flex items-center gap-1"><Calendar size={10} />{new Date(match.planned_at).toLocaleDateString('gl')}</span>
                    )}
                    {match.finished_at && !match.planned_at && (
                      <span className="flex items-center gap-1"><Calendar size={10} />{new Date(match.finished_at).toLocaleDateString('gl')}</span>
                    )}
                    {match.duration_mins && (
                      <span className="flex items-center gap-1"><Clock size={10} />{match.duration_mins} min</span>
                    )}
                    {match.match_players?.length > 0 && (
                      <span className="flex items-center gap-1"><Users size={10} />{match.match_players.length} xogadores</span>
                    )}
                  </div>
                  {match.match_players?.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {[...match.match_players]
                        .sort((a, b) => (b.score?.total || 0) - (a.score?.total || 0))
                        .map(p => (
                        <span key={p.id} className="text-xs px-2 py-0.5 rounded-full border flex items-center gap-1"
                          style={{ borderColor: p.player_color + '66', color: p.player_color }}>
                          {p.profiles?.display_name || p.guest_name || 'Convidado'}
                          {typeof p.score?.total === 'number' && <span className="font-display font-bold">{p.score.total}</span>}
                          {p.winner && '🏆'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className={`badge flex-shrink-0 ${match.status === 'finished' ? 'border-green-500/30 text-green-400' : match.status === 'planned' ? 'border-xogun-accent/30 text-xogun-accent' : 'border-xogun-border text-xogun-muted'}`}>
                  {match.status === 'finished' ? 'Rematada' : match.status === 'planned' ? 'Planificada' : 'En curso'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

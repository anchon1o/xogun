import { useState } from 'react'
import { Plus, Minus, Trash2, RotateCcw } from 'lucide-react'
import { useGameSession } from '../../contexts/GameSessionContext'

const RESOURCE_ICONS = ['💰', '🌾', '🪵', '🧱', '🐑', '⭐', '⚡', '💎', '🔧', '📦']
const PLAYER_COLORS = ['#c8a96e','#6e8dc8','#6ec87e','#c86e6e','#c86ec8','#6ec8c8','#c8b46e','#8e6ec8']

function playersFromSession(sessionPlayers) {
  return sessionPlayers.map(p => ({ id: p.id, name: p.name, color: p.color }))
}

export default function ResourceBankWidget() {
  const session = useGameSession()
  const hasSession = session?.hasActiveSession

  const [players] = useState(() =>
    hasSession
      ? playersFromSession(session.players)
      : [
          { id: 'p1', name: 'Xogador 1', color: PLAYER_COLORS[0] },
          { id: 'p2', name: 'Xogador 2', color: PLAYER_COLORS[1] },
        ]
  )

  const [resources, setResources] = useState([
    { id: 'r1', name: 'Moedas', icon: '💰' },
  ])
  const [counts, setCounts] = useState({})
  const [showAddResource, setShowAddResource] = useState(false)
  const [newResourceName, setNewResourceName] = useState('')
  const [newResourceIcon, setNewResourceIcon] = useState('💰')

  function getCount(playerId, resourceId) {
    return counts[playerId]?.[resourceId] ?? 0
  }

  function adjust(playerId, resourceId, delta) {
    setCounts(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [resourceId]: Math.max(0, getCount(playerId, resourceId) + delta),
      },
    }))
  }

  function addResource() {
    if (!newResourceName.trim()) return
    setResources(r => [...r, { id: crypto.randomUUID(), name: newResourceName.trim(), icon: newResourceIcon }])
    setNewResourceName('')
    setShowAddResource(false)
  }

  function removeResource(id) {
    setResources(r => r.filter(x => x.id !== id))
  }

  function resetAll() {
    if (!confirm('Reiniciar todos os recursos a cero?')) return
    setCounts({})
  }

  return (
    <div className="space-y-4">
      {hasSession && (
        <p className="text-xogun-muted text-xs -mt-1">
          Usando xogadores da sesión activa {session.game ? `· ${session.game.name}` : ''}
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {resources.map(res => (
          <div key={res.id} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-xogun-surface border border-xogun-border group">
            <span>{res.icon}</span>
            <span className="text-xs text-xogun-text">{res.name}</span>
            {resources.length > 1 && (
              <button onClick={() => removeResource(res.id)} className="text-xogun-muted hover:text-xogun-red opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={10} />
              </button>
            )}
          </div>
        ))}
        <button onClick={() => setShowAddResource(s => !s)} className="btn-ghost flex items-center gap-1 text-xs">
          <Plus size={12} /> Recurso
        </button>
      </div>

      {showAddResource && (
        <div className="card flex items-center gap-2 animate-fade-in">
          <select className="input w-20" value={newResourceIcon} onChange={e => setNewResourceIcon(e.target.value)}>
            {RESOURCE_ICONS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <input className="input flex-1" placeholder="Nome do recurso" value={newResourceName}
            onChange={e => setNewResourceName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addResource()} />
          <button onClick={addResource} className="btn-primary text-xs px-3">Engadir</button>
        </div>
      )}

      <div className="space-y-3">
        {players.map(p => (
          <div key={p.id} className="card">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
              <span className="text-sm font-medium">{p.name}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {resources.map(res => (
                <div key={res.id} className="flex items-center gap-1.5 bg-xogun-surface rounded-lg px-2 py-1.5">
                  <span className="text-sm">{res.icon}</span>
                  <button onClick={() => adjust(p.id, res.id, -1)} className="w-6 h-6 rounded flex items-center justify-center text-xogun-muted hover:text-xogun-text hover:bg-xogun-card transition-colors">
                    <Minus size={12} />
                  </button>
                  <span className="font-display text-base font-bold w-6 text-center" style={{ color: p.color }}>
                    {getCount(p.id, res.id)}
                  </span>
                  <button onClick={() => adjust(p.id, res.id, 1)} className="w-6 h-6 rounded flex items-center justify-center text-xogun-muted hover:text-xogun-text hover:bg-xogun-card transition-colors">
                    <Plus size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={resetAll} className="btn-secondary flex items-center gap-1.5 text-xs">
        <RotateCcw size={12} /> Reiniciar todo
      </button>
    </div>
  )
}

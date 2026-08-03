import { useState } from 'react'
import { Plus, Trash2, Check, RotateCcw } from 'lucide-react'
import { useGameSession } from '../../contexts/GameSessionContext'

const PLAYER_COLORS = ['#c8a96e','#6e8dc8','#6ec87e','#c86e6e','#c86ec8','#6ec8c8','#c8b46e','#8e6ec8']

function playersFromSession(sessionPlayers) {
  return sessionPlayers.map(p => ({ id: p.id, name: p.name, color: p.color }))
}

export default function ObjectiveCounterWidget() {
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

  const [objectives, setObjectives] = useState([])
  const [newObjective, setNewObjective] = useState('')
  const [completed, setCompleted] = useState({})

  function addObjective() {
    if (!newObjective.trim()) return
    setObjectives(o => [...o, { id: crypto.randomUUID(), name: newObjective.trim() }])
    setNewObjective('')
  }

  function removeObjective(id) {
    setObjectives(o => o.filter(x => x.id !== id))
    setCompleted(c => {
      const next = { ...c }
      Object.keys(next).forEach(pid => { next[pid] = (next[pid] || []).filter(oid => oid !== id) })
      return next
    })
  }

  function toggle(playerId, objectiveId) {
    setCompleted(prev => {
      const current = prev[playerId] || []
      const has = current.includes(objectiveId)
      return { ...prev, [playerId]: has ? current.filter(id => id !== objectiveId) : [...current, objectiveId] }
    })
  }

  function isDone(playerId, objectiveId) {
    return (completed[playerId] || []).includes(objectiveId)
  }

  function scoreFor(playerId) {
    return (completed[playerId] || []).length
  }

  function resetAll() {
    if (!confirm('Reiniciar todos os obxectivos completados?')) return
    setCompleted({})
  }

  return (
    <div className="space-y-4">
      {hasSession && (
        <p className="text-xogun-muted text-xs -mt-1">
          Usando xogadores da sesión activa {session.game ? `· ${session.game.name}` : ''}
        </p>
      )}

      <div className="flex gap-2">
        <input className="input flex-1" placeholder="Novo obxectivo/misión..." value={newObjective}
          onChange={e => setNewObjective(e.target.value)} onKeyDown={e => e.key === 'Enter' && addObjective()} />
        <button onClick={addObjective} className="btn-secondary px-3"><Plus size={14} /></button>
      </div>

      {objectives.length === 0 ? (
        <p className="text-xogun-muted text-sm text-center py-6">Engade obxectivos para comezar a marcalos por xogador.</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {[...players].sort((a, b) => scoreFor(b.id) - scoreFor(a.id)).map(p => (
              <div key={p.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-xogun-surface border border-xogun-border">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-xs">{p.name}</span>
                <span className="text-xs font-bold" style={{ color: p.color }}>{scoreFor(p.id)}/{objectives.length}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            {objectives.map(obj => (
              <div key={obj.id} className="card flex items-center gap-2 py-2">
                <span className="text-sm flex-1 min-w-0 truncate">{obj.name}</span>
                <div className="flex gap-1.5 flex-wrap">
                  {players.map(p => {
                    const done = isDone(p.id, obj.id)
                    return (
                      <button key={p.id} onClick={() => toggle(p.id, obj.id)}
                        title={p.name}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${done ? 'border-transparent' : 'border-xogun-border bg-xogun-surface'}`}
                        style={done ? { backgroundColor: p.color, color: '#181206' } : {}}>
                        {done ? <Check size={13} /> : <span className="text-[9px] text-xogun-muted">{p.name[0]}</span>}
                      </button>
                    )
                  })}
                </div>
                <button onClick={() => removeObjective(obj.id)} className="text-xogun-muted hover:text-xogun-red flex-shrink-0"><Trash2 size={13} /></button>
              </div>
            ))}
          </div>

          <button onClick={resetAll} className="btn-secondary flex items-center gap-1.5 text-xs">
            <RotateCcw size={12} /> Reiniciar marcados
          </button>
        </>
      )}
    </div>
  )
}

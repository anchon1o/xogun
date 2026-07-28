import { useState, useEffect } from 'react'
import { Plus, Trash2, RotateCcw, Trophy } from 'lucide-react'
import { useGameSession } from '../../contexts/GameSessionContext'

const COLORS = ['#c8a96e','#6e8dc8','#6ec87e','#c86e6e','#c86ec8','#6ec8c8','#c8b46e','#8e6ec8']

function playersFromSession(sessionPlayers) {
  return sessionPlayers.map(p => ({ id: p.id, name: p.name, scores: [], color: p.color }))
}

export default function ScoreWidget() {
  const session = useGameSession()
  const hasSession = session?.hasActiveSession

  const [players, setPlayers] = useState(() =>
    hasSession
      ? playersFromSession(session.players)
      : [
          { id: 'p1', name: 'Xogador 1', scores: [], color: COLORS[0] },
          { id: 'p2', name: 'Xogador 2', scores: [], color: COLORS[1] },
        ]
  )
  const [inputs, setInputs] = useState({})

  // Se a sesión compartida cambia (novo xogo/xogadores), reiniciamos o marcador
  useEffect(() => {
    if (hasSession) setPlayers(playersFromSession(session.players))
  }, [session?.players])

  function addPlayer() {
    const id = crypto.randomUUID()
    setPlayers(p => [...p, { id, name: `Xogador ${p.length + 1}`, scores: [], color: COLORS[p.length % COLORS.length] }])
  }
  function removePlayer(id) { setPlayers(p => p.filter(x => x.id !== id)) }
  function updateName(id, name) { setPlayers(p => p.map(x => x.id === id ? { ...x, name } : x)) }
  function addScore(id) {
    const val = parseInt(inputs[id] || '0')
    if (isNaN(val)) return
    setPlayers(p => p.map(x => x.id === id ? { ...x, scores: [...x.scores, val] } : x))
    setInputs(i => ({ ...i, [id]: '' }))
  }
  function undoScore(id) { setPlayers(p => p.map(x => x.id === id ? { ...x, scores: x.scores.slice(0, -1) } : x)) }
  function reset() { if (!confirm('Reiniciar todas as puntuacións?')) return; setPlayers(p => p.map(x => ({ ...x, scores: [] }))) }

  const totals = players.map(p => ({ ...p, total: p.scores.reduce((a, b) => a + b, 0) }))
  const maxScore = Math.max(...totals.map(p => p.total), 1)
  const sorted = [...totals].sort((a, b) => b.total - a.total)

  return (
    <div className="space-y-4">
      {hasSession && (
        <p className="text-xogun-muted text-xs -mt-1">
          Usando xogadores da sesión activa {session.game ? `· ${session.game.name}` : ''}
        </p>
      )}

      {/* Ranking bars */}
      {totals.some(p => p.total !== 0) && (
        <div className="space-y-2">
          {sorted.map((p, i) => (
            <div key={p.id} className="flex items-center gap-2">
              <span className="text-xogun-muted text-xs w-4 text-right">{i + 1}</span>
              <div className="flex-1 h-8 bg-xogun-surface rounded-lg overflow-hidden relative">
                <div className="h-full rounded-lg transition-all duration-500"
                  style={{ width: `${(p.total / maxScore) * 100}%`, backgroundColor: p.color + '33', borderLeft: `3px solid ${p.color}` }} />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium truncate max-w-[60%]">{p.name}</span>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-display text-base font-bold" style={{ color: p.color }}>{p.total}</span>
              </div>
              {i === 0 && totals.length > 1 && <Trophy size={14} className="text-xogun-accent flex-shrink-0" />}
            </div>
          ))}
        </div>
      )}

      {/* Score inputs */}
      <div className="space-y-2">
        {players.map(p => {
          const total = totals.find(x => x.id === p.id)?.total || 0
          return (
            <div key={p.id} className="flex items-center gap-2 p-2 rounded-xl border border-xogun-border bg-xogun-surface">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
              <input className="bg-transparent text-sm font-medium flex-1 min-w-0 outline-none border-b border-transparent focus:border-xogun-accent text-xogun-text"
                value={p.name} onChange={e => updateName(p.id, e.target.value)} />
              <span className="font-display text-lg font-bold flex-shrink-0" style={{ color: p.color }}>{total}</span>
              <input type="number" placeholder="+/-"
                className="w-16 text-center text-sm bg-xogun-card border border-xogun-border rounded-lg px-2 py-1 text-xogun-text outline-none focus:border-xogun-accent"
                value={inputs[p.id] || ''}
                onChange={e => setInputs(i => ({ ...i, [p.id]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addScore(p.id)} />
              <button onClick={() => addScore(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-xogun-bg text-sm font-bold flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}99)` }}>+</button>
              <button onClick={() => undoScore(p.id)} className="text-xogun-muted hover:text-xogun-text transition-colors text-xs px-1" title="Desfacer">↩</button>
              <button onClick={() => removePlayer(p.id)} className="text-xogun-muted hover:text-xogun-red transition-colors"><Trash2 size={13} /></button>
            </div>
          )
        })}
      </div>

      {/* Rondas */}
      {players.some(p => p.scores.length > 0) && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-xogun-border">
                <th className="text-left py-1 pr-2 text-xogun-muted font-medium">Rolda</th>
                {players.map(p => <th key={p.id} className="text-center px-1 text-xogun-muted font-medium" style={{ color: p.color }}>{p.name.split(' ')[0]}</th>)}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.max(...players.map(p => p.scores.length)) }, (_, i) => (
                <tr key={i} className="border-b border-xogun-border/30">
                  <td className="py-1 pr-2 text-xogun-muted">R{i + 1}</td>
                  {players.map(p => <td key={p.id} className="text-center px-1 text-xogun-text">{p.scores[i] ?? '—'}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button onClick={addPlayer} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5"><Plus size={12} /> Xogador</button>
        <button onClick={reset} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5 ml-auto"><RotateCcw size={12} /> Reiniciar</button>
      </div>
    </div>
  )
}

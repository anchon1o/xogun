import { useState } from 'react'
import { Shuffle, Plus, Trash2, EyeOff, RotateCcw } from 'lucide-react'
import { useGameSession } from '../../contexts/GameSessionContext'

const PLAYER_COLORS = ['#c8a96e','#6e8dc8','#6ec87e','#c86e6e','#c86ec8','#6ec8c8','#c8b46e','#8e6ec8']

const PRESETS = [
  { name: 'Impostor clásico', roles: ['Impostor', 'Tripulante', 'Tripulante', 'Tripulante', 'Tripulante'] },
  { name: 'Resistencia', roles: ['Espía', 'Espía', 'Resistencia', 'Resistencia', 'Resistencia'] },
  { name: 'Bo/Malo', roles: ['Bo', 'Malo'] },
]

function playersFromSession(sessionPlayers) {
  return sessionPlayers.map(p => ({ id: p.id, name: p.name, color: p.color }))
}

export default function RoleDealerWidget() {
  const session = useGameSession()
  const hasSession = session?.hasActiveSession

  const [localNames, setLocalNames] = useState(['', ''])
  const [roles, setRoles] = useState([''])
  const [assignments, setAssignments] = useState(null)
  const [revealed, setRevealed] = useState({})

  const players = hasSession
    ? playersFromSession(session.players)
    : localNames.filter(n => n.trim()).map((n, i) => ({ id: `l${i}`, name: n, color: PLAYER_COLORS[i % PLAYER_COLORS.length] }))

  function addPlayerSlot() { setLocalNames(n => [...n, '']) }
  function removePlayerSlot(i) { setLocalNames(n => n.filter((_, j) => j !== i)) }
  function updatePlayerSlot(i, val) { setLocalNames(n => n.map((x, j) => j === i ? val : x)) }

  function addRoleSlot() { setRoles(r => [...r, '']) }
  function removeRoleSlot(i) { setRoles(r => r.filter((_, j) => j !== i)) }
  function updateRoleSlot(i, val) { setRoles(r => r.map((x, j) => j === i ? val : x)) }

  function applyPreset(preset) { setRoles(preset.roles) }

  function deal() {
    const validRoles = roles.filter(r => r.trim())
    if (players.length < 2 || validRoles.length === 0) return
    const pool = []
    while (pool.length < players.length) pool.push(...validRoles)
    const trimmed = pool.slice(0, players.length).sort(() => Math.random() - 0.5)
    const result = {}
    players.forEach((p, i) => { result[p.id] = trimmed[i] })
    setAssignments(result)
    setRevealed({})
  }

  function toggleReveal(playerId) {
    setRevealed(r => ({ ...r, [playerId]: !r[playerId] }))
  }

  function reset() {
    setAssignments(null)
    setRevealed({})
  }

  if (!assignments) {
    return (
      <div className="space-y-5">
        {hasSession ? (
          <p className="text-xogun-muted text-xs">
            Usando xogadores da sesión activa {session.game ? `· ${session.game.name}` : ''}
          </p>
        ) : (
          <div className="space-y-2 max-w-xs">
            <label className="label">Xogadores</label>
            {localNames.map((n, i) => (
              <div key={i} className="flex gap-2">
                <input className="input flex-1" placeholder={`Xogador ${i + 1}`} value={n} onChange={e => updatePlayerSlot(i, e.target.value)} />
                {localNames.length > 2 && (
                  <button onClick={() => removePlayerSlot(i)} className="text-xogun-muted hover:text-xogun-red px-2"><Trash2 size={13} /></button>
                )}
              </div>
            ))}
            <button onClick={addPlayerSlot} className="btn-ghost flex items-center gap-1.5 text-xs">
              <Plus size={12} /> Engadir xogador
            </button>
          </div>
        )}

        <div>
          <label className="label">Preset rápido</label>
          <div className="flex gap-2 flex-wrap">
            {PRESETS.map(p => (
              <button key={p.name} onClick={() => applyPreset(p)} className="btn-secondary text-xs">{p.name}</button>
            ))}
          </div>
        </div>

        <div className="max-w-xs space-y-2">
          <label className="label">Roles a repartir</label>
          {roles.map((r, i) => (
            <div key={i} className="flex gap-2">
              <input className="input flex-1" placeholder="Nome do rol..." value={r} onChange={e => updateRoleSlot(i, e.target.value)} />
              {roles.length > 1 && (
                <button onClick={() => removeRoleSlot(i)} className="text-xogun-muted hover:text-xogun-red px-2"><Trash2 size={13} /></button>
              )}
            </div>
          ))}
          <button onClick={addRoleSlot} className="btn-ghost flex items-center gap-1.5 text-xs">
            <Plus size={12} /> Engadir rol
          </button>
          <p className="text-xogun-muted text-[11px]">Se hai menos roles que xogadores, repítense para completar.</p>
        </div>

        <button onClick={deal} disabled={players.length < 2 || roles.every(r => !r.trim())}
          className="btn-primary flex items-center gap-2 disabled:opacity-50">
          <Shuffle size={15} /> Repartir roles
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-xogun-muted text-xs">Cada xogador debe premer no seu nome para ver o seu rol en privado.</p>
      <div className="space-y-2">
        {players.map(p => (
          <button key={p.id} onClick={() => toggleReveal(p.id)}
            className="w-full card flex items-center gap-3 text-left hover:border-xogun-accent/50 transition-colors">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
            <span className="text-sm font-medium flex-1">{p.name}</span>
            {revealed[p.id] ? (
              <span className="font-display text-sm text-xogun-accent">{assignments[p.id]}</span>
            ) : (
              <EyeOff size={14} className="text-xogun-muted" />
            )}
          </button>
        ))}
      </div>
      <button onClick={reset} className="btn-secondary flex items-center gap-1.5 text-xs">
        <RotateCcw size={12} /> Novo repartimento
      </button>
    </div>
  )
}

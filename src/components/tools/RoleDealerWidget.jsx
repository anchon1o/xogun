import { useState } from 'react'
import { Shuffle, Plus, Trash2, EyeOff, RotateCcw, Sparkles } from 'lucide-react'
import { useGameSession } from '../../contexts/GameSessionContext'

const PLAYER_COLORS = ['#c8a96e','#6e8dc8','#6ec87e','#c86e6e','#c86ec8','#6ec8c8','#c8b46e','#8e6ec8']

const PRESETS = [
  { name: 'Impostor clásico', type: 'roles', roles: ['Impostor', 'Tripulante', 'Tripulante', 'Tripulante', 'Tripulante'] },
  { name: 'Resistencia', type: 'roles', roles: ['Espía', 'Espía', 'Resistencia', 'Resistencia', 'Resistencia'] },
  { name: 'Bo/Malo', type: 'roles', roles: ['Bo', 'Malo'] },
  { name: 'Mentiroso (1 impostor)', type: 'word' },
]

// Palabras neutras, doadas de describir sen dicilas directamente
const WORD_BANK = [
  'Praia', 'Montaña', 'Piano', 'Elefante', 'Chocolate', 'Bicicleta', 'Paraugas',
  'Faro', 'Castelo', 'Violín', 'Cabalo', 'Pirata', 'Dragón', 'Bruxa', 'Robot',
  'Xeado', 'Pizza', 'Foguete', 'Illa', 'Bosque', 'Volcán', 'Circo', 'Tren',
  'Avión', 'Globo', 'Camelo', 'Pingüín', 'Sereo', 'Cabaleiro', 'Muíño',
]

function playersFromSession(sessionPlayers) {
  return sessionPlayers.map(p => ({ id: p.id, name: p.name, color: p.color }))
}

export default function RoleDealerWidget() {
  const session = useGameSession()
  const hasSession = session?.hasActiveSession

  const [localNames, setLocalNames] = useState(['', ''])
  const [roles, setRoles] = useState([''])
  const [mode, setMode] = useState('roles') // 'roles' | 'word'
  const [customWords, setCustomWords] = useState('')
  const [assignments, setAssignments] = useState(null)
  const [impostorId, setImpostorId] = useState(null)
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

  function applyPreset(preset) {
    setMode(preset.type)
    if (preset.type === 'roles') setRoles(preset.roles)
  }

  function dealRoles() {
    const validRoles = roles.filter(r => r.trim())
    if (players.length < 2 || validRoles.length === 0) return
    const pool = []
    while (pool.length < players.length) pool.push(...validRoles)
    const trimmed = pool.slice(0, players.length).sort(() => Math.random() - 0.5)
    const result = {}
    players.forEach((p, i) => { result[p.id] = trimmed[i] })
    setAssignments(result)
    setImpostorId(null)
    setRevealed({})
  }

  function dealWordGame() {
    if (players.length < 3) return
    const extraWords = customWords.split(',').map(w => w.trim()).filter(Boolean)
    const bank = extraWords.length > 0 ? extraWords : WORD_BANK
    const word = bank[Math.floor(Math.random() * bank.length)]
    const impostor = players[Math.floor(Math.random() * players.length)]
    const result = {}
    players.forEach(p => {
      result[p.id] = p.id === impostor.id
        ? '🕵️ Es o Impostor — non coñeces a palabra, tenta descubrila escoitando aos demais'
        : `🗝️ ${word}`
    })
    setAssignments(result)
    setImpostorId(impostor.id)
    setRevealed({})
  }

  function deal() { mode === 'word' ? dealWordGame() : dealRoles() }

  function toggleReveal(playerId) {
    setRevealed(r => ({ ...r, [playerId]: !r[playerId] }))
  }

  function reset() {
    setAssignments(null)
    setImpostorId(null)
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
              <button key={p.name} onClick={() => applyPreset(p)}
                className={`text-xs ${mode === p.type && (p.type === 'word' || JSON.stringify(roles) === JSON.stringify(p.roles)) ? 'btn-primary' : 'btn-secondary'}`}>
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {mode === 'word' ? (
          <div className="max-w-xs space-y-2">
            <div className="card bg-xogun-accent/5 border-xogun-accent/30 flex items-start gap-2">
              <Sparkles size={14} className="text-xogun-accent flex-shrink-0 mt-0.5" />
              <p className="text-xs text-xogun-muted">
                Repártese unha <strong>palabra secreta</strong> a todos os xogadores agás a un —o
                <strong> impostor</strong>—, que non a coñece e ten que fingir que si. Requírense polo
                menos 3 xogadores.
              </p>
            </div>
            <label className="label">Palabras personalizadas (opcional)</label>
            <input className="input" placeholder="Praia, Piano, Dragón... (separadas por comas)"
              value={customWords} onChange={e => setCustomWords(e.target.value)} />
            <p className="text-xogun-muted text-[11px]">Se o deixas baleiro, úsase un banco de palabras xa incluído.</p>
          </div>
        ) : (
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
        )}

        <button onClick={deal}
          disabled={mode === 'word' ? players.length < 3 : (players.length < 2 || roles.every(r => !r.trim()))}
          className="btn-primary flex items-center gap-2 disabled:opacity-50">
          <Shuffle size={15} /> Repartir {mode === 'word' ? 'palabra' : 'roles'}
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
              <span className="font-display text-sm text-xogun-accent text-right max-w-[60%]">{assignments[p.id]}</span>
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

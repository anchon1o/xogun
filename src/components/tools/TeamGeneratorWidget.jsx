import { useState, useEffect } from 'react'
import { Shuffle, Users2, Plus, Trash2, Scale } from 'lucide-react'
import { useGameSession } from '../../contexts/GameSessionContext'
import { useAuth } from '../../contexts/AuthContext'
import { useMatches } from '../../hooks/useMatches'

const TEAM_COLORS = ['#c8a96e', '#6e8dc8', '#6ec87e', '#c86e6e']
const TEAM_NAMES = ['Equipo Dourado', 'Equipo Azul', 'Equipo Verde', 'Equipo Vermello']

function playersFromSession(sessionPlayers) {
  return sessionPlayers.map(p => ({ id: p.id, name: p.name }))
}

// Reparto tipo "serpe" para equilibrar por puntuación (o mellor vai ao equipo
// que menos puntuación total teña ata agora), evitando que os máis gañadores
// queden todos xuntos.
function balancedSplit(players, numTeams) {
  const sorted = [...players].sort((a, b) => (b.wins || 0) - (a.wins || 0))
  const teams = Array.from({ length: numTeams }, () => ({ players: [], totalWins: 0 }))
  sorted.forEach(p => {
    const target = teams.reduce((min, t, i) => t.totalWins < teams[min].totalWins ? i : min, 0)
    teams[target].players.push(p)
    teams[target].totalWins += (p.wins || 0)
  })
  return teams.map(t => t.players)
}

export default function TeamGeneratorWidget() {
  const { user } = useAuth()
  const session = useGameSession()
  const hasSession = session?.hasActiveSession
  const { matches } = useMatches(user?.id)

  const [localNames, setLocalNames] = useState(['', '', '', ''])
  const [numTeams, setNumTeams] = useState(2)
  const [teams, setTeams] = useState(null)
  const [mode, setMode] = useState('random') // 'random' | 'balanced'

  const basePlayers = hasSession
    ? playersFromSession(session.players)
    : localNames.filter(n => n.trim()).map((n, i) => ({ id: `l${i}`, name: n }))

  // Calcula vitorias históricas por nome de xogador (guest_name gardado nas partidas)
  const players = basePlayers.map(p => {
    let wins = 0
    matches.forEach(m => {
      const entry = m.match_players?.find(mp => mp.guest_name === p.name)
      if (entry?.winner) wins++
    })
    return { ...p, wins }
  })

  const hasHistory = players.some(p => p.wins > 0)

  function addPlayer() { setLocalNames(n => [...n, '']) }
  function removePlayer(i) { setLocalNames(n => n.filter((_, j) => j !== i)) }
  function updatePlayer(i, val) { setLocalNames(n => n.map((x, j) => j === i ? val : x)) }

  function generate() {
    if (players.length < numTeams) return
    if (mode === 'balanced') {
      setTeams(balancedSplit(players, numTeams))
    } else {
      const shuffled = [...players].sort(() => Math.random() - 0.5)
      const result = Array.from({ length: numTeams }, () => [])
      shuffled.forEach((p, i) => result[i % numTeams].push(p))
      setTeams(result)
    }
  }

  return (
    <div className="space-y-5">
      {hasSession ? (
        <p className="text-xogun-muted text-xs">
          Usando xogadores da sesión activa {session.game ? `· ${session.game.name}` : ''}
        </p>
      ) : (
        <div className="space-y-2 max-w-xs">
          {localNames.map((n, i) => (
            <div key={i} className="flex gap-2">
              <input className="input flex-1" placeholder={`Xogador ${i + 1}`} value={n} onChange={e => updatePlayer(i, e.target.value)} />
              {localNames.length > 2 && (
                <button onClick={() => removePlayer(i)} className="text-xogun-muted hover:text-xogun-red px-2"><Trash2 size={13} /></button>
              )}
            </div>
          ))}
          <button onClick={addPlayer} className="btn-ghost flex items-center gap-1.5 text-xs">
            <Plus size={12} /> Engadir xogador
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="text-xogun-muted text-xs uppercase tracking-wider">Nº de equipos</label>
        <div className="flex items-center gap-2">
          <button onClick={() => setNumTeams(n => Math.max(2, n - 1))} className="w-7 h-7 rounded-lg bg-xogun-surface border border-xogun-border text-xogun-text">−</button>
          <span className="font-display font-bold w-6 text-center">{numTeams}</span>
          <button onClick={() => setNumTeams(n => Math.min(4, n + 1))} className="w-7 h-7 rounded-lg bg-xogun-surface border border-xogun-border text-xogun-text">+</button>
        </div>
      </div>

      {user && (
        <div>
          <label className="text-xogun-muted text-xs uppercase tracking-wider block mb-1.5">Modo de reparto</label>
          <div className="flex rounded-lg overflow-hidden border border-xogun-border w-fit">
            <button onClick={() => setMode('random')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 ${mode === 'random' ? 'bg-xogun-accent text-xogun-bg' : 'text-xogun-muted hover:text-xogun-text bg-xogun-surface'}`}>
              <Shuffle size={11} /> Aleatorio
            </button>
            <button onClick={() => setMode('balanced')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 ${mode === 'balanced' ? 'bg-xogun-accent text-xogun-bg' : 'text-xogun-muted hover:text-xogun-text bg-xogun-surface'}`}>
              <Scale size={11} /> Equilibrado
            </button>
          </div>
          {mode === 'balanced' && !hasHistory && (
            <p className="text-xogun-muted text-[11px] mt-1">Sen historial de vitorias aínda para estes nomes — o reparto será igual ao aleatorio.</p>
          )}
        </div>
      )}

      <button onClick={generate} disabled={players.length < numTeams}
        className="btn-primary flex items-center gap-2 disabled:opacity-50">
        <Shuffle size={15} /> Xerar equipos
      </button>
      {players.length < numTeams && (
        <p className="text-xogun-muted text-xs">Necesitas polo menos {numTeams} xogadores</p>
      )}

      {teams && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
          {teams.map((team, i) => (
            <div key={i} className="card" style={{ borderColor: TEAM_COLORS[i] + '66' }}>
              <div className="flex items-center gap-2 mb-2">
                <Users2 size={14} style={{ color: TEAM_COLORS[i] }} />
                <span className="font-display text-sm" style={{ color: TEAM_COLORS[i] }}>{TEAM_NAMES[i]}</span>
              </div>
              <div className="space-y-1">
                {team.map(p => (
                  <div key={p.id} className="text-sm text-xogun-text px-2 py-1 rounded bg-xogun-surface flex items-center justify-between">
                    <span>{p.name}</span>
                    {mode === 'balanced' && p.wins > 0 && <span className="text-xogun-accent text-xs">🏆 {p.wins}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

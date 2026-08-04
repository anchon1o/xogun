import { useState, useEffect } from 'react'
import { Plus, Trash2, RotateCcw, Trophy, Save, X, LayoutList, Bookmark } from 'lucide-react'
import { useGameSession } from '../../contexts/GameSessionContext'
import { useAuth } from '../../contexts/AuthContext'
import { useMatches } from '../../hooks/useMatches'
import { calculateSectionTotal } from '../../lib/scoreTemplates'
import { loadFeltPreference, getFelt } from '../../lib/feltPreference'
import { useToast } from '../../contexts/ToastContext'
import ScoreTemplateCreator from './ScoreTemplateCreator'

const COLORS = ['#c8a96e','#6e8dc8','#6ec87e','#c86e6e','#c86ec8','#6ec8c8','#c8b46e','#8e6ec8']

function playersFromSession(sessionPlayers) {
  return sessionPlayers.map(p => ({ id: p.id, name: p.name, scores: [], sections: {}, color: p.color }))
}

function SaveMatchModal({ totals, sorted, gameId, gameName, matchId, onClose, onSaved }) {
  const { user } = useAuth()
  const toast = useToast()
  const { createMatch, updateMatch } = useMatches(user?.id)
  const [winnerIds, setWinnerIds] = useState(() => {
    const top = sorted[0]?.total
    return new Set(sorted.filter(p => p.total === top && top > 0).map(p => p.id))
  })
  const [saving, setSaving] = useState(false)

  function toggleWinner(id) {
    setWinnerIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  async function handleSave() {
    setSaving(true)
    const matchPlayers = totals.map(p => ({
      guest_name: p.name,
      player_color: p.color,
      score: { total: p.total, rounds: p.scores, sections: p.sections },
      winner: winnerIds.has(p.id),
    }))
    let error
    if (matchId) {
      ;({ error } = await updateMatch(matchId, {
        status: 'finished',
        finished_at: new Date().toISOString(),
        scores: Object.fromEntries(totals.map(p => [p.name, p.total])),
      }))
    } else {
      ;({ error } = await createMatch({
        game_id: gameId || null,
        game_name: gameName || null,
        status: 'finished',
        finished_at: new Date().toISOString(),
        scores: Object.fromEntries(totals.map(p => [p.name, p.total])),
      }, matchPlayers))
    }
    setSaving(false)
    if (error) toast.error('Non se puido gardar a partida — téntao de novo')
    else { onSaved?.(); onClose() }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-display text-sm text-xogun-accent">Gardar como partida</h3>
          <button onClick={onClose}><X size={18} className="text-xogun-muted" /></button>
        </div>
        <div className="p-4 space-y-3">
          {gameName && <p className="text-xogun-muted text-xs">Xogo: <span className="text-xogun-text">{gameName}</span></p>}
          <p className="label mb-1">Quen gañou?</p>
          <div className="space-y-1">
            {sorted.map(p => (
              <label key={p.id} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-xogun-surface cursor-pointer">
                <input type="checkbox" checked={winnerIds.has(p.id)} onChange={() => toggleWinner(p.id)} className="accent-xogun-accent" />
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                <span className="flex-1 text-sm">{p.name}</span>
                <span className="text-xs font-display font-bold" style={{ color: p.color }}>{p.total}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? 'Gardando...' : 'Gardar partida'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SaveInProgressButton({ players, totals, gameId, gameName, matchId, onSaved }) {
  const { user } = useAuth()
  const toast = useToast()
  const { createMatch, updateMatch } = useMatches(user?.id)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    const matchPlayers = totals.map(p => ({
      guest_name: p.name,
      player_color: p.color,
      score: { total: p.total, rounds: p.scores, sections: p.sections },
      winner: false,
    }))
    let hadError = false
    if (matchId) {
      const { error } = await updateMatch(matchId, {
        scores: Object.fromEntries(totals.map(p => [p.name, p.total])),
      })
      hadError = !!error
      // Nota: os xogadores individuais non se actualizan aquí para simplificar —
      // a partida activa gárdase principalmente para retomar as puntuacións totais.
    } else {
      const { data, error } = await createMatch({
        game_id: gameId || null,
        game_name: gameName || null,
        status: 'active',
        started_at: new Date().toISOString(),
        scores: Object.fromEntries(totals.map(p => [p.name, p.total])),
      }, matchPlayers)
      hadError = !!error
      if (data) onSaved?.(data.id)
    }
    setSaving(false)
    if (hadError) {
      toast.error('Non se puido gardar o progreso — téntao de novo')
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  return (
    <button onClick={handleSave} disabled={saving} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5 disabled:opacity-50">
      <Bookmark size={12} /> {saving ? 'Gardando...' : saved ? '✓ Gardada' : 'Gardar e continuar despois'}
    </button>
  )
}

export default function ScoreWidget() {
  const { user } = useAuth()
  const session = useGameSession()
  const hasSession = session?.hasActiveSession
  const template = session?.scoreTemplate
  const sections = template?.config?.scoreSections || []
  const felt = getFelt(loadFeltPreference())
  const hasSections = sections.length > 0

  const [players, setPlayers] = useState(() =>
    hasSession
      ? playersFromSession(session.players)
      : [
          { id: 'p1', name: 'Xogador 1', scores: [], sections: {}, color: COLORS[0] },
          { id: 'p2', name: 'Xogador 2', scores: [], sections: {}, color: COLORS[1] },
        ]
  )
  const [inputs, setInputs] = useState({})
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)
  const [showTemplateCreator, setShowTemplateCreator] = useState(false)
  const [templateMsg, setTemplateMsg] = useState('')
  const [activeMatchId, setActiveMatchId] = useState(null)
  const [resumableMatch, setResumableMatch] = useState(null)
  const { matches } = useMatches(user?.id)

  // Detecta se hai unha partida "active" (gardada para continuar) para este xogo
  useEffect(() => {
    if (!user || !session?.game?.id || activeMatchId) return
    const found = matches.find(m => m.status === 'active' && m.game_id === session.game.id)
    if (found) setResumableMatch(found)
  }, [matches, session?.game?.id, user, activeMatchId])

  function resumeMatch() {
    if (!resumableMatch) return
    const restored = (resumableMatch.match_players || []).map((mp, i) => ({
      id: crypto.randomUUID(),
      name: mp.guest_name || `Xogador ${i + 1}`,
      color: mp.player_color || COLORS[i % COLORS.length],
      scores: mp.score?.rounds || [],
      sections: mp.score?.sections || {},
    }))
    if (restored.length) setPlayers(restored)
    setActiveMatchId(resumableMatch.id)
    setResumableMatch(null)
  }

  function dismissResumable() { setResumableMatch(null) }

  useEffect(() => {
    if (hasSession) setPlayers(playersFromSession(session.players))
  }, [session?.players])

  function addPlayer() {
    const id = crypto.randomUUID()
    setPlayers(p => [...p, { id, name: `Xogador ${p.length + 1}`, scores: [], sections: {}, color: COLORS[p.length % COLORS.length] }])
  }
  function removePlayer(id) { setPlayers(p => p.filter(x => x.id !== id)) }
  function updateName(id, name) { setPlayers(p => p.map(x => x.id === id ? { ...x, name } : x)) }

  // Modo xenérico (rondas)
  function addScore(id) {
    const val = parseInt(inputs[id] || '0')
    if (isNaN(val)) return
    setPlayers(p => p.map(x => x.id === id ? { ...x, scores: [...x.scores, val] } : x))
    setInputs(i => ({ ...i, [id]: '' }))
  }
  function undoScore(id) { setPlayers(p => p.map(x => x.id === id ? { ...x, scores: x.scores.slice(0, -1) } : x)) }

  // Modo plantilla (seccións)
  function updateSection(playerId, sectionId, value) {
    const val = value === '' ? '' : Number(value)
    setPlayers(p => p.map(x => x.id === playerId ? { ...x, sections: { ...x.sections, [sectionId]: val } } : x))
  }

  function reset() {
    if (!confirm('Reiniciar todas as puntuacións?')) return
    setPlayers(p => p.map(x => ({ ...x, scores: [], sections: {} })))
    setActiveMatchId(null)
  }

  const totals = players.map(p => ({
    ...p,
    total: hasSections ? calculateSectionTotal(p.sections) : p.scores.reduce((a, b) => a + b, 0),
  }))
  const maxScore = Math.max(...totals.map(p => p.total), 1)
  const sorted = [...totals].sort((a, b) => b.total - a.total)
  const hasScores = hasSections
    ? totals.some(p => Object.keys(p.sections).length > 0)
    : totals.some(p => p.scores.length > 0)

  return (
    <div className="space-y-4">
      <div className="h-1 rounded-full -mt-2 mb-1" style={{ backgroundColor: felt.border }} />

      {resumableMatch && (
        <div className="bg-xogun-accent/10 border border-xogun-accent/30 rounded-lg px-3 py-2 flex items-center gap-2 animate-fade-in">
          <Bookmark size={14} className="text-xogun-accent flex-shrink-0" />
          <p className="text-xs flex-1">Hai unha partida deste xogo gardada para continuar.</p>
          <button onClick={resumeMatch} className="text-xogun-accent text-xs font-medium hover:underline flex-shrink-0">Retomar</button>
          <button onClick={dismissResumable} className="text-xogun-muted hover:text-xogun-text flex-shrink-0"><X size={13} /></button>
        </div>
      )}

      {hasSession && (
        <p className="text-xogun-muted text-xs -mt-1 flex items-center gap-1.5">
          Usando xogadores da sesión activa {session.game ? `· ${session.game.name}` : ''}
          {hasSections && <span className="flex items-center gap-1 text-xogun-accent"><LayoutList size={10} /> {template.name}</span>}
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

      {hasSections ? (
        /* Modo plantilla: unha tarxeta por xogador con todas as seccións */
        <div className="space-y-3">
          {players.map(p => {
            const total = totals.find(x => x.id === p.id)?.total || 0
            return (
              <div key={p.id} className="card">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                  <input className="bg-transparent text-sm font-medium flex-1 min-w-0 outline-none border-b border-transparent focus:border-xogun-accent text-xogun-text"
                    value={p.name} onChange={e => updateName(p.id, e.target.value)} />
                  <span className="font-display text-lg font-bold flex-shrink-0" style={{ color: p.color }}>{total}</span>
                  <button onClick={() => removePlayer(p.id)} className="text-xogun-muted hover:text-xogun-red transition-colors flex-shrink-0"><Trash2 size={13} /></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {sections.map(sec => (
                    <div key={sec.id}>
                      <label className="text-xogun-muted text-[10px] block mb-0.5">{sec.label}</label>
                      <input type="number" className="input py-1 text-sm"
                        value={p.sections[sec.id] ?? ''}
                        onChange={e => updateSection(p.id, sec.id, e.target.value)}
                        placeholder="0" />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Modo xenérico: rondas */
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
      )}

      {/* Rondas (só modo xenérico) */}
      {!hasSections && hasScores && (
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
      <div className="flex gap-2 pt-1 flex-wrap items-center">
        {!hasSections && <button onClick={addPlayer} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5"><Plus size={12} /> Xogador</button>}
        {user && !hasSections && session?.game && (
          <button onClick={() => setShowTemplateCreator(true)} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5">
            <LayoutList size={12} /> Crear plantilla
          </button>
        )}
        {user && hasScores && (
          <button onClick={() => setShowSaveModal(true)} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5">
            <Save size={12} /> Gardar como partida
          </button>
        )}
        {user && session?.game && hasScores && (
          <SaveInProgressButton players={players} totals={totals} gameId={session?.game?.id} gameName={session?.game?.name}
            matchId={activeMatchId} onSaved={setActiveMatchId} />
        )}
        {savedMsg && <span className="text-xogun-accent text-xs">✓ Partida gardada</span>}
        {templateMsg && <span className="text-xogun-accent text-xs">{templateMsg}</span>}
        <button onClick={reset} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5 ml-auto"><RotateCcw size={12} /> Reiniciar</button>
      </div>

      {showSaveModal && (
        <SaveMatchModal
          totals={totals} sorted={sorted}
          gameId={session?.game?.id} gameName={session?.game?.name}
          matchId={activeMatchId}
          onClose={() => setShowSaveModal(false)}
          onSaved={() => { setSavedMsg(true); setActiveMatchId(null); setTimeout(() => setSavedMsg(false), 3000) }}
        />
      )}

      {showTemplateCreator && (
        <ScoreTemplateCreator
          gameId={session?.game?.id} gameName={session?.game?.name}
          onClose={() => setShowTemplateCreator(false)}
          onCreated={() => {
            setShowTemplateCreator(false)
            setTemplateMsg('✓ Plantilla gardada — selecciónaa na próxima configuración de sesión')
            setTimeout(() => setTemplateMsg(''), 5000)
          }}
        />
      )}
    </div>
  )
}

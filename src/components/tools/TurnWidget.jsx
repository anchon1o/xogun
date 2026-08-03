import { useState, useEffect, useMemo } from 'react'
import { Plus, Trash2, Shuffle, ChevronRight, RotateCcw, Palette } from 'lucide-react'
import { useGameSession } from '../../contexts/GameSessionContext'
import { FELT_COLORS, loadFeltPreference, saveFeltPreference, getFelt } from '../../lib/feltPreference'

const COLORS = ['#c8a96e','#6e8dc8','#6ec87e','#c86e6e','#c86ec8','#6ec8c8','#c8b46e','#8e6ec8']

export default function TurnWidget() {
  const session = useGameSession()
  const hasSession = session?.hasActiveSession

  const [localNames, setLocalNames] = useState(['', '', ''])
  const [order, setOrder] = useState(null)
  const [current, setCurrent] = useState(0)
  const [round, setRound] = useState(1)
  const [feltId, setFeltId] = useState(loadFeltPreference)
  const [showFeltPicker, setShowFeltPicker] = useState(false)
  const [roundLimit, setRoundLimit] = useState('')

  const felt = getFelt(feltId)

  function selectFelt(id) {
    setFeltId(id)
    saveFeltPreference(id)
    setShowFeltPicker(false)
  }

  const basePlayers = useMemo(() => {
    if (hasSession) return session.players
    return localNames.filter(n => n.trim()).map((n, i) => ({ id: `l${i}`, name: n, color: COLORS[i % COLORS.length] }))
  }, [hasSession, session?.players, localNames])

  useEffect(() => {
    if (hasSession) { setOrder(null); setCurrent(0); setRound(1) }
  }, [session?.players])

  function addPlayer() { setLocalNames(n => [...n, '']) }
  function removePlayer(i) { setLocalNames(n => n.filter((_, j) => j !== i)) }
  function updatePlayer(i, val) { setLocalNames(n => n.map((x, j) => j === i ? val : x)) }

  function shuffle() {
    if (basePlayers.length < 2) return
    setOrder([...basePlayers].sort(() => Math.random() - 0.5))
    setCurrent(0); setRound(1)
  }

  function next() {
    setCurrent(c => {
      if (c + 1 >= order.length) { setRound(r => r + 1); return 0 }
      return c + 1
    })
  }

  function reset() { setOrder(null); setCurrent(0); setRound(1) }

  // Posición de cada xogador arredor da mesa (elipse), deixando máis espazo
  // horizontal — pensado para tablet en horizontal onde a mesa é máis ancha.
  function seatPosition(i, total) {
    const angle = (i / total) * 2 * Math.PI - Math.PI / 2
    const rx = 44, ry = 40
    return {
      left: `${50 + rx * Math.cos(angle)}%`,
      top: `${50 + ry * Math.sin(angle)}%`,
    }
  }

  const FeltPickerButton = (
    <div className="relative">
      <button onClick={() => setShowFeltPicker(s => !s)} className="btn-ghost flex items-center gap-1.5 text-xs">
        <Palette size={12} /> Tapete
      </button>
      {showFeltPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowFeltPicker(false)} />
          <div className="absolute right-0 mt-1 card shadow-xl z-50 p-2 w-48">
            <div className="grid grid-cols-2 gap-1.5">
              {FELT_COLORS.map(f => (
                <button key={f.id} onClick={() => selectFelt(f.id)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] transition-all ${feltId === f.id ? 'ring-2 ring-xogun-accent' : ''}`}
                  style={{ backgroundColor: f.bg, color: '#e8e4f0' }}>
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: f.border }} />
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )

  const setupNeeded = !hasSession && !order

  if (setupNeeded) {
    return (
      <div className="space-y-4 max-w-sm">
        <div className="space-y-2">
          {localNames.map((n, i) => (
            <div key={i} className="flex gap-2">
              <input className="input flex-1" placeholder={`Xogador ${i + 1}`} value={n} onChange={e => updatePlayer(i, e.target.value)} />
              {localNames.length > 2 && (
                <button onClick={() => removePlayer(i)} className="text-xogun-muted hover:text-xogun-red transition-colors px-2"><Trash2 size={14} /></button>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={addPlayer} className="btn-secondary flex items-center gap-2 text-xs"><Plus size={12} /> Engadir</button>
          <button onClick={shuffle} className="btn-primary flex items-center gap-2"><Shuffle size={14} /> Barallar orde</button>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="flex justify-end">{FeltPickerButton}</div>
        <p className="text-xogun-muted text-sm">{basePlayers.length} xogadores na sesión</p>
        <button onClick={shuffle} disabled={basePlayers.length < 2} className="btn-primary flex items-center gap-2 mx-auto disabled:opacity-50">
          <Shuffle size={14} /> Barallar orde
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xogun-muted text-sm">
            Rolda <span className="text-xogun-text font-bold">{round}</span>
            {roundLimit && <span className="text-xogun-muted"> / {roundLimit}</span>}
          </span>
          <input type="number" min={1} placeholder="Límite" value={roundLimit}
            onChange={e => setRoundLimit(e.target.value)}
            className="input w-16 py-1 text-xs" />
        </div>
        <div className="flex items-center gap-2">
          {FeltPickerButton}
          <button onClick={reset} className="btn-secondary flex items-center gap-1 text-xs py-1"><RotateCcw size={11} /> Reiniciar</button>
        </div>
      </div>

      {roundLimit && round >= Number(roundLimit) && (
        <div className="bg-xogun-red/10 border border-xogun-red/30 rounded-lg px-3 py-2 text-center">
          <span className="text-xogun-red text-sm font-medium">🏁 Última rolda!</span>
        </div>
      )}

      {/* Mesa visual */}
      <div className="relative w-full aspect-[16/10] max-w-lg mx-auto">
        {/* Táboa (tapete) */}
        <div className="absolute inset-[10%] rounded-[50%] flex items-center justify-center shadow-inner transition-colors duration-300"
          style={{ backgroundColor: felt.bg, border: `6px solid ${felt.border}` }}>
          <span className="text-4xl opacity-15">🎲</span>
        </div>

        {/* Asentos */}
        {order.map((p, i) => {
          const pos = seatPosition(i, order.length)
          const isActive = i === current
          const isPast = i < current
          return (
            <button key={p.id} onClick={() => setCurrent(i)}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 flex flex-col items-center gap-1"
              style={{ left: pos.left, top: pos.top, opacity: isPast ? 0.35 : 1 }}>
              <div className={`rounded-full flex items-center justify-center font-bold transition-all duration-300 ${isActive ? 'w-14 h-14 ring-4 ring-xogun-accent/50 text-base' : 'w-10 h-10 text-sm'}`}
                style={{ backgroundColor: p.color, color: '#181206', boxShadow: isActive ? `0 0 20px ${p.color}99` : 'none' }}>
                {p.name[0]?.toUpperCase()}
              </div>
              <span className={`text-[10px] font-medium max-w-[70px] truncate text-center px-1 rounded ${isActive ? 'text-xogun-accent bg-xogun-bg/60' : 'text-xogun-muted'}`}>
                {p.name}
              </span>
            </button>
          )
        })}
      </div>

      {/* Current player highlight */}
      <div className="bg-xogun-accent/10 border border-xogun-accent rounded-xl p-4 text-center">
        <div className="text-xogun-muted text-xs uppercase tracking-wider mb-1">Xoga agora</div>
        <div className="font-display text-2xl text-xogun-accent">{order[current]?.name}</div>
      </div>

      <button onClick={next} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
        Seguinte <ChevronRight size={16} />
      </button>
    </div>
  )
}

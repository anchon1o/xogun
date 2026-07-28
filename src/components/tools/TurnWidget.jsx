import { useState, useEffect, useMemo } from 'react'
import { Plus, Trash2, Shuffle, ChevronRight, RotateCcw } from 'lucide-react'
import { useGameSession } from '../../contexts/GameSessionContext'

const COLORS = ['#c8a96e','#6e8dc8','#6ec87e','#c86e6e','#c86ec8','#6ec8c8','#c8b46e','#8e6ec8']

export default function TurnWidget() {
  const session = useGameSession()
  const hasSession = session?.hasActiveSession

  const [localNames, setLocalNames] = useState(['', '', ''])
  const [order, setOrder] = useState(null)
  const [current, setCurrent] = useState(0)
  const [round, setRound] = useState(1)

  // Xogadores base: da sesión se existe, senón dos campos locais
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

  // Posición de cada xogador arredor da mesa (elipse)
  function seatPosition(i, total) {
    const angle = (i / total) * 2 * Math.PI - Math.PI / 2
    const rx = 42, ry = 38 // % do contedor
    return {
      left: `${50 + rx * Math.cos(angle)}%`,
      top: `${50 + ry * Math.sin(angle)}%`,
    }
  }

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
    // Hai sesión pero aínda non se barallou
    return (
      <div className="text-center py-6 space-y-4">
        <p className="text-xogun-muted text-sm">{basePlayers.length} xogadores na sesión</p>
        <button onClick={shuffle} disabled={basePlayers.length < 2} className="btn-primary flex items-center gap-2 mx-auto disabled:opacity-50">
          <Shuffle size={14} /> Barallar orde
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xogun-muted text-sm">Rolda <span className="text-xogun-text font-bold">{round}</span></span>
        <button onClick={reset} className="btn-secondary flex items-center gap-1 text-xs py-1"><RotateCcw size={11} /> Reiniciar</button>
      </div>

      {/* Mesa visual */}
      <div className="relative w-full aspect-[4/3] max-w-sm mx-auto">
        {/* Táboa */}
        <div className="absolute inset-[12%] rounded-[50%] bg-xogun-surface border-2 border-xogun-border flex items-center justify-center">
          <span className="text-3xl opacity-20">🎲</span>
        </div>

        {/* Asentos */}
        {order.map((p, i) => {
          const pos = seatPosition(i, order.length)
          const isActive = i === current
          const isPast = i < current
          return (
            <div key={p.id} className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 flex flex-col items-center gap-1"
              style={{ left: pos.left, top: pos.top, opacity: isPast ? 0.35 : 1 }}>
              <div className={`rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${isActive ? 'w-12 h-12 ring-4 ring-xogun-accent/40' : 'w-9 h-9'}`}
                style={{ backgroundColor: p.color, color: '#181206' }}>
                {p.name[0]?.toUpperCase()}
              </div>
              <span className={`text-[10px] font-medium max-w-[60px] truncate text-center ${isActive ? 'text-xogun-accent' : 'text-xogun-muted'}`}>
                {p.name}
              </span>
            </div>
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

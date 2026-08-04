import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Plus, Trash2, Shuffle, ChevronRight, RotateCcw, Palette, LayoutGrid, Minus } from 'lucide-react'
import { useGameSession } from '../../contexts/GameSessionContext'
import { FELT_COLORS, loadFeltPreference, saveFeltPreference, getFelt } from '../../lib/feltPreference'
import {
  TABLE_SHAPES, loadShapePreference, saveShapePreference,
  positionsForShape, evenSides, facingSides, oneVsRest, distributionSum,
} from '../../lib/tableShapes'

const COLORS = ['#c8a96e','#6e8dc8','#6ec87e','#c86e6e','#c86ec8','#6ec8c8','#c8b46e','#8e6ec8']

function playersFromSession(sessionPlayers) {
  return sessionPlayers.map(p => ({ id: p.id, name: p.name, color: p.color }))
}

// Selector compartido en dropdown (tapete / forma)
function PopoverButton({ icon: Icon, label, open, onToggle, children }) {
  return (
    <div className="relative">
      <button onClick={onToggle} className="btn-ghost flex items-center gap-1.5 text-xs">
        <Icon size={12} /> {label}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onToggle} />
          <div className="absolute right-0 mt-1 card shadow-xl z-50 p-3 w-56">{children}</div>
        </>
      )}
    </div>
  )
}

export default function TurnWidget() {
  const session = useGameSession()
  const hasSession = session?.hasActiveSession

  const [localNames, setLocalNames] = useState(['', '', ''])
  const [seats, setSeats] = useState(null)      // array de xogadores en orde horaria = orde de turno
  const [current, setCurrent] = useState(0)
  const [round, setRound] = useState(1)
  const [roundLimit, setRoundLimit] = useState('')

  const [feltId, setFeltId] = useState(loadFeltPreference)
  const [shape, setShape] = useState(loadShapePreference)
  const [distribution, setDistribution] = useState(null) // {top,right,bottom,left} para rect/square
  const [showFeltPicker, setShowFeltPicker] = useState(false)
  const [showShapePicker, setShowShapePicker] = useState(false)

  const felt = getFelt(feltId)

  const basePlayers = useMemo(() => {
    if (hasSession) return session.players
    return localNames.filter(n => n.trim()).map((n, i) => ({ id: `l${i}`, name: n, color: COLORS[i % COLORS.length] }))
  }, [hasSession, session?.players, localNames])

  useEffect(() => {
    if (hasSession) { setSeats(null); setCurrent(0); setRound(1) }
  }, [session?.players])

  function selectFelt(id) { setFeltId(id); saveFeltPreference(id); setShowFeltPicker(false) }
  function selectShape(id) {
    setShape(id)
    saveShapePreference(id)
    if ((id === 'rect' || id === 'square') && seats) setDistribution(evenSides(seats.length))
  }

  function addPlayer() { setLocalNames(n => [...n, '']) }
  function removePlayer(i) { setLocalNames(n => n.filter((_, j) => j !== i)) }
  function updatePlayer(i, val) { setLocalNames(n => n.map((x, j) => j === i ? val : x)) }

  function shuffle() {
    if (basePlayers.length < 2) return
    const shuffled = [...basePlayers].sort(() => Math.random() - 0.5)
    setSeats(shuffled)
    setCurrent(0); setRound(1)
    if (shape === 'rect' || shape === 'square') setDistribution(evenSides(shuffled.length))
  }

  function next() {
    setCurrent(c => {
      if (c + 1 >= seats.length) { setRound(r => r + 1); return 0 }
      return c + 1
    })
  }

  function reset() { setSeats(null); setCurrent(0); setRound(1) }

  const positions = useMemo(() => {
    if (!seats) return []
    return positionsForShape(shape, seats.length, distribution)
  }, [shape, seats, distribution])

  // ---- Distribución de asentos (só rect/cadrado) ----
  function applyDistribution(fn) {
    if (!seats) return
    setDistribution(fn(seats.length))
  }
  function adjustSide(side, delta) {
    setDistribution(d => {
      const next = { ...(d || evenSides(seats.length)) }
      next[side] = Math.max(0, (next[side] || 0) + delta)
      return next
    })
  }
  const distTotal = distribution ? distributionSum(distribution) : 0
  const distValid = seats && distTotal === seats.length

  // ---- Arrastrar e soltar xogadores entre asentos ----
  const containerRef = useRef(null)
  const seatRefs = useRef({})
  const [dragIndex, setDragIndex] = useState(null)
  const [dragPos, setDragPos] = useState(null)
  const dragMoved = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const handlePointerMove = useCallback((e) => {
    setDragPos({ x: e.clientX, y: e.clientY })
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    if (Math.hypot(dx, dy) > 8) dragMoved.current = true
  }, [])

  const handlePointerUp = useCallback((e) => {
    const idx = dragIndex
    const moved = dragMoved.current
    setDragIndex(null); setDragPos(null)
    if (idx === null) return
    // Atopa o asento baixo o punteiro
    let targetIndex = null
    Object.entries(seatRefs.current).forEach(([i, el]) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
        targetIndex = Number(i)
      }
    })
    if (!moved || targetIndex === idx) {
      // Toque sen arrastrar: salta o turno a este xogador
      setCurrent(idx)
      return
    }
    if (targetIndex !== null && targetIndex !== idx) {
      setSeats(prev => {
        const copy = [...prev]
        ;[copy[idx], copy[targetIndex]] = [copy[targetIndex], copy[idx]]
        return copy
      })
    }
  }, [dragIndex])

  useEffect(() => {
    if (dragIndex === null) return
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [dragIndex, handlePointerMove, handlePointerUp])

  function startDrag(e, i) {
    e.preventDefault()
    dragMoved.current = false
    dragStart.current = { x: e.clientX, y: e.clientY }
    setDragIndex(i)
    setDragPos({ x: e.clientX, y: e.clientY })
  }

  const FeltPicker = (
    <PopoverButton icon={Palette} label="Tapete" open={showFeltPicker} onToggle={() => setShowFeltPicker(s => !s)}>
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
    </PopoverButton>
  )

  const ShapePicker = (
    <PopoverButton icon={LayoutGrid} label="Forma" open={showShapePicker} onToggle={() => setShowShapePicker(s => !s)}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-1.5">
          {TABLE_SHAPES.map(s => (
            <button key={s.id} onClick={() => selectShape(s.id)}
              className={`px-2 py-1.5 rounded-lg text-[11px] border transition-colors ${shape === s.id ? 'border-xogun-accent text-xogun-accent bg-xogun-accent/10' : 'border-xogun-border text-xogun-muted'}`}>
              {s.label}
            </button>
          ))}
        </div>

        {(shape === 'rect' || shape === 'square') && seats && (
          <div className="border-t border-xogun-border pt-2 space-y-2">
            <p className="text-xogun-muted text-[10px] uppercase tracking-wider">Distribución rápida</p>
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => applyDistribution(evenSides)} className="btn-secondary text-[10px] px-2 py-1">Uniforme</button>
              <button onClick={() => applyDistribution(facingSides)} className="btn-secondary text-[10px] px-2 py-1">Enfrontados</button>
              <button onClick={() => applyDistribution(oneVsRest)} className="btn-secondary text-[10px] px-2 py-1">1 contra todos</button>
            </div>
            <p className="text-xogun-muted text-[10px] uppercase tracking-wider mt-2">Manual por lado</p>
            {[['top','Arriba'],['right','Dereita'],['bottom','Abaixo'],['left','Esquerda']].map(([key, label]) => (
              <div key={key} className="flex items-center justify-between text-xs">
                <span className="text-xogun-muted">{label}</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => adjustSide(key, -1)} className="w-5 h-5 rounded bg-xogun-surface flex items-center justify-center"><Minus size={10} /></button>
                  <span className="w-4 text-center">{distribution?.[key] ?? 0}</span>
                  <button onClick={() => adjustSide(key, 1)} className="w-5 h-5 rounded bg-xogun-surface flex items-center justify-center"><Plus size={10} /></button>
                </div>
              </div>
            ))}
            <p className={`text-[10px] ${distValid ? 'text-xogun-accent' : 'text-xogun-red'}`}>
              Total: {distTotal} / {seats.length} asentos {distValid ? '✓' : '(debe cadrar)'}
            </p>
          </div>
        )}
      </div>
    </PopoverButton>
  )

  const setupNeeded = !hasSession && !seats

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
          <button onClick={shuffle} className="btn-primary flex items-center gap-2"><Shuffle size={14} /> Sentar á mesa</button>
        </div>
      </div>
    )
  }

  if (!seats) {
    return (
      <div className="text-center py-6 space-y-4">
        <p className="text-xogun-muted text-sm">{basePlayers.length} xogadores na sesión</p>
        <button onClick={shuffle} disabled={basePlayers.length < 2} className="btn-primary flex items-center gap-2 mx-auto disabled:opacity-50">
          <Shuffle size={14} /> Sentar á mesa
        </button>
      </div>
    )
  }

  const draggedPlayer = dragIndex !== null ? seats[dragIndex] : null

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
          {ShapePicker}
          {FeltPicker}
          <button onClick={reset} className="btn-secondary flex items-center gap-1 text-xs py-1"><RotateCcw size={11} /> Reiniciar</button>
        </div>
      </div>

      {roundLimit && round >= Number(roundLimit) && (
        <div className="bg-xogun-red/10 border border-xogun-red/30 rounded-lg px-3 py-2 text-center">
          <span className="text-xogun-red text-sm font-medium">🏁 Última rolda!</span>
        </div>
      )}

      {(shape === 'rect' || shape === 'square') && !distValid && (
        <p className="text-xogun-red text-xs text-center">
          A distribución de asentos non cadra co número de xogadores — axústaa en "Forma".
        </p>
      )}

      <p className="text-xogun-muted text-[11px] text-center">Arrastra un xogador a outro asento para cambialo de sitio.</p>

      {/* Mesa visual */}
      <div ref={containerRef}
        className={`relative w-full mx-auto select-none ${shape === 'circle' || shape === 'square' ? 'max-w-sm aspect-square' : 'max-w-lg aspect-[16/10]'}`}>
        {/* Táboa (tapete) */}
        <div
          className={`absolute shadow-inner transition-colors duration-300 flex items-center justify-center ${shape === 'circle' || shape === 'oval' ? 'inset-[10%] rounded-[50%]' : 'inset-[13%] rounded-2xl'}`}
          style={{ backgroundColor: felt.bg, border: `6px solid ${felt.border}` }}>
          <span className="text-4xl opacity-15">🎲</span>
        </div>

        {/* Asentos */}
        {seats.map((p, i) => {
          const pos = positions[i] || { left: '50%', top: '50%' }
          const isActive = i === current
          const isPast = i < current
          const isDragging = dragIndex === i
          return (
            <div key={p.id}
              ref={el => { seatRefs.current[i] = el }}
              onPointerDown={e => startDrag(e, i)}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing touch-none"
              style={{ left: pos.left, top: pos.top, opacity: isDragging ? 0.25 : (isPast ? 0.35 : 1) }}>
              <div className={`rounded-full flex items-center justify-center font-bold transition-all duration-300 ${isActive ? 'w-14 h-14 ring-4 ring-xogun-accent/50 text-base' : 'w-10 h-10 text-sm'}`}
                style={{ backgroundColor: p.color, color: '#181206', boxShadow: isActive ? `0 0 20px ${p.color}99` : 'none' }}>
                {p.name[0]?.toUpperCase()}
              </div>
              <span className={`text-[10px] font-medium max-w-[70px] truncate text-center px-1 rounded ${isActive ? 'text-xogun-accent bg-xogun-bg/60' : 'text-xogun-muted'}`}>
                {p.name}
              </span>
            </div>
          )
        })}

        {/* Clon flotante mentres se arrastra */}
        {draggedPlayer && dragPos && (
          <div className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
            style={{ left: dragPos.x, top: dragPos.y }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-base ring-4 ring-white/40"
              style={{ backgroundColor: draggedPlayer.color, color: '#181206' }}>
              {draggedPlayer.name[0]?.toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Current player highlight */}
      <div className="bg-xogun-accent/10 border border-xogun-accent rounded-xl p-4 text-center">
        <div className="text-xogun-muted text-xs uppercase tracking-wider mb-1">Xoga agora</div>
        <div className="font-display text-2xl text-xogun-accent">{seats[current]?.name}</div>
      </div>

      <button onClick={next} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
        Seguinte <ChevronRight size={16} />
      </button>
    </div>
  )
}

import { useState } from 'react'
import { Plus, Trash2, Shuffle, ChevronRight, RotateCcw, Crown } from 'lucide-react'

export default function TurnWidget() {
  const [names, setNames]   = useState(['', '', ''])
  const [order, setOrder]   = useState(null)
  const [current, setCurrent] = useState(0)
  const [round, setRound]   = useState(1)

  function addPlayer() { setNames(n => [...n, '']) }
  function removePlayer(i) { setNames(n => n.filter((_, j) => j !== i)) }
  function updatePlayer(i, val) { setNames(n => n.map((x, j) => j === i ? val : x)) }

  function shuffle() {
    const named = names.filter(n => n.trim())
    if (named.length < 2) return
    setOrder([...named].sort(() => Math.random() - 0.5))
    setCurrent(0); setRound(1)
  }

  function next() {
    setCurrent(c => {
      if (c + 1 >= order.length) { setRound(r => r + 1); return 0 }
      return c + 1
    })
  }

  function reset() { setOrder(null); setCurrent(0); setRound(1) }

  if (!order) return (
    <div className="space-y-4">
      <div className="space-y-2">
        {names.map((n, i) => (
          <div key={i} className="flex gap-2 items-center">
            <div className="w-6 h-6 rounded-full bg-xogun-surface border border-xogun-border flex items-center justify-center text-xogun-muted text-xs flex-shrink-0">{i + 1}</div>
            <input className="input flex-1" placeholder={`Xogador ${i + 1}`} value={n} onChange={e => updatePlayer(i, e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addPlayer()} />
            {names.length > 2 && <button onClick={() => removePlayer(i)} className="text-xogun-muted hover:text-xogun-red transition-colors"><Trash2 size={14} /></button>}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={addPlayer} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5"><Plus size={12} /> Engadir</button>
        <button onClick={shuffle} className="btn-primary flex items-center gap-2 ml-auto"><Shuffle size={14} /> Barallar</button>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xogun-muted text-sm">Rolda <span className="text-xogun-text font-bold">{round}</span></span>
        <button onClick={reset} className="btn-secondary flex items-center gap-1 text-xs py-1"><RotateCcw size={11} /> Reiniciar</button>
      </div>

      {/* Current player highlight */}
      <div className="bg-xogun-accent/10 border border-xogun-accent rounded-xl p-4 text-center">
        <div className="text-xogun-muted text-xs uppercase tracking-wider mb-1">Xoga agora</div>
        <div className="font-display text-2xl text-xogun-accent">{order[current]}</div>
      </div>

      {/* Full order */}
      <div className="space-y-1.5">
        {order.map((p, i) => (
          <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
            i === current ? 'bg-xogun-accent/10 border border-xogun-accent' :
            i < current ? 'opacity-30 border border-transparent' :
            'bg-xogun-surface border border-xogun-border'
          }`}>
            <span className="w-5 text-center text-xs text-xogun-muted">{i + 1}</span>
            <span className={`flex-1 text-sm font-medium ${i === current ? 'text-xogun-accent' : 'text-xogun-text'}`}>{p}</span>
            {i === 0 && <Crown size={12} className="text-xogun-accent opacity-50" />}
          </div>
        ))}
      </div>

      <button onClick={next} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
        Seguinte <ChevronRight size={16} />
      </button>
    </div>
  )
}

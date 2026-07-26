import { useState, useRef, useEffect } from 'react'
import { useAppConfig } from '../contexts/AppConfigContext'
import DiceWidget from '../components/tools/DiceWidget'
import ScoreWidget from '../components/tools/ScoreWidget'
import TimerWidget from '../components/tools/TimerWidget'
import TurnWidget from '../components/tools/TurnWidget'

const ALL_WIDGETS = [
  { id: 'dice',      label: 'Dados',       emoji: '🎲', component: DiceWidget },
  { id: 'scoreboard',label: 'Marcador',    emoji: '🏆', component: ScoreWidget },
  { id: 'timer',     label: 'Temporizador',emoji: '⏱️', component: TimerWidget },
  { id: 'turns',     label: 'Turnos',      emoji: '🔄', component: TurnWidget },
]

function MobileView({ widgets }) {
  const [active, setActive] = useState(0)
  const startX = useRef(null)

  function onTouchStart(e) { startX.current = e.touches[0].clientX }
  function onTouchEnd(e) {
    if (startX.current === null) return
    const dx = e.changedTouches[0].clientX - startX.current
    if (Math.abs(dx) < 40) return
    if (dx < 0) setActive(a => Math.min(a + 1, widgets.length - 1))
    else setActive(a => Math.max(a - 1, 0))
    startX.current = null
  }

  const ActiveComponent = widgets[active]?.component

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 3.5rem)' }}>
      <div className="flex bg-xogun-surface border-b border-xogun-border">
        {widgets.map((w, i) => (
          <button key={w.id} onClick={() => setActive(i)}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors flex flex-col items-center gap-0.5
              ${active === i ? 'text-xogun-accent border-b-2 border-xogun-accent' : 'text-xogun-muted'}`}>
            <span className="text-lg leading-none">{w.emoji}</span>
            <span className="text-[10px]">{w.label}</span>
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {ActiveComponent && <ActiveComponent />}
      </div>
      <div className="flex justify-center gap-2 py-2 bg-xogun-surface border-t border-xogun-border">
        {widgets.map((_, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`rounded-full transition-all duration-200 ${i === active ? 'w-5 h-2 bg-xogun-accent' : 'w-2 h-2 bg-xogun-border'}`} />
        ))}
      </div>
    </div>
  )
}

function DesktopView({ widgets }) {
  const [hidden, setHidden] = useState(new Set())
  function toggle(id) { setHidden(h => { const n = new Set(h); n.has(id) ? n.delete(id) : n.add(id); return n }) }
  const visible = widgets.filter(w => !hidden.has(w.id))

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="section-title">Ferramentas de partida</h1>
          <p className="section-subtitle">Utilidades para as túas sesións de xogo</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {widgets.map(w => (
            <button key={w.id} onClick={() => toggle(w.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${hidden.has(w.id) ? 'border-xogun-border text-xogun-muted opacity-50' : 'border-xogun-border text-xogun-text hover:border-xogun-accent'}`}>
              {w.emoji} {w.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {visible.map(w => {
          const Component = w.component
          return (
            <div key={w.id} className="bg-xogun-card border border-xogun-border rounded-2xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-xogun-border">
                <span className="font-display text-sm text-xogun-accent">{w.emoji} {w.label}</span>
                <button onClick={() => toggle(w.id)} className="text-xogun-muted hover:text-xogun-red transition-colors text-lg leading-none">×</button>
              </div>
              <div className="p-4 flex-1"><Component /></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ToolsPage() {
  const { isToolEnabled } = useAppConfig()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  const widgets = ALL_WIDGETS.filter(w => isToolEnabled(w.id))

  return isMobile
    ? <MobileView widgets={widgets} />
    : <DesktopView widgets={widgets} />
}

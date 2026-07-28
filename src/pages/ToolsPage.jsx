import { useState, useRef, useEffect } from 'react'
import { useAppConfig } from '../contexts/AppConfigContext'
import { useAuth } from '../contexts/AuthContext'
import { useGameSession } from '../contexts/GameSessionContext'
import { useToolPresets } from '../hooks/useToolPresets'
import DiceWidget from '../components/tools/DiceWidget'
import ScoreWidget from '../components/tools/ScoreWidget'
import TimerWidget from '../components/tools/TimerWidget'
import TurnWidget from '../components/tools/TurnWidget'
import MusicWidget from '../components/tools/MusicWidget'
import SessionSetup from '../components/tools/SessionSetup'
import { Gamepad2, X, ChevronDown, Users, Save, Bookmark } from 'lucide-react'

const ALL_WIDGETS = [
  { id: 'dice',       label: 'Dados',        emoji: '🎲', component: DiceWidget },
  { id: 'scoreboard', label: 'Marcador',     emoji: '🏆', component: ScoreWidget },
  { id: 'timer',      label: 'Temporizador', emoji: '⏱️', component: TimerWidget },
  { id: 'turns',      label: 'Turnos',       emoji: '🔄', component: TurnWidget },
  { id: 'music',      label: 'Música',       emoji: '🎵', component: MusicWidget },
]

// Breakpoints: móbil (<768), táboa/iPad vertical (768–1100 en columna única), escritorio (>1100 en grid)
function useLayoutMode() {
  const [mode, setMode] = useState(getMode())
  function getMode() {
    const w = window.innerWidth
    if (w < 768) return 'mobile'
    if (w < 1100) return 'stacked'
    return 'desktop'
  }
  useEffect(() => {
    const h = () => setMode(getMode())
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return mode
}

function SavePresetModal({ onSave, onClose }) {
  const [name, setName] = useState('')
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal max-w-xs" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-display text-sm text-xogun-accent">Gardar preset</h3>
          <button onClick={onClose}><X size={18} className="text-xogun-muted" /></button>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-xogun-muted text-xs">Gardarase a configuración actual de ferramentas para este xogo.</p>
          <input className="input" placeholder="Nome do preset (ex: Catán rápido)" value={name} onChange={e => setName(e.target.value)} autoFocus />
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={() => name.trim() && onSave(name.trim())} disabled={!name.trim()} className="btn-primary disabled:opacity-50">Gardar</button>
        </div>
      </div>
    </div>
  )
}

function TabbedView({ widgets, allWidgets, activeIds, onToggle, tall }) {
  const [active, setActive] = useState(0)
  const [showConfig, setShowConfig] = useState(false)
  const startX = useRef(null)

  useEffect(() => { if (active >= widgets.length) setActive(0) }, [widgets.length])

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
    <div className={`flex flex-col ${tall ? '' : 'rounded-2xl border border-xogun-border overflow-hidden'}`}
      style={tall ? { height: 'calc(100vh - 3.5rem)' } : {}}>
      <div className="flex items-center bg-xogun-surface border-b border-xogun-border">
        <div className="flex flex-1 overflow-x-auto">
          {widgets.map((w, i) => (
            <button key={w.id} onClick={() => setActive(i)}
              className={`flex-1 min-w-[64px] py-2.5 text-xs font-medium transition-colors flex flex-col items-center gap-0.5
                ${active === i ? 'text-xogun-accent border-b-2 border-xogun-accent' : 'text-xogun-muted'}`}>
              <span className="text-lg leading-none">{w.emoji}</span>
              <span className="text-[10px]">{w.label}</span>
            </button>
          ))}
        </div>
        <button onClick={() => setShowConfig(true)} className="px-3 py-2.5 text-xogun-muted flex-shrink-0">
          <ChevronDown size={16} />
        </button>
      </div>

      {showConfig && (
        <div className="modal-backdrop" onClick={() => setShowConfig(false)}>
          <div className="modal max-w-xs" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="font-display text-sm text-xogun-accent">Ferramentas activas</h3>
              <button onClick={() => setShowConfig(false)}><X size={18} className="text-xogun-muted" /></button>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {allWidgets.map(w => (
                <label key={w.id} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={activeIds.has(w.id)} onChange={() => onToggle(w.id)} className="accent-xogun-accent" />
                  <span className="text-sm">{w.emoji} {w.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={`flex-1 overflow-y-auto overflow-x-hidden p-4 ${tall ? '' : 'min-h-[420px]'}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {ActiveComponent ? <ActiveComponent /> : <p className="text-xogun-muted text-center py-10 text-sm">Ningunha ferramenta activada. Toca a frecha arriba para elixir.</p>}
      </div>
      {widgets.length > 0 && (
        <div className="flex justify-center gap-2 py-2 bg-xogun-surface border-t border-xogun-border">
          {widgets.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-200 ${i === active ? 'w-5 h-2 bg-xogun-accent' : 'w-2 h-2 bg-xogun-border'}`} />
          ))}
        </div>
      )}
    </div>
  )
}

function GridView({ widgets, allWidgets, activeIds, onToggle }) {
  return (
    <div>
      <div className="flex gap-1.5 flex-wrap mb-5">
        {allWidgets.map(w => (
          <button key={w.id} onClick={() => onToggle(w.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${!activeIds.has(w.id) ? 'border-xogun-border text-xogun-muted opacity-50' : 'border-xogun-border text-xogun-text hover:border-xogun-accent'}`}>
            {w.emoji} {w.label}
          </button>
        ))}
      </div>
      {widgets.length === 0 ? (
        <p className="text-xogun-muted text-sm text-center py-10">Selecciona polo menos unha ferramenta arriba.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {widgets.map(w => {
            const Component = w.component
            return (
              <div key={w.id} className="bg-xogun-card border border-xogun-border rounded-2xl overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-xogun-border">
                  <span className="font-display text-sm text-xogun-accent">{w.emoji} {w.label}</span>
                  <button onClick={() => onToggle(w.id)} className="text-xogun-muted hover:text-xogun-red transition-colors text-lg leading-none">×</button>
                </div>
                <div className="p-4 flex-1 overflow-hidden"><Component /></div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function ToolsPage() {
  const { isToolEnabled } = useAppConfig()
  const { user, profile } = useAuth()
  const session = useGameSession()
  const layoutMode = useLayoutMode()
  const [showSetup, setShowSetup] = useState(!session?.hasActiveSession)
  const [activeIds, setActiveIds] = useState(new Set(['dice', 'scoreboard']))
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const { presets, createPreset } = useToolPresets(session?.game?.id, user?.id)

  useEffect(() => {
    if (presets.length > 0 && presets[0].config?.tools) {
      setActiveIds(new Set(presets[0].config.tools))
    }
  }, [presets])

  const allWidgets = ALL_WIDGETS.filter(w => isToolEnabled(w.id))
  const widgets = allWidgets.filter(w => activeIds.has(w.id))

  function toggle(id) {
    setActiveIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function endSession() {
    session?.clearSession()
    setShowSetup(true)
  }

  async function savePreset(name) {
    const { error } = await createPreset(user.id, name, { tools: [...activeIds] })
    setShowSaveModal(false)
    if (!error) {
      setSaveMsg(profile?.is_admin ? 'Preset gardado' : 'Preset enviado para aprobación')
      setTimeout(() => setSaveMsg(''), 3000)
    }
  }

  if (showSetup) {
    return (
      <SessionSetup
        onDone={() => setShowSetup(false)}
        onSkip={() => setShowSetup(false)}
      />
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="section-title">Ferramentas de partida</h1>
          <p className="section-subtitle flex items-center gap-2 flex-wrap">
            {session?.game && <span>🎲 {session.game.name}</span>}
            {session?.players?.length > 0 && (
              <span className="flex items-center gap-1"><Users size={11} /> {session.players.map(p => p.name).join(', ')}</span>
            )}
            {!session?.game && !session?.players?.length && 'Utilidades para as túas sesións de xogo'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saveMsg && <span className="text-xogun-accent text-xs">{saveMsg}</span>}
          {user && session?.game && (
            <button onClick={() => setShowSaveModal(true)} className="btn-ghost flex items-center gap-1.5 text-xs">
              <Save size={13} /> Gardar preset
            </button>
          )}
          {presets.length > 0 && (
            <span className="btn-ghost flex items-center gap-1.5 text-xs cursor-default">
              <Bookmark size={13} /> {presets.length} preset{presets.length > 1 ? 's' : ''}
            </span>
          )}
          <button onClick={endSession} className="btn-ghost flex items-center gap-1.5 text-xs">
            <Gamepad2 size={13} /> Nova sesión
          </button>
        </div>
      </div>

      {layoutMode === 'desktop' ? (
        <GridView widgets={widgets} allWidgets={allWidgets} activeIds={activeIds} onToggle={toggle} />
      ) : (
        <TabbedView widgets={widgets} allWidgets={allWidgets} activeIds={activeIds} onToggle={toggle} tall={layoutMode === 'mobile'} />
      )}

      {showSaveModal && <SavePresetModal onSave={savePreset} onClose={() => setShowSaveModal(false)} />}
    </div>
  )
}

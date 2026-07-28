import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RefreshCw, Plus } from 'lucide-react'

const PRESETS = [
  { label: '30s', secs: 30 },
  { label: '1m', secs: 60 },
  { label: '2m', secs: 120 },
  { label: '5m', secs: 300 },
  { label: '10m', secs: 600 },
  { label: '20m', secs: 1200 },
  { label: '30m', secs: 1800 },
]

export default function TimerWidget() {
  const [mode, setMode]           = useState('countdown')
  const [running, setRunning]     = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)     // tempo transcorrido dende o inicio (cronómetro) ou consumido (conta atrás)
  const [presetSecs, setPresetSecs] = useState(300)
  const [showCustom, setShowCustom] = useState(false)
  const [customMin, setCustomMin] = useState('')
  const [customSec, setCustomSec] = useState('')

  const rafRef = useRef(null)
  const startTsRef = useRef(null)      // timestamp (performance.now) de inicio do tramo actual
  const baseElapsedRef = useRef(0)     // ms acumulados antes do tramo actual (para pausas)

  useEffect(() => {
    if (!running) { cancelAnimationFrame(rafRef.current); return }
    startTsRef.current = performance.now()
    function tick() {
      const now = performance.now()
      const currentElapsed = baseElapsedRef.current + (now - startTsRef.current)
      if (mode === 'countdown') {
        const remaining = presetSecs * 1000 - currentElapsed
        if (remaining <= 0) {
          setElapsedMs(presetSecs * 1000)
          setRunning(false)
          return
        }
      }
      setElapsedMs(currentElapsed)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [running, mode, presetSecs])

  function start() {
    if (mode === 'countdown' && elapsedMs >= presetSecs * 1000) { baseElapsedRef.current = 0; setElapsedMs(0) }
    else baseElapsedRef.current = elapsedMs
    setRunning(true)
  }
  function pause() { setRunning(false); baseElapsedRef.current = elapsedMs }
  function reset() { setRunning(false); baseElapsedRef.current = 0; setElapsedMs(0) }
  function switchMode(m) { setRunning(false); baseElapsedRef.current = 0; setMode(m); setElapsedMs(0) }
  function selectPreset(s) { setPresetSecs(s); setRunning(false); baseElapsedRef.current = 0; setElapsedMs(0); setShowCustom(false) }

  function applyCustom() {
    const m = parseInt(customMin) || 0
    const s = parseInt(customSec) || 0
    const total = m * 60 + s
    if (total <= 0) return
    selectPreset(total)
    setCustomMin(''); setCustomSec('')
  }

  // Tempo a amosar: conta atrás = restante, cronómetro = transcorrido
  const displayMs = mode === 'countdown' ? Math.max(0, presetSecs * 1000 - elapsedMs) : elapsedMs
  const totalSecs = Math.floor(displayMs / 1000)
  const mins = Math.floor(totalSecs / 60).toString().padStart(2, '0')
  const secs = (totalSecs % 60).toString().padStart(2, '0')
  const centis = Math.floor((displayMs % 1000) / 10).toString().padStart(2, '0')

  const danger = mode === 'countdown' && totalSecs <= 30 && displayMs > 0
  const done   = mode === 'countdown' && displayMs === 0 && !running && elapsedMs > 0
  const progress = mode === 'countdown' && presetSecs > 0 ? elapsedMs / (presetSecs * 1000) : 0

  return (
    <div className="space-y-5">
      {/* Mode */}
      <div className="flex rounded-lg overflow-hidden border border-xogun-border w-fit mx-auto">
        {[['countdown', 'Conta atrás'], ['stopwatch', 'Cronómetro']].map(([m, label]) => (
          <button key={m} onClick={() => switchMode(m)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${mode === m ? 'bg-xogun-accent text-xogun-bg' : 'text-xogun-muted hover:text-xogun-text bg-xogun-surface'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Presets + custom */}
      {mode === 'countdown' && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5 justify-center">
            {PRESETS.map(p => (
              <button key={p.secs} onClick={() => selectPreset(p.secs)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${presetSecs === p.secs && !showCustom ? 'bg-xogun-accent text-xogun-bg' : 'bg-xogun-surface text-xogun-muted border border-xogun-border hover:border-xogun-accent'}`}>
                {p.label}
              </button>
            ))}
            <button onClick={() => setShowCustom(s => !s)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${showCustom ? 'bg-xogun-accent text-xogun-bg' : 'bg-xogun-surface text-xogun-muted border border-xogun-border hover:border-xogun-accent'}`}>
              <Plus size={11} /> Personalizado
            </button>
          </div>
          {showCustom && (
            <div className="flex items-center gap-2 justify-center animate-fade-in">
              <input type="number" min={0} max={99} placeholder="min" value={customMin}
                onChange={e => setCustomMin(e.target.value)}
                className="input w-16 text-center" />
              <span className="text-xogun-muted text-sm">:</span>
              <input type="number" min={0} max={59} placeholder="seg" value={customSec}
                onChange={e => setCustomSec(e.target.value)}
                className="input w-16 text-center" />
              <button onClick={applyCustom} className="btn-secondary text-xs px-3">Usar</button>
            </div>
          )}
        </div>
      )}

      {/* Circular progress + time */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <svg width="160" height="160" className="-rotate-90">
            <circle cx="80" cy="80" r="68" fill="none" stroke="#2e2a45" strokeWidth="8" />
            {mode === 'countdown' && (
              <circle cx="80" cy="80" r="68" fill="none"
                stroke={done ? '#d4463a' : danger ? '#d4463a' : '#c8a96e'}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 68}`}
                strokeDashoffset={`${2 * Math.PI * 68 * (1 - progress)}`}
                style={{ transition: running ? 'none' : 'stroke-dashoffset 0.3s ease, stroke 0.3s ease' }} />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-display text-4xl font-bold transition-colors tabular-nums ${done ? 'text-xogun-red animate-pulse' : danger ? 'text-xogun-red' : 'text-xogun-accent'}`}>
              {mins}:{secs}
            </span>
            <span className="text-xogun-muted text-xs font-mono tabular-nums mt-0.5">.{centis}</span>
            {done && <span className="text-xogun-red text-xs mt-1 font-medium">⏰ Tempo!</span>}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 items-center">
          <button onClick={reset} className="w-11 h-11 rounded-full bg-xogun-surface border border-xogun-border flex items-center justify-center text-xogun-muted hover:text-xogun-text transition-colors">
            <RefreshCw size={16} />
          </button>
          <button onClick={running ? pause : start}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-colors"
            style={{ background: 'linear-gradient(135deg,#e8c766,#8a742f)', color: '#1a1508' }}>
            {running ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <div className="w-11" />
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RefreshCw } from 'lucide-react'

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
  const [mode, setMode]       = useState('countdown')
  const [running, setRunning] = useState(false)
  const [time, setTime]       = useState(300)
  const [preset, setPreset]   = useState(300)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTime(t => {
          if (mode === 'countdown') {
            if (t <= 1) { setRunning(false); return 0 }
            return t - 1
          }
          return t + 1
        })
      }, 1000)
    } else clearInterval(intervalRef.current)
    return () => clearInterval(intervalRef.current)
  }, [running, mode])

  function start() { if (mode === 'countdown' && time === 0) setTime(preset); setRunning(true) }
  function pause() { setRunning(false) }
  function reset() { setRunning(false); setTime(mode === 'countdown' ? preset : 0) }
  function switchMode(m) { setRunning(false); setMode(m); setTime(m === 'countdown' ? preset : 0) }
  function selectPreset(s) { setPreset(s); setTime(s); setRunning(false) }

  const mins = Math.floor(time / 60).toString().padStart(2, '0')
  const secs = (time % 60).toString().padStart(2, '0')
  const danger = mode === 'countdown' && time <= 30 && time > 0
  const done   = mode === 'countdown' && time === 0 && !running
  const progress = mode === 'countdown' && preset > 0 ? (preset - time) / preset : 0

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

      {/* Presets */}
      {mode === 'countdown' && (
        <div className="flex flex-wrap gap-1.5 justify-center">
          {PRESETS.map(p => (
            <button key={p.secs} onClick={() => selectPreset(p.secs)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${preset === p.secs ? 'bg-xogun-accent text-xogun-bg' : 'bg-xogun-surface text-xogun-muted border border-xogun-border hover:border-xogun-accent'}`}>
              {p.label}
            </button>
          ))}
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
                style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }} />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-display text-4xl font-bold transition-colors ${done ? 'text-xogun-red animate-pulse' : danger ? 'text-xogun-red' : 'text-xogun-accent'}`}>
              {mins}:{secs}
            </span>
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

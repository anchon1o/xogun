import { useState, useRef, useEffect } from 'react'
import { Shuffle, RotateCcw, Plus, Trash2 } from 'lucide-react'
import { useGameSession } from '../../contexts/GameSessionContext'

const COLORS = ['#c8a96e','#6e8dc8','#6ec87e','#c86e6e','#c86ec8','#6ec8c8','#c8b46e','#8e6ec8']
const SUITS = ['♠', '♥', '♦', '♣']

function playersFromSession(sessionPlayers) {
  return sessionPlayers.map(p => ({ id: p.id, name: p.name, color: p.color }))
}

// Ruleta visual xiratoria
function RouletteMode({ players }) {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [winner, setWinner] = useState(null)
  const wheelRef = useRef(null)

  const sliceAngle = 360 / Math.max(players.length, 1)

  function spin() {
    if (players.length < 2 || spinning) return
    setSpinning(true)
    setWinner(null)
    const winnerIndex = Math.floor(Math.random() * players.length)
    // Xiro grande + aliñar para que a frecha (arriba) caia no centro do sector gañador
    const targetAngle = 360 * 5 + (360 - (winnerIndex * sliceAngle + sliceAngle / 2))
    setRotation(r => r + targetAngle)
    setTimeout(() => {
      setSpinning(false)
      setWinner(players[winnerIndex])
    }, 3200)
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-64 h-64">
        {/* Frecha */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 w-0 h-0
          border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-xogun-accent" />
        <svg ref={wheelRef} viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg"
          style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 3.2s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none' }}>
          {players.map((p, i) => {
            const startAngle = (i * sliceAngle - 90) * Math.PI / 180
            const endAngle = ((i + 1) * sliceAngle - 90) * Math.PI / 180
            const x1 = 100 + 95 * Math.cos(startAngle), y1 = 100 + 95 * Math.sin(startAngle)
            const x2 = 100 + 95 * Math.cos(endAngle), y2 = 100 + 95 * Math.sin(endAngle)
            const largeArc = sliceAngle > 180 ? 1 : 0
            const midAngle = (startAngle + endAngle) / 2
            const textX = 100 + 62 * Math.cos(midAngle), textY = 100 + 62 * Math.sin(midAngle)
            return (
              <g key={p.id}>
                <path d={`M100,100 L${x1},${y1} A95,95 0 ${largeArc} 1 ${x2},${y2} Z`}
                  fill={p.color} stroke="#0f0e17" strokeWidth="1.5" />
                <text x={textX} y={textY} fill="#181206" fontSize="11" fontWeight="700" textAnchor="middle"
                  transform={`rotate(${midAngle * 180 / Math.PI + 90}, ${textX}, ${textY})`}>
                  {p.name.length > 10 ? p.name.slice(0, 9) + '…' : p.name}
                </text>
              </g>
            )
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-xogun-bg border-2 border-xogun-accent" />
        </div>
      </div>

      {winner && !spinning && (
        <div className="text-center animate-fade-in">
          <p className="text-xogun-muted text-xs uppercase tracking-wider">Empeza</p>
          <p className="font-display text-2xl text-xogun-accent">{winner.name}</p>
        </div>
      )}

      <button onClick={spin} disabled={players.length < 2 || spinning}
        className="btn-primary flex items-center gap-2 px-6 py-2.5 disabled:opacity-50">
        <Shuffle size={15} /> {spinning ? 'Xirando...' : 'Xirar ruleta'}
      </button>
      {players.length < 2 && <p className="text-xogun-muted text-xs">Engade polo menos 2 xogadores</p>}
    </div>
  )
}

// Carta máis alta
function CardMode({ players }) {
  const [draws, setDraws] = useState(null)
  const [revealing, setRevealing] = useState(false)

  function draw() {
    if (players.length < 2) return
    setRevealing(true)
    const results = players.map(p => ({
      ...p,
      value: Math.floor(Math.random() * 13) + 1,
      suit: SUITS[Math.floor(Math.random() * 4)],
    }))
    setTimeout(() => { setDraws(results); setRevealing(false) }, 600)
  }

  const cardLabel = v => v === 1 ? 'A' : v === 11 ? 'J' : v === 12 ? 'Q' : v === 13 ? 'K' : v
  const winner = draws ? [...draws].sort((a, b) => b.value - a.value)[0] : null

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap gap-3 justify-center min-h-[100px] items-center">
        {(draws || players).map(p => {
          const isWinner = draws && winner?.id === p.id
          return (
            <div key={p.id} className={`flex flex-col items-center gap-1.5 transition-transform ${isWinner ? 'scale-110' : ''}`}>
              <div className={`w-16 h-22 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-300
                ${isWinner ? 'border-xogun-accent bg-xogun-accent/10' : 'border-xogun-border bg-xogun-surface'}`}
                style={{ height: 88, color: p.suit === '♥' || p.suit === '♦' ? '#d4463a' : 'var(--xogun-text)' }}>
                {draws ? (
                  <>
                    <span className="font-display text-xl font-bold">{cardLabel(p.value)}</span>
                    <span className="text-lg">{p.suit}</span>
                  </>
                ) : <span className="text-2xl opacity-30">🂠</span>}
              </div>
              <span className="text-xs text-xogun-muted max-w-[70px] truncate">{p.name}</span>
            </div>
          )
        })}
      </div>

      {winner && (
        <div className="text-center animate-fade-in">
          <p className="text-xogun-muted text-xs uppercase tracking-wider">Empeza</p>
          <p className="font-display text-2xl text-xogun-accent">{winner.name}</p>
        </div>
      )}

      <button onClick={draw} disabled={players.length < 2 || revealing}
        className="btn-primary flex items-center gap-2 px-6 py-2.5 disabled:opacity-50">
        <Shuffle size={15} /> {revealing ? 'Repartindo...' : draws ? 'Repetir' : 'Repartir cartas'}
      </button>
      {players.length < 2 && <p className="text-xogun-muted text-xs">Engade polo menos 2 xogadores</p>}
    </div>
  )
}

// Último dedo — multitouch: cada xogador pon un dedo, conta atrás e elimina
// todos menos un ao chou. Só ten sentido en pantallas táctiles.
function FingerMode() {
  const [touches, setTouches] = useState([])
  const [countdown, setCountdown] = useState(null)
  const [winnerTouch, setWinnerTouch] = useState(null)
  const areaRef = useRef(null)
  const timerRef = useRef(null)

  function handleTouchStart(e) {
    if (countdown !== null || winnerTouch) return
    const rect = areaRef.current.getBoundingClientRect()
    const newTouches = Array.from(e.touches).map(t => ({
      id: t.identifier,
      x: t.clientX - rect.left,
      y: t.clientY - rect.top,
      color: COLORS[t.identifier % COLORS.length],
    }))
    setTouches(newTouches)

    clearTimeout(timerRef.current)
    if (newTouches.length >= 2) {
      timerRef.current = setTimeout(() => startCountdown(newTouches), 1200)
    }
  }

  function handleTouchMove(e) {
    if (countdown !== null || winnerTouch) return
    const rect = areaRef.current.getBoundingClientRect()
    setTouches(Array.from(e.touches).map(t => ({
      id: t.identifier,
      x: t.clientX - rect.left,
      y: t.clientY - rect.top,
      color: COLORS[t.identifier % COLORS.length],
    })))
  }

  function handleTouchEnd(e) {
    if (countdown !== null || winnerTouch) return
    clearTimeout(timerRef.current)
    const rect = areaRef.current.getBoundingClientRect()
    const remaining = Array.from(e.touches).map(t => ({
      id: t.identifier,
      x: t.clientX - rect.left,
      y: t.clientY - rect.top,
      color: COLORS[t.identifier % COLORS.length],
    }))
    setTouches(remaining)
  }

  function startCountdown(finalTouches) {
    let n = 3
    setCountdown(n)
    const tick = setInterval(() => {
      n -= 1
      if (n <= 0) {
        clearInterval(tick)
        setCountdown(null)
        const winner = finalTouches[Math.floor(Math.random() * finalTouches.length)]
        setWinnerTouch(winner)
      } else {
        setCountdown(n)
      }
    }, 700)
  }

  function reset() {
    setTouches([])
    setCountdown(null)
    setWinnerTouch(null)
    clearTimeout(timerRef.current)
  }

  return (
    <div className="space-y-3">
      <p className="text-xogun-muted text-xs text-center">
        Cada xogador pon un dedo na área de abaixo (necesítanse polo menos 2). Cando todos estean listos, comeza a conta atrás automaticamente.
      </p>
      <div
        ref={areaRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full rounded-2xl bg-xogun-surface border-2 border-dashed border-xogun-border overflow-hidden touch-none select-none"
        style={{ height: 320 }}>
        {touches.length === 0 && !winnerTouch && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xogun-muted text-sm">👆 Toca aquí con varios dedos á vez</span>
          </div>
        )}
        {touches.map(t => (
          <div key={t.id}
            className="absolute w-14 h-14 rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-opacity"
            style={{
              left: t.x, top: t.y,
              backgroundColor: winnerTouch && winnerTouch.id !== t.id ? 'transparent' : t.color + 'aa',
              border: `3px solid ${t.color}`,
              opacity: winnerTouch && winnerTouch.id !== t.id ? 0.15 : 1,
            }} />
        ))}
        {winnerTouch && (
          <div className="absolute w-20 h-20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"
            style={{ left: winnerTouch.x, top: winnerTouch.y, backgroundColor: winnerTouch.color, boxShadow: `0 0 30px ${winnerTouch.color}` }} />
        )}
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-display text-7xl text-white drop-shadow-lg">{countdown}</span>
          </div>
        )}
      </div>

      {winnerTouch && (
        <div className="text-center animate-fade-in">
          <p className="text-xogun-muted text-xs uppercase tracking-wider">Dedo gañador</p>
          <p className="font-display text-xl" style={{ color: winnerTouch.color }}>🎉 ¡Empeza este xogador!</p>
        </div>
      )}

      <button onClick={reset} className="btn-secondary flex items-center gap-1.5 text-xs mx-auto">
        <RotateCcw size={12} /> Reiniciar
      </button>
    </div>
  )
}

// Voz — cada xogador grava un clip curto (o seu nome, dito en voz alta)
// e ao final reprodúcese o clip da persoa elixida ao chou. Non se transcribe
// nada — só se garda e reproduce o audio tal cal.
function VoiceMode() {
  const [recordings, setRecordings] = useState([]) // [{ id, blobUrl }]
  const [recording, setRecording] = useState(false)
  const [winner, setWinner] = useState(null)
  const [playingId, setPlayingId] = useState(null)
  const [supported, setSupported] = useState(true)
  const [error, setError] = useState('')
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) setSupported(false)
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
      recordings.forEach(r => URL.revokeObjectURL(r.blobUrl))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function startRecording() {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = e => chunksRef.current.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const blobUrl = URL.createObjectURL(blob)
        setRecordings(r => [...r, { id: crypto.randomUUID(), blobUrl }])
        stream.getTracks().forEach(t => t.stop())
      }
      mediaRecorderRef.current = recorder
      recorder.start()
      setRecording(true)
      // Corta automaticamente aos 3 segundos — un clip curto abonda
      setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop()
        setRecording(false)
      }, 3000)
    } catch {
      setError('Non se puido acceder ao micrófono. Comproba os permisos do navegador.')
      setSupported(false)
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop()
    setRecording(false)
  }

  function removeRecording(id) {
    setRecordings(r => {
      const target = r.find(x => x.id === id)
      if (target) URL.revokeObjectURL(target.blobUrl)
      return r.filter(x => x.id !== id)
    })
  }

  function playClip(id, url) {
    if (audioRef.current) audioRef.current.pause()
    const audio = new Audio(url)
    audioRef.current = audio
    setPlayingId(id)
    audio.onended = () => setPlayingId(null)
    audio.play()
  }

  function pickWinner() {
    if (recordings.length < 2) return
    setWinner(recordings[Math.floor(Math.random() * recordings.length)])
  }

  function reset() {
    recordings.forEach(r => URL.revokeObjectURL(r.blobUrl))
    setRecordings([])
    setWinner(null)
    setPlayingId(null)
  }

  useEffect(() => {
    if (winner) playClip(winner.id, winner.blobUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner])

  if (!supported) {
    return (
      <div className="text-center py-8 space-y-2">
        <p className="text-xogun-muted text-sm">O teu navegador non permite gravar audio, ou denegouse o permiso do micrófono.</p>
        {error && <p className="text-xogun-red text-xs">{error}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-sm mx-auto text-center">
      <p className="text-xogun-muted text-xs">
        Cada xogador grava un clip curto (3s) dicindo o que queira — o seu nome, un "ei!", o que sexa.
        Ao final reproducirase o clip da persoa elixida ao chou.
      </p>

      <button onClick={recording ? stopRecording : startRecording}
        className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all ${recording ? 'bg-xogun-red animate-pulse' : 'bg-xogun-accent'}`}>
        <span className="text-3xl">{recording ? '⏺️' : '🎤'}</span>
      </button>
      <p className="text-xogun-muted text-xs">{recording ? 'Gravando... (3s)' : `Preme para gravar o xogador ${recordings.length + 1}`}</p>
      {error && <p className="text-xogun-red text-xs">{error}</p>}

      {recordings.length > 0 && (
        <div className="space-y-1.5">
          {recordings.map((r, i) => (
            <div key={r.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-xogun-surface border border-xogun-border">
              <button onClick={() => playClip(r.id, r.blobUrl)} className="text-xogun-accent flex-shrink-0">
                {playingId === r.id ? '🔊' : '▶️'}
              </button>
              <span className="flex-1 text-sm text-left">Xogador {i + 1}</span>
              <button onClick={() => removeRecording(r.id)} className="text-xogun-muted hover:text-xogun-red"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      )}

      {winner && (
        <div className="text-center animate-fade-in">
          <p className="text-xogun-muted text-xs uppercase tracking-wider">Empeza este xogador</p>
          <button onClick={() => playClip(winner.id, winner.blobUrl)} className="font-display text-2xl text-xogun-accent flex items-center gap-2 mx-auto">
            🔊 Reproducir de novo
          </button>
        </div>
      )}

      <div className="flex gap-2 justify-center">
        <button onClick={reset} className="btn-secondary flex items-center gap-1.5 text-xs"><RotateCcw size={12} /> Reiniciar</button>
        <button onClick={pickWinner} disabled={recordings.length < 2}
          className="btn-primary flex items-center gap-2 disabled:opacity-50">
          <Shuffle size={14} /> Elixir gañador
        </button>
      </div>
      {recordings.length < 2 && recordings.length > 0 && <p className="text-xogun-muted text-xs">Necesítanse polo menos 2 gravacións</p>}
    </div>
  )
}

export default function FirstPlayerWidget() {
  const session = useGameSession()
  const hasSession = session?.hasActiveSession

  const [mode, setMode] = useState('roulette') // 'roulette' | 'cards' | 'finger' | 'voice'
  const [localNames, setLocalNames] = useState(['', ''])

  const players = hasSession
    ? playersFromSession(session.players)
    : localNames.filter(n => n.trim()).map((n, i) => ({ id: `l${i}`, name: n, color: COLORS[i % COLORS.length] }))

  function addPlayer() { setLocalNames(n => [...n, '']) }
  function removePlayer(i) { setLocalNames(n => n.filter((_, j) => j !== i)) }
  function updatePlayer(i, val) { setLocalNames(n => n.map((x, j) => j === i ? val : x)) }

  const showPlayerSetup = mode !== 'finger' && mode !== 'voice'

  return (
    <div className="space-y-5">
      {showPlayerSetup && (hasSession ? (
        <p className="text-xogun-muted text-xs">
          Usando xogadores da sesión activa {session.game ? `· ${session.game.name}` : ''}
        </p>
      ) : (
        <div className="space-y-2 max-w-xs mx-auto">
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
      ))}

      {/* Mode selector */}
      <div className="flex rounded-lg overflow-hidden border border-xogun-border w-fit mx-auto flex-wrap">
        {[['roulette', '🎡 Ruleta'], ['cards', '🃏 Carta máis alta'], ['finger', '👆 Último dedo'], ['voice', '🎤 Voz']].map(([m, label]) => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${mode === m ? 'bg-xogun-accent text-xogun-bg' : 'text-xogun-muted hover:text-xogun-text bg-xogun-surface'}`}>
            {label}
          </button>
        ))}
      </div>

      {mode === 'roulette' ? <RouletteMode players={players} />
        : mode === 'cards' ? <CardMode players={players} />
        : mode === 'finger' ? <FingerMode />
        : <VoiceMode />}
    </div>
  )
}

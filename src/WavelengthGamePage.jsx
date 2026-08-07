import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Copy, Share2, LogIn } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useWavelengthGame, createWavelengthGame } from '../hooks/useWavelengthGame'

const LAST_CODE_KEY = 'xogun-last-escala-code'
function saveLastCode(code) { try { localStorage.setItem(LAST_CODE_KEY, code) } catch {} }
function loadLastCode() { try { return localStorage.getItem(LAST_CODE_KEY) } catch { return null } }

function EntryScreen() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [joinCode, setJoinCode] = useState('')
  const [creating, setCreating] = useState(false)

  const lastCode = loadLastCode()

  function handleJoin() {
    if (joinCode.trim().length < 4) return
    navigate(`/escala/${joinCode.trim().toUpperCase()}`)
  }

  async function handleCreate() {
    if (!user) return
    setCreating(true)
    const { data, error } = await createWavelengthGame(user.id)
    setCreating(false)
    if (error || !data) return
    navigate(`/escala/${data.code}`)
  }

  return (
    <div className="max-w-sm mx-auto py-10 text-center space-y-6">
      <div>
        <span className="text-4xl">🎯</span>
        <h1 className="font-display text-2xl text-xogun-accent mt-2">Escala</h1>
        <p className="text-xogun-muted text-sm mt-1">
          A psíquica ve un obxectivo secreto nun dial e o grupo adivina a posición. Cada xogador
          participa desde o seu propio móbil.
        </p>
      </div>

      {lastCode && (
        <button onClick={() => navigate(`/escala/${lastCode}`)}
          className="w-full card flex items-center justify-between hover:border-xogun-accent/50 transition-colors">
          <span className="text-sm text-xogun-muted">Última sala</span>
          <span className="font-display text-lg tracking-widest text-xogun-accent">{lastCode}</span>
        </button>
      )}

      {user && (
        <button onClick={handleCreate} disabled={creating}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50">
          <Plus size={16} /> {creating ? 'Creando...' : 'Crear nova partida'}
        </button>
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-xogun-border" />
        <span className="text-xogun-muted text-xs">ou</span>
        <div className="flex-1 h-px bg-xogun-border" />
      </div>

      <div className="space-y-2">
        <input className="input text-center tracking-widest font-display text-lg uppercase" placeholder="CÓDIGO"
          maxLength={8} value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && handleJoin()} />
        <button onClick={handleJoin} disabled={joinCode.trim().length < 4}
          className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50">
          <LogIn size={15} /> Unirse cunha sala
        </button>
      </div>
    </div>
  )
}

function RoomScreen({ code }) {
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const wavelength = useWavelengthGame(code, user?.id)
  const [copied, setCopied] = useState(false)

  useEffect(() => { saveLastCode(code.toUpperCase()) }, [code])

  if (wavelength.loading) return <p className="text-xogun-muted text-sm text-center py-16">Cargando sala...</p>

  if (wavelength.notFound) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-xogun-muted text-sm">Non se atopou ningunha sala co código <strong>{code}</strong>.</p>
        <button onClick={() => navigate('/escala')} className="btn-primary">Volver</button>
      </div>
    )
  }

  const { game, players, myPlayer, isHost, guess, setGuess, submitGuess, nextRound } = wavelength

  function copyCode() {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function shareLink() {
    const url = `${window.location.origin}/escala/${code}`
    navigator.clipboard?.writeText(url)
    toast.success('Enlace copiado — compárteo cos xogadores')
  }

  async function handleSubmitGuess() {
    const { error } = await submitGuess()
    if (error) toast.error('Non se puido rexistrar a túa posición')
  }

  async function handleNextRound() {
    const { error } = await nextRound()
    if (error) toast.error('Non se puido avanzar á seguinte rolda')
  }

  const isPsychic = game?.psychic_id === user?.id

  return (
    <div className="max-w-md mx-auto space-y-5">
      {/* Cabeceira */}
      <div className="text-center space-y-1">
        <h1 className="font-display text-xl text-xogun-text">Escala</h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="font-display text-2xl tracking-widest text-xogun-accent">{code}</span>
          <button onClick={copyCode} className="text-xogun-muted hover:text-xogun-accent"><Copy size={15} /></button>
          <button onClick={shareLink} className="text-xogun-muted hover:text-xogun-accent"><Share2 size={15} /></button>
        </div>
        {copied && <p className="text-xogun-accent text-[10px]">Código copiado</p>}
      </div>

      {/* Rolda e estado */}
      {game && (
        <div className="card text-center space-y-1">
          <p className="text-xogun-muted text-xs">Rolda {game.round ?? 1}</p>
          <p className="text-xogun-text text-sm font-medium">
            {isPsychic ? '🎯 Es a psíquica desta rolda' : '👥 Adivina a posición'}
          </p>
          {isPsychic && game.target != null && (
            <p className="text-xogun-accent text-xs mt-1">
              O teu obxectivo secreto está en: <strong>{game.target}</strong>/100
            </p>
          )}
        </div>
      )}

      {/* Concepto do dial */}
      {game?.left_concept && game?.right_concept && (
        <div className="card flex items-center justify-between text-sm">
          <span className="text-xogun-muted">{game.left_concept}</span>
          <span className="text-xogun-muted text-xs">◄──────────────►</span>
          <span className="text-xogun-muted">{game.right_concept}</span>
        </div>
      )}

      {/* Slider de adiviña (non psíquica) */}
      {game && !isPsychic && game.status === 'guessing' && (
        <div className="card space-y-3">
          <label className="label mb-0">A túa posición</label>
          <input type="range" min={0} max={100} value={guess ?? 50}
            onChange={e => setGuess(Number(e.target.value))}
            className="w-full" style={{ accentColor: '#c8a96e' }} />
          <div className="flex justify-between text-xogun-muted text-xs">
            <span>0</span>
            <span className="text-xogun-accent font-medium">{guess ?? 50}</span>
            <span>100</span>
          </div>
          <button onClick={handleSubmitGuess} className="btn-primary w-full">
            Confirmar posición
          </button>
        </div>
      )}

      {/* Resultados */}
      {game?.status === 'results' && (
        <div className="card space-y-3">
          <p className="label mb-0">Resultados</p>
          <p className="text-xogun-accent text-sm">
            Obxectivo: <strong>{game.target}</strong>/100
          </p>
          {players.map(p => p.guess != null && (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span className="text-xogun-text">{p.name}</span>
              <span className="text-xogun-muted">{p.guess}/100</span>
              <span className={`text-xs font-medium ${Math.abs(p.guess - game.target) <= 5 ? 'text-green-400' : Math.abs(p.guess - game.target) <= 15 ? 'text-xogun-accent' : 'text-xogun-muted'}`}>
                {Math.abs(p.guess - game.target) <= 5 ? '🎯 Exacto' : Math.abs(p.guess - game.target) <= 15 ? '✅ Preto' : '❌ Lonxe'}
              </span>
            </div>
          ))}
          {isHost && (
            <button onClick={handleNextRound} className="btn-primary w-full mt-2">
              Seguinte rolda
            </button>
          )}
        </div>
      )}

      {/* Lista de xogadores */}
      <div className="space-y-2">
        <p className="label">Xogadores ({players.length})</p>
        {players.map(p => (
          <div key={p.id} className="card flex items-center justify-between py-2.5">
            <span className="text-sm text-xogun-text">{p.name}</span>
            <div className="flex items-center gap-2">
              {game?.psychic_id === p.user_id && <span className="text-xs text-xogun-accent">Psíquica</span>}
              {game?.status === 'guessing' && (
                <span className={`text-xs ${p.guess != null ? 'text-green-400' : 'text-xogun-muted'}`}>
                  {p.guess != null ? '✓' : '…'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/escala')} className="btn-ghost w-full text-xs">← Saír da sala</button>
    </div>
  )
}

export default function WavelengthGamePage() {
  const { code } = useParams()
  return code ? <RoomScreen code={code} /> : <EntryScreen />
}

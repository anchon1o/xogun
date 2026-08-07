import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Copy, Share2, LogIn, Play } from 'lucide-react'
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
          A psíquica ve un obxectivo secreto nun dial e o grupo adivina a posición
          desde os seus propios móbiles.
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
        <input className="input text-center tracking-widest font-display text-lg uppercase"
          placeholder="CÓDIGO" maxLength={8}
          value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
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
  const w = useWavelengthGame(code, user?.id)
  const [copied, setCopied] = useState(false)

  useEffect(() => { saveLastCode(code.toUpperCase()) }, [code])

  if (w.loading) return <p className="text-xogun-muted text-sm text-center py-16">Cargando sala...</p>

  if (w.notFound) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-xogun-muted text-sm">
          Non se atopou ningunha sala co código <strong>{code}</strong>.
        </p>
        <button onClick={() => navigate('/escala')} className="btn-primary">Volver</button>
      </div>
    )
  }

  const { game, players, isHost, isPsychic, guess, setGuess, myGuess } = w

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

  async function handleStartGame() {
    const { error } = await w.startGame()
    if (error) toast.error('Non se puido iniciar a partida')
  }

  async function handleSubmitGuess() {
    const { error } = await w.submitGuess()
    if (error) toast.error('Non se puido rexistrar a túa posición')
    else toast.success('Posición gardada')
  }

  async function handleShowResults() {
    const { error } = await w.showResults()
    if (error) toast.error('Non se puido mostrar os resultados')
  }

  async function handleNextRound() {
    const { error } = await w.nextRound()
    if (error) toast.error('Non se puido avanzar á seguinte rolda')
  }

  async function handleDelete() {
    if (!confirm('Eliminar esta partida para todos?')) return
    await w.deleteGame()
    navigate('/escala')
  }

  const allGuessed = players.length > 0 && players.filter(p => p.user_id !== game?.psychic_id).every(p => {
    return w.myGuess != null || p.user_id === user?.id
  })

  return (
    <div className="max-w-md mx-auto space-y-5">
      {/* Cabeceira */}
      <div className="text-center space-y-1">
        <h1 className="font-display text-xl text-xogun-text">Escala</h1>
        <p className="text-xogun-muted text-xs">Rolda {game?.round ?? 1}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="font-display text-2xl tracking-widest text-xogun-accent">{code}</span>
          <button onClick={copyCode} className="text-xogun-muted hover:text-xogun-accent"><Copy size={15} /></button>
          <button onClick={shareLink} className="text-xogun-muted hover:text-xogun-accent"><Share2 size={15} /></button>
        </div>
        {copied && <p className="text-xogun-accent text-[10px]">Código copiado</p>}
      </div>

      {/* Sala de espera */}
      {game?.status === 'waiting' && (
        <div className="card text-center space-y-3">
          <p className="text-xogun-muted text-sm">
            {players.length} xogador{players.length !== 1 ? 'es' : ''} na sala. Agardando a que o anfitrión inicie.
          </p>
          {isHost && (
            <button onClick={handleStartGame} disabled={players.length < 2}
              className="btn-primary flex items-center gap-2 mx-auto disabled:opacity-50">
              <Play size={15} /> Iniciar partida
            </button>
          )}
          {isHost && players.length < 2 && (
            <p className="text-xogun-muted text-xs">Necesítanse polo menos 2 xogadores</p>
          )}
        </div>
      )}

      {/* Concepto do dial */}
      {game?.status !== 'waiting' && game?.left_concept && (
        <div className="card flex items-center justify-between text-sm gap-2">
          <span className="text-xogun-text font-medium">{game.left_concept}</span>
          <span className="text-xogun-border">◄──────►</span>
          <span className="text-xogun-text font-medium">{game.right_concept}</span>
        </div>
      )}

      {/* Obxectivo secreto — só para a psíquica */}
      {isPsychic && game?.status === 'guessing' && game?.target != null && (
        <div className="card border-xogun-accent/40 bg-xogun-accent/5 text-center space-y-1">
          <p className="text-xogun-muted text-xs">🎯 O teu obxectivo secreto está en</p>
          <p className="font-display text-3xl text-xogun-accent">{game.target}</p>
          <p className="text-xogun-muted text-xs">Dá unha pista sen dicir o número</p>
        </div>
      )}

      {/* Slider de adiviña — non psíquica */}
      {game?.status === 'guessing' && !isPsychic && myGuess == null && (
        <div className="card space-y-3">
          <label className="label mb-0">Onde cres que está o obxectivo?</label>
          <input type="range" min={0} max={100} value={guess}
            onChange={e => setGuess(Number(e.target.value))}
            className="w-full" style={{ accentColor: '#c8a96e' }} />
          <div className="flex justify-between text-xogun-muted text-xs">
            <span>0</span>
            <span className="text-xogun-accent font-medium text-base">{guess}</span>
            <span>100</span>
          </div>
          <button onClick={handleSubmitGuess} className="btn-primary w-full">
            Confirmar posición
          </button>
        </div>
      )}

      {/* Confirmación de adiviña enviada */}
      {game?.status === 'guessing' && !isPsychic && myGuess != null && (
        <div className="card text-center border-green-400/30 bg-green-400/5">
          <p className="text-green-400 text-sm">✓ Posición gardada: <strong>{myGuess}</strong></p>
          <p className="text-xogun-muted text-xs mt-1">Agardando ao resto de xogadores...</p>
        </div>
      )}

      {/* Botón de revelar resultados — anfitrión */}
      {isHost && game?.status === 'guessing' && (
        <button onClick={handleShowResults} className="btn-secondary w-full">
          Revelar resultados
        </button>
      )}

      {/* Resultados */}
      {game?.status === 'results' && (
        <div className="card space-y-3">
          <p className="label mb-0">Resultados — Obxectivo: <span className="text-xogun-accent font-display text-lg">{game.target}</span></p>
          {players
            .filter(p => p.user_id !== game.psychic_id)
            .map(p => {
              const playerGuess = p.user_id === user?.id ? myGuess : null
              const diff = playerGuess != null ? Math.abs(playerGuess - game.target) : null
              return (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-xogun-text">
                    {p.profiles?.display_name || 'Xogador'}
                    {p.user_id === user?.id && ' (ti)'}
                  </span>
                  <div className="flex items-center gap-2">
                    {playerGuess != null && <span className="text-xogun-muted">{playerGuess}</span>}
                    {diff != null && (
                      <span className={`text-xs font-medium ${diff <= 5 ? 'text-green-400' : diff <= 15 ? 'text-xogun-accent' : 'text-xogun-muted'}`}>
                        {diff <= 5 ? '🎯' : diff <= 15 ? '✅' : '❌'} ±{diff}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
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
            <span className="text-sm text-xogun-text">
              {p.profiles?.display_name || 'Xogador'}
              {p.user_id === user?.id && <span className="text-xogun-muted text-xs ml-1">(ti)</span>}
            </span>
            <div className="flex items-center gap-2">
              {game?.psychic_id === p.user_id && (
                <span className="text-xs text-xogun-accent">🎯 Psíquica</span>
              )}
              {isHost && p.user_id === game?.created_by && (
                <span className="text-xs text-xogun-muted">anfitrión</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {isHost && (
        <button onClick={handleDelete} className="btn-ghost w-full text-xogun-red text-xs">
          Eliminar partida
        </button>
      )}

      <button onClick={() => navigate('/escala')} className="btn-ghost w-full text-xs">
        ← Saír da sala
      </button>
    </div>
  )
}

export default function WavelengthGamePage() {
  const { code } = useParams()
  return code ? <RoomScreen code={code} /> : <EntryScreen />
}

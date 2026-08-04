import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Users, Plus, Trash2, Copy, Share2, Shuffle, RotateCcw, X,
  Skull, Eye, EyeOff, LogIn, Wand2,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useSocialGame, createSocialGame } from '../hooks/useSocialGame'
import { SOCIAL_PRESETS, buildRolePool, getRoleInfo } from '../lib/socialGamePresets'
import { UserAvatar } from '../hooks/useAvatars'

const TEAM_COLORS = { good: '#6ec87e', evil: '#c86e6e', neutral: '#c8a96e' }

const LAST_CODE_KEY = 'xogun-last-social-code'
function saveLastCode(code) { try { localStorage.setItem(LAST_CODE_KEY, code) } catch {} }
function loadLastCode() { try { return localStorage.getItem(LAST_CODE_KEY) } catch { return null } }

function EntryScreen() {
  const navigate = useNavigate()
  const [joinCode, setJoinCode] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const lastCode = loadLastCode()

  function handleJoin() {
    if (joinCode.trim().length < 4) return
    navigate(`/social/${joinCode.trim().toUpperCase()}`)
  }

  if (showCreate) return <CreateGameScreen onBack={() => setShowCreate(false)} />

  return (
    <div className="max-w-sm mx-auto py-10 text-center space-y-6">
      <div>
        <span className="text-4xl">🐺</span>
        <h1 className="font-display text-2xl text-xogun-accent mt-2">Xogo social</h1>
        <p className="text-xogun-muted text-sm mt-1">
          Reparte roles secretos directamente ao móbil de cada xogador — Lobo, Mafia, Blood on the
          Clocktower e máis, con anonimato garantido.
        </p>
      </div>

      {lastCode && (
        <button onClick={() => navigate(`/social/${lastCode}`)}
          className="w-full card flex items-center justify-between hover:border-xogun-accent/50 transition-colors">
          <span className="text-sm text-xogun-muted">Última sala</span>
          <span className="font-display text-lg tracking-widest text-xogun-accent">{lastCode}</span>
        </button>
      )}

      <button onClick={() => setShowCreate(true)} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
        <Plus size={16} /> Crear nova partida
      </button>

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

function CreateGameScreen({ onBack }) {
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [preset, setPreset] = useState('lobo')
  const [gameName, setGameName] = useState('')
  const [playerNames, setPlayerNames] = useState(['', '', '', ''])
  const [roles, setRoles] = useState(() => buildRolePool('lobo', 4))
  const [creating, setCreating] = useState(false)

  function selectPreset(id) {
    setPreset(id)
    const n = playerNames.filter(p => p.trim()).length || playerNames.length
    setRoles(buildRolePool(id, n))
  }

  function addPlayerSlot() { setPlayerNames(p => [...p, '']) }
  function removePlayerSlot(i) { setPlayerNames(p => p.filter((_, j) => j !== i)) }
  function updatePlayerSlot(i, val) { setPlayerNames(p => p.map((x, j) => j === i ? val : x)) }

  function regenerateRoles() {
    const n = playerNames.filter(p => p.trim()).length
    setRoles(buildRolePool(preset, n))
  }
  function addRoleSlot() { setRoles(r => [...r, '']) }
  function removeRoleSlot(i) { setRoles(r => r.filter((_, j) => j !== i)) }
  function updateRoleSlot(i, val) { setRoles(r => r.map((x, j) => j === i ? val : x)) }

  const validNames = playerNames.map(n => n.trim()).filter(Boolean)
  const validRoles = roles.map(r => r.trim()).filter(Boolean)
  const countsMatch = validNames.length >= 2 && validNames.length === validRoles.length

  async function handleCreate() {
    if (!countsMatch) return
    setCreating(true)
    const { data, error } = await createSocialGame(user.id, {
      name: gameName.trim(),
      preset,
      playerNames: validNames,
      rolePool: validRoles,
    })
    setCreating(false)
    if (error) { toast.error('Non se puido crear a partida — téntao de novo'); return }
    navigate(`/social/${data.code}`)
  }

  return (
    <div className="max-w-md mx-auto space-y-5">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="btn-ghost text-xs">← Volver</button>
        <h1 className="font-display text-lg text-xogun-accent flex-1">Nova partida social</h1>
      </div>

      <div>
        <label className="label">Tipo de xogo</label>
        <div className="flex flex-wrap gap-1.5">
          {SOCIAL_PRESETS.map(p => (
            <button key={p.id} onClick={() => selectPreset(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${preset === p.id ? 'border-xogun-accent text-xogun-accent bg-xogun-accent/10' : 'border-xogun-border text-xogun-muted'}`}>
              {p.label}
            </button>
          ))}
        </div>
        {preset === 'clocktower' && (
          <p className="text-xogun-muted text-[11px] mt-1.5">
            Reparte só os personaxes e a súa habilidade — non automatiza fases de noite nin efectos, iso lévao o grupo de viva voz.
          </p>
        )}
      </div>

      <div>
        <label className="label">Nome da partida (opcional)</label>
        <input className="input" placeholder="Ex: Lobo do sábado" value={gameName} onChange={e => setGameName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="label">Xogadores</label>
        {playerNames.map((n, i) => (
          <div key={i} className="flex gap-2">
            <input className="input flex-1" placeholder={`Xogador ${i + 1}`} value={n} onChange={e => updatePlayerSlot(i, e.target.value)} />
            {playerNames.length > 2 && (
              <button onClick={() => removePlayerSlot(i)} className="text-xogun-muted hover:text-xogun-red px-2"><Trash2 size={13} /></button>
            )}
          </div>
        ))}
        <button onClick={addPlayerSlot} className="btn-ghost flex items-center gap-1.5 text-xs">
          <Plus size={12} /> Engadir xogador
        </button>
        <p className="text-xogun-muted text-[11px]">
          Cada un abrirá esta app no seu propio móbil e tocará o seu nome para reclamar a súa praza.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="label mb-0">Roles a repartir</label>
          <button onClick={regenerateRoles} className="btn-ghost flex items-center gap-1 text-[11px]">
            <Wand2 size={11} /> Recalcular
          </button>
        </div>
        {roles.map((r, i) => (
          <div key={i} className="flex gap-2">
            <input className="input flex-1" placeholder="Nome do rol..." value={r} onChange={e => updateRoleSlot(i, e.target.value)} />
            <button onClick={() => removeRoleSlot(i)} className="text-xogun-muted hover:text-xogun-red px-2"><Trash2 size={13} /></button>
          </div>
        ))}
        <button onClick={addRoleSlot} className="btn-ghost flex items-center gap-1.5 text-xs">
          <Plus size={12} /> Engadir rol
        </button>
        <p className={`text-[11px] ${countsMatch ? 'text-xogun-accent' : 'text-xogun-red'}`}>
          {validRoles.length} roles / {validNames.length} xogadores {countsMatch ? '✓' : '— deben coincidir'}
        </p>
      </div>

      <button onClick={handleCreate} disabled={!countsMatch || creating}
        className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50">
        <Shuffle size={16} /> {creating ? 'Creando...' : 'Crear sala'}
      </button>
    </div>
  )
}

function PlayerSlot({ player, onClaim, canClaim, isMe, isHost, onToggleEliminated, onRemove }) {
  const claimed = !!player.claimed_by
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${isMe ? 'border-xogun-accent bg-xogun-accent/10' : 'border-xogun-border bg-xogun-surface'} ${player.eliminated ? 'opacity-50' : ''}`}>
      {claimed ? (
        <UserAvatar profile={player.profiles} size={28} />
      ) : (
        <div className="w-7 h-7 rounded-full bg-xogun-card flex items-center justify-center flex-shrink-0">
          <Users size={13} className="text-xogun-muted" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{player.name}</p>
        <p className="text-xogun-muted text-[10px]">
          {player.eliminated ? '💀 Eliminado' : claimed ? (isMe ? 'Ti' : 'Reclamado') : 'Praza libre'}
        </p>
      </div>
      {!claimed && canClaim && (
        <button onClick={() => onClaim(player.id)} className="btn-secondary text-xs px-2.5 py-1">Son eu</button>
      )}
      {isHost && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => onToggleEliminated(player.id, player.eliminated)}
            className={`p-1.5 rounded-lg transition-colors ${player.eliminated ? 'text-xogun-accent' : 'text-xogun-muted hover:text-xogun-red'}`} title="Marcar eliminado">
            <Skull size={13} />
          </button>
          {!claimed && (
            <button onClick={() => onRemove(player.id)} className="p-1.5 text-xogun-muted hover:text-xogun-red"><X size={13} /></button>
          )}
        </div>
      )}
    </div>
  )
}

function RoleReveal({ roleName }) {
  const [revealed, setRevealed] = useState(false)
  const info = getRoleInfo(roleName)
  const color = TEAM_COLORS[info.team] || TEAM_COLORS.neutral

  if (!revealed) {
    return (
      <button onClick={() => setRevealed(true)}
        className="w-full card flex flex-col items-center gap-2 py-8 border-xogun-accent/40 hover:border-xogun-accent transition-colors">
        <Eye size={22} className="text-xogun-accent" />
        <span className="text-sm text-xogun-muted">Toca para ver o teu rol en privado</span>
      </button>
    )
  }

  return (
    <div className="card py-6 text-center space-y-2 border-2" style={{ borderColor: color + '80' }}>
      <p className="text-xogun-muted text-[10px] uppercase tracking-wider">O teu rol</p>
      <p className="font-display text-3xl" style={{ color }}>{roleName}</p>
      <p className="text-xogun-muted text-sm max-w-xs mx-auto">{info.desc}</p>
      <button onClick={() => setRevealed(false)} className="btn-ghost flex items-center gap-1.5 text-xs mx-auto mt-2">
        <EyeOff size={12} /> Ocultar
      </button>
    </div>
  )
}

function PhaseTimer({ endsAt }) {
  const [remaining, setRemaining] = useState(null)

  useEffect(() => {
    if (!endsAt) { setRemaining(null); return }
    function tick() {
      const diff = Math.max(0, Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000))
      setRemaining(diff)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [endsAt])

  if (remaining === null) return null
  const mins = String(Math.floor(remaining / 60)).padStart(2, '0')
  const secs = String(remaining % 60).padStart(2, '0')
  return (
    <span className={`font-display text-lg tabular-nums ${remaining === 0 ? 'text-xogun-red' : 'text-xogun-accent'}`}>
      {mins}:{secs}
    </span>
  )
}

const PHASE_LABELS = {
  day: { emoji: '☀️', label: 'Día' },
  night: { emoji: '🌙', label: 'Noite' },
  voting: { emoji: '🗳️', label: 'Votación' },
  results: { emoji: '📊', label: 'Resultado' },
}

function VotingPanel({ game, players, myPlayer, myVote, tally, isHost, onVote, onCloseVoting }) {
  const targets = players.filter(p => p.id !== myPlayer?.id && !p.eliminated)
  const showResults = game.phase === 'results'

  const tallyWithNames = tally.map(t => ({
    ...t,
    player: players.find(p => p.id === t.target_player_id),
  }))
  const maxVotes = Math.max(...tallyWithNames.map(t => Number(t.votes)), 1)

  return (
    <div className="card space-y-3">
      <p className="label mb-0 flex items-center gap-1.5">🗳️ Votación (rolda {game.voting_round})</p>

      {showResults ? (
        tallyWithNames.length === 0 ? (
          <p className="text-xogun-muted text-sm text-center py-3">Ninguén votou nesta rolda.</p>
        ) : (
          <div className="space-y-1.5">
            {tallyWithNames.map(t => (
              <div key={t.target_player_id} className="flex items-center gap-2">
                <span className="text-sm flex-1 truncate">{t.player?.name || 'Descoñecido'}</span>
                <div className="flex-1 max-w-24 h-2 bg-xogun-surface rounded-full overflow-hidden">
                  <div className="h-full bg-xogun-red rounded-full" style={{ width: `${(Number(t.votes) / maxVotes) * 100}%` }} />
                </div>
                <span className="text-xogun-muted text-xs w-5 text-right">{t.votes}</span>
              </div>
            ))}
          </div>
        )
      ) : myPlayer && !myPlayer.eliminated ? (
        <div className="space-y-1.5">
          {myVote && (
            <p className="text-xogun-accent text-xs">
              O teu voto: <strong>{players.find(p => p.id === myVote)?.name || '—'}</strong>
            </p>
          )}
          <div className="grid grid-cols-2 gap-1.5">
            {targets.map(p => (
              <button key={p.id} onClick={() => onVote(p.id)}
                className={`text-xs px-2 py-2 rounded-lg border transition-colors truncate ${myVote === p.id ? 'border-xogun-accent text-xogun-accent bg-xogun-accent/10' : 'border-xogun-border text-xogun-muted'}`}>
                {p.name}
              </button>
            ))}
          </div>
          <button onClick={() => onVote(null)}
            className={`w-full text-xs px-2 py-1.5 rounded-lg border transition-colors ${myVote === null ? 'border-xogun-accent text-xogun-accent' : 'border-xogun-border text-xogun-muted'}`}>
            Voto en branco
          </button>
          <p className="text-xogun-muted text-[10px] text-center">O teu voto é secreto ata que se peche a votación.</p>
        </div>
      ) : (
        <p className="text-xogun-muted text-sm text-center py-3">
          {myPlayer?.eliminated ? 'Estás eliminado — non podes votar.' : 'Non tes praza nesta partida.'}
        </p>
      )}

      {isHost && !showResults && (
        <button onClick={onCloseVoting} className="btn-secondary w-full text-xs">Pechar votación e amosar resultado</button>
      )}
    </div>
  )
}

function PhaseControls({ game, onStartPhase, onOpenVoting, onClearPhase }) {
  const [minutes, setMinutes] = useState(5)
  return (
    <div className="card space-y-2">
      <p className="label mb-0">Controlar fase (visible para todos)</p>
      <div className="flex items-center gap-2">
        <input type="number" min={1} max={60} value={minutes} onChange={e => setMinutes(Number(e.target.value))}
          className="input w-16 py-1 text-xs" />
        <span className="text-xogun-muted text-xs">minutos</span>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        <button onClick={() => onStartPhase('day', minutes * 60)} className="btn-secondary text-xs">☀️ Iniciar día</button>
        <button onClick={() => onStartPhase('night', minutes * 60)} className="btn-secondary text-xs">🌙 Iniciar noite</button>
        <button onClick={() => onOpenVoting(minutes * 60)} className="btn-secondary text-xs">🗳️ Abrir votación</button>
        {game.phase !== 'none' && (
          <button onClick={onClearPhase} className="btn-ghost text-xs">Limpar fase</button>
        )}
      </div>
    </div>
  )
}

function RoomScreen({ code }) {
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const social = useSocialGame(code, user?.id)
  const [newSlotName, setNewSlotName] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => { saveLastCode(code.toUpperCase()) }, [code])

  if (social.loading) return <p className="text-xogun-muted text-sm text-center py-16">Cargando sala...</p>
  if (social.notFound) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-xogun-muted text-sm">Non se atopou ningunha sala co código <strong>{code}</strong>.</p>
        <button onClick={() => navigate('/social')} className="btn-primary">Volver</button>
      </div>
    )
  }

  const { game, players, myPlayer, myRole, myVote, tally, isHost } = social

  function copyCode() {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  function shareLink() {
    const url = `${window.location.origin}/social/${code}`
    navigator.clipboard?.writeText(url)
    toast.success('Enlace copiado — compárteo cos xogadores')
  }

  async function handleClaim(playerId) {
    const { error } = await social.claimSlot(playerId)
    if (error) toast.error(error.message)
  }

  async function handleAddSlot() {
    if (!newSlotName.trim()) return
    const { error } = await social.addSlot(newSlotName.trim())
    if (error) toast.error('Non se puido engadir o xogador')
    setNewSlotName('')
  }

  async function handleDeal() {
    const { error } = await social.dealRoles(game.role_pool)
    if (error) toast.error(error.message)
    else toast.success('Roles repartidos — cada un xa pode velos no seu móbil')
  }

  async function handleReset() {
    if (!confirm('Volver ao lobby? Os roles actuais bórranse.')) return
    await social.resetToLobby()
  }

  async function handleDelete() {
    if (!confirm('Eliminar esta partida para todos?')) return
    await social.deleteGame()
    navigate('/social')
  }

  async function handleStartPhase(phase, seconds) {
    const { error } = await social.startPhase(phase, seconds)
    if (error) toast.error('Non se puido cambiar de fase')
  }

  async function handleOpenVoting(seconds) {
    const { error } = await social.openVoting(seconds)
    if (error) toast.error('Non se puido abrir a votación')
  }

  async function handleVote(targetId) {
    const { error } = await social.castVote(targetId)
    if (error) toast.error('Non se puido rexistrar o voto')
    else toast.success(targetId ? 'Voto rexistrado' : 'Voto en branco rexistrado')
  }

  const presetLabel = SOCIAL_PRESETS.find(p => p.id === game.preset)?.label || game.preset

  return (
    <div className="max-w-md mx-auto space-y-5">
      <div className="text-center space-y-1">
        <p className="text-xogun-muted text-xs">{presetLabel}</p>
        <h1 className="font-display text-xl text-xogun-text">{game.name || 'Partida social'}</h1>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="font-display text-2xl tracking-widest text-xogun-accent">{code}</span>
          <button onClick={copyCode} className="text-xogun-muted hover:text-xogun-accent"><Copy size={15} /></button>
          <button onClick={shareLink} className="text-xogun-muted hover:text-xogun-accent"><Share2 size={15} /></button>
        </div>
        {copied && <p className="text-xogun-accent text-[10px]">Código copiado</p>}
      </div>

      {game.status === 'dealt' && game.phase && game.phase !== 'none' && (
        <div className="card flex items-center justify-between bg-xogun-surface">
          <span className="text-sm flex items-center gap-1.5">
            {PHASE_LABELS[game.phase]?.emoji} {PHASE_LABELS[game.phase]?.label}
          </span>
          <PhaseTimer endsAt={game.phase_ends_at} />
        </div>
      )}

      {game.status === 'dealt' && myPlayer && (
        <RoleReveal roleName={myRole || '...'} />
      )}

      {game.status === 'dealt' && (game.phase === 'voting' || game.phase === 'results') && (
        <VotingPanel game={game} players={players} myPlayer={myPlayer} myVote={myVote} tally={tally}
          isHost={isHost} onVote={handleVote} onCloseVoting={social.closeVoting} />
      )}

      {isHost && game.status === 'dealt' && (
        <PhaseControls game={game} onStartPhase={handleStartPhase} onOpenVoting={handleOpenVoting} onClearPhase={social.clearPhase} />
      )}

      {game.status === 'lobby' && !myPlayer && (
        <p className="text-xogun-accent text-xs text-center bg-xogun-accent/10 border border-xogun-accent/30 rounded-lg px-3 py-2">
          Toca "Son eu" xunto ao teu nome para reclamar a túa praza.
        </p>
      )}

      <div className="space-y-2">
        <p className="label">Xogadores ({players.length})</p>
        {players.map(p => (
          <PlayerSlot key={p.id} player={p}
            onClaim={handleClaim} canClaim={!myPlayer} isMe={p.claimed_by === user?.id}
            isHost={isHost} onToggleEliminated={social.toggleEliminated} onRemove={social.removeSlot} />
        ))}
      </div>

      {isHost && game.status === 'lobby' && (
        <div className="flex gap-2">
          <input className="input flex-1" placeholder="Engadir outro xogador..." value={newSlotName}
            onChange={e => setNewSlotName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddSlot()} />
          <button onClick={handleAddSlot} className="btn-secondary px-3"><Plus size={14} /></button>
        </div>
      )}

      {isHost && (
        <div className="space-y-2 pt-2 border-t border-xogun-border">
          {game.status === 'lobby' ? (
            <button onClick={handleDeal} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              <Shuffle size={16} /> Repartir roles
            </button>
          ) : (
            <button onClick={handleReset} className="btn-secondary w-full flex items-center justify-center gap-2">
              <RotateCcw size={14} /> Volver ao lobby e repartir de novo
            </button>
          )}
          <button onClick={handleDelete} className="btn-ghost w-full text-xogun-red text-xs">Eliminar partida</button>
        </div>
      )}

      <button onClick={() => navigate('/social')} className="btn-ghost w-full text-xs">← Saír da sala</button>
    </div>
  )
}

export default function SocialGamePage() {
  const { code } = useParams()
  return code ? <RoomScreen code={code} /> : <EntryScreen />
}

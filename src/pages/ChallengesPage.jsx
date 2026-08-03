import { useState } from 'react'
import { Swords, Plus, X, Check, Flag, Trash2, Calendar } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useFriendships } from '../hooks/useFriendships'
import { useChallenges } from '../hooks/useChallenges'
import { useGames } from '../hooks/useGames'
import { UserAvatar } from '../hooks/useAvatars'

const STATUS_LABELS = {
  pending: { label: 'Pendente', color: 'text-xogun-muted border-xogun-border' },
  accepted: { label: 'Aceptado', color: 'text-xogun-accent border-xogun-accent/30' },
  completed: { label: 'Completado', color: 'text-green-400 border-green-500/30' },
  failed: { label: 'Fallado', color: 'text-xogun-red border-xogun-red/30' },
  declined: { label: 'Rexeitado', color: 'text-xogun-muted border-xogun-border' },
}

function NewChallengeForm({ friends, getFriendProfile, onCreate, onCancel }) {
  const [toUser, setToUser] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [gameSearch, setGameSearch] = useState('')
  const [selectedGame, setSelectedGame] = useState(null)
  const { games } = useGames({ search: gameSearch })

  function handleCreate() {
    if (!toUser || !title.trim()) return
    onCreate({ toUser, gameId: selectedGame?.id, title: title.trim(), description: description.trim(), deadline })
  }

  return (
    <div className="card space-y-3">
      <div>
        <label className="label">A quen retas?</label>
        <select className="input" value={toUser} onChange={e => setToUser(e.target.value)}>
          <option value="">Elixe un amigo...</option>
          {friends.map(f => {
            const p = getFriendProfile(f)
            const friendId = p?.id
            return <option key={f.id} value={friendId}>{p?.display_name || 'Usuario'}</option>
          })}
        </select>
      </div>

      <div>
        <label className="label">Xogo (opcional)</label>
        {selectedGame ? (
          <div className="flex items-center gap-2 bg-xogun-surface rounded-lg px-2 py-1.5">
            <span className="text-sm flex-1">{selectedGame.name}</span>
            <button onClick={() => setSelectedGame(null)} className="text-xogun-muted hover:text-xogun-red"><X size={13} /></button>
          </div>
        ) : (
          <>
            <input className="input" placeholder="Buscar xogo..." value={gameSearch} onChange={e => setGameSearch(e.target.value)} />
            {gameSearch && (
              <div className="mt-1 space-y-1 max-h-32 overflow-y-auto">
                {games.slice(0, 5).map(g => (
                  <button key={g.id} onClick={() => { setSelectedGame(g); setGameSearch('') }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-xogun-surface text-sm">{g.name}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div>
        <label className="label">Reto</label>
        <input className="input" placeholder="Ex: Gaña unha partida de Catán" value={title} onChange={e => setTitle(e.target.value)} />
      </div>

      <div>
        <label className="label">Detalles (opcional)</label>
        <textarea className="input" rows={2} placeholder="Condicións, contexto..." value={description} onChange={e => setDescription(e.target.value)} />
      </div>

      <div>
        <label className="label flex items-center gap-1.5"><Calendar size={11} /> Data límite (opcional)</label>
        <input type="date" className="input" value={deadline} onChange={e => setDeadline(e.target.value)} />
      </div>

      <div className="flex gap-2">
        <button onClick={onCancel} className="btn-secondary flex-1">Cancelar</button>
        <button onClick={handleCreate} disabled={!toUser || !title.trim()} className="btn-primary flex-1 disabled:opacity-50">Enviar reto</button>
      </div>
    </div>
  )
}

function ChallengeCard({ challenge, isSent, onResolve, onDelete }) {
  const otherProfile = isSent ? challenge.to_profile : challenge.from_profile
  const status = STATUS_LABELS[challenge.status] || STATUS_LABELS.pending
  const isPending = challenge.status === 'pending'
  const isAccepted = challenge.status === 'accepted'

  return (
    <div className="card">
      <div className="flex items-start gap-3">
        <UserAvatar profile={otherProfile} size={36} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{challenge.title}</p>
          <p className="text-xogun-muted text-xs mt-0.5">
            {isSent ? 'Para' : 'De'} {otherProfile?.display_name || 'Usuario'}
            {challenge.games?.name && ` · ${challenge.games.name}`}
          </p>
          {challenge.description && <p className="text-xogun-muted text-xs mt-1">{challenge.description}</p>}
          {challenge.deadline && (
            <p className="text-xogun-muted text-[11px] mt-1 flex items-center gap-1">
              <Calendar size={10} /> Ata o {new Date(challenge.deadline).toLocaleDateString('gl')}
            </p>
          )}
        </div>
        <span className={`badge flex-shrink-0 ${status.color}`}>{status.label}</span>
      </div>

      <div className="flex gap-2 mt-3 flex-wrap">
        {!isSent && isPending && (
          <>
            <button onClick={() => onResolve(challenge.id, 'accepted')} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-xogun-accent/30 text-xogun-accent hover:bg-xogun-accent/10 transition-colors">
              <Check size={12} /> Aceptar
            </button>
            <button onClick={() => onResolve(challenge.id, 'declined')} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-xogun-red/30 text-xogun-red hover:bg-xogun-red/10 transition-colors">
              <X size={12} /> Rexeitar
            </button>
          </>
        )}
        {isAccepted && (
          <>
            <button onClick={() => onResolve(challenge.id, 'completed')} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors">
              <Flag size={12} /> Marcar completado
            </button>
            <button onClick={() => onResolve(challenge.id, 'failed')} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-xogun-red/30 text-xogun-red hover:bg-xogun-red/10 transition-colors">
              <X size={12} /> Marcar fallado
            </button>
          </>
        )}
        {isSent && (challenge.status === 'pending' || challenge.status === 'declined') && (
          <button onClick={() => onDelete(challenge.id)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-xogun-border text-xogun-muted hover:text-xogun-red transition-colors ml-auto">
            <Trash2 size={12} /> Eliminar
          </button>
        )}
      </div>
    </div>
  )
}

export default function ChallengesPage() {
  const { user } = useAuth()
  const { friends, getFriendProfile } = useFriendships(user?.id)
  const { sent, received, loading, createChallenge, resolveChallenge, deleteChallenge } = useChallenges(user?.id)
  const [showNew, setShowNew] = useState(false)
  const [tab, setTab] = useState('received')

  async function handleCreate(data) {
    await createChallenge(data)
    setShowNew(false)
  }

  const list = tab === 'received' ? received : sent
  const pendingReceivedCount = received.filter(c => c.status === 'pending').length

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="section-title flex items-center gap-2"><Swords size={20} /> Retos entre amigos</h1>
          <p className="section-subtitle">Lanza desafíos e segue o progreso</p>
        </div>
        {friends.length > 0 && (
          <button onClick={() => setShowNew(s => !s)} className="btn-primary flex items-center gap-1.5 text-xs">
            <Plus size={13} /> Novo reto
          </button>
        )}
      </div>

      {friends.length === 0 && (
        <p className="text-xogun-muted text-sm text-center py-10">
          Necesitas amigos engadidos para lanzar retos. Ve a "Amigos" para engadir algún.
        </p>
      )}

      {showNew && (
        <NewChallengeForm friends={friends} getFriendProfile={getFriendProfile} onCreate={handleCreate} onCancel={() => setShowNew(false)} />
      )}

      {friends.length > 0 && (
        <>
          <div className="flex gap-2 border-b border-xogun-border">
            {[['received', `Recibidos${pendingReceivedCount ? ` (${pendingReceivedCount})` : ''}`], ['sent', 'Enviados']].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)}
                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${tab === id ? 'border-xogun-accent text-xogun-accent' : 'border-transparent text-xogun-muted hover:text-xogun-text'}`}>
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-xogun-muted text-sm">Cargando...</p>
          ) : list.length === 0 ? (
            <p className="text-xogun-muted text-sm text-center py-10">
              {tab === 'received' ? 'Ningún amigo te retou aínda.' : 'Aínda non lanzaches ningún reto.'}
            </p>
          ) : (
            <div className="space-y-2">
              {list.map(c => (
                <ChallengeCard key={c.id} challenge={c} isSent={tab === 'sent'} onResolve={resolveChallenge} onDelete={deleteChallenge} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

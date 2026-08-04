import { useState } from 'react'
import { Calendar, Plus, X, Check, Trash2, Users } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useSessionCalendar } from '../hooks/useSessionCalendar'
import { useFriendships } from '../hooks/useFriendships'
import { useGames } from '../hooks/useGames'
import { UserAvatar } from '../hooks/useAvatars'
import { useToast } from '../contexts/ToastContext'

const RSVP_LABELS = {
  pending: { label: 'Por confirmar', emoji: '❓' },
  going: { label: 'Vou', emoji: '✅' },
  not_going: { label: 'Non vou', emoji: '❌' },
}

function NewSessionForm({ friends, getFriendProfile, onCreate, onCancel }) {
  const [gameSearch, setGameSearch] = useState('')
  const [selectedGame, setSelectedGame] = useState(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [invited, setInvited] = useState(new Set())
  const { games } = useGames({ search: gameSearch })

  function toggleInvite(id) {
    setInvited(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function handleCreate() {
    if (!date) return
    const plannedAt = time ? `${date}T${time}:00` : `${date}T18:00:00`
    onCreate({
      gameId: selectedGame?.id,
      gameName: selectedGame?.name,
      plannedAt,
      notes: notes.trim(),
      inviteUserIds: [...invited],
    })
  }

  return (
    <div className="card space-y-3">
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

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label">Data</label>
          <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div>
          <label className="label">Hora</label>
          <input type="time" className="input" value={time} onChange={e => setTime(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="label">Notas (opcional)</label>
        <textarea className="input" rows={2} placeholder="Onde quedamos, que levar..." value={notes} onChange={e => setNotes(e.target.value)} />
      </div>

      {friends.length > 0 && (
        <div>
          <label className="label flex items-center gap-1.5"><Users size={11} /> Convidar amigos</label>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {friends.map(f => {
              const p = getFriendProfile(f)
              return (
                <label key={f.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-xogun-surface cursor-pointer">
                  <input type="checkbox" checked={invited.has(p?.id)} onChange={() => toggleInvite(p?.id)} className="accent-xogun-accent" />
                  <UserAvatar profile={p} size={24} />
                  <span className="text-sm">{p?.display_name || 'Usuario'}</span>
                </label>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={onCancel} className="btn-secondary flex-1">Cancelar</button>
        <button onClick={handleCreate} disabled={!date} className="btn-primary flex-1 disabled:opacity-50">Crear sesión</button>
      </div>
    </div>
  )
}

function SessionCard({ session, userId, onRsvp, onDelete }) {
  const isCreator = session.created_by === userId
  const myInvite = session.session_invites?.find(i => i.user_id === userId)
  const date = new Date(session.planned_at)

  return (
    <div className="card">
      <div className="flex items-start gap-3">
        <div className="text-center flex-shrink-0 w-12">
          <p className="text-xogun-accent font-display text-xl leading-none">{date.getDate()}</p>
          <p className="text-xogun-muted text-[10px] uppercase">{date.toLocaleDateString('gl', { month: 'short' })}</p>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{session.game_name || session.games?.name || 'Sesión de xogo'}</p>
          <p className="text-xogun-muted text-xs mt-0.5">
            {date.toLocaleTimeString('gl', { hour: '2-digit', minute: '2-digit' })}
          </p>
          {session.notes && <p className="text-xogun-muted text-xs mt-1">{session.notes}</p>}
          {session.session_invites?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {session.session_invites.map(inv => (
                <span key={inv.id} className="text-[10px] px-1.5 py-0.5 rounded-full bg-xogun-surface text-xogun-muted flex items-center gap-1">
                  {RSVP_LABELS[inv.rsvp]?.emoji} {inv.profiles?.display_name || 'Usuario'}
                </span>
              ))}
            </div>
          )}
        </div>
        {isCreator && (
          <button onClick={() => onDelete(session.id)} className="text-xogun-muted hover:text-xogun-red flex-shrink-0"><Trash2 size={14} /></button>
        )}
      </div>

      {!isCreator && myInvite && myInvite.rsvp === 'pending' && (
        <div className="flex gap-2 mt-3">
          <button onClick={() => onRsvp(session.id, 'going')} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-xogun-accent/30 text-xogun-accent hover:bg-xogun-accent/10 transition-colors">
            <Check size={12} /> Vou
          </button>
          <button onClick={() => onRsvp(session.id, 'not_going')} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-xogun-border text-xogun-muted hover:text-xogun-red transition-colors">
            <X size={12} /> Non vou
          </button>
        </div>
      )}
    </div>
  )
}

export default function CalendarPage() {
  const { user } = useAuth()
  const toast = useToast()
  const { friends, getFriendProfile } = useFriendships(user?.id)
  const { sessions, loading, createSession, updateRsvp, deleteSession } = useSessionCalendar(user?.id)
  const [showNew, setShowNew] = useState(false)

  async function handleCreate(data) {
    const { error } = await createSession(data)
    if (error) { toast.error('Non se puido crear a sesión — téntao de novo'); return }
    toast.success('Sesión creada')
    setShowNew(false)
  }

  const upcoming = sessions.filter(s => new Date(s.planned_at) >= new Date(new Date().toDateString()))
  const past = sessions.filter(s => new Date(s.planned_at) < new Date(new Date().toDateString()))

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="section-title flex items-center gap-2"><Calendar size={20} /> Calendario de sesións</h1>
          <p className="section-subtitle">Planifica quedadas e convida amigos</p>
        </div>
        <button onClick={() => setShowNew(s => !s)} className="btn-primary flex items-center gap-1.5 text-xs">
          <Plus size={13} /> Nova sesión
        </button>
      </div>

      {showNew && (
        <NewSessionForm friends={friends} getFriendProfile={getFriendProfile} onCreate={handleCreate} onCancel={() => setShowNew(false)} />
      )}

      {loading ? (
        <p className="text-xogun-muted text-sm">Cargando...</p>
      ) : (
        <>
          <div>
            <h2 className="font-medium text-sm text-xogun-muted uppercase tracking-wider mb-2">Próximas</h2>
            {upcoming.length === 0 ? (
              <p className="text-xogun-muted text-sm text-center py-8">Non hai sesións planificadas. Crea a primeira arriba.</p>
            ) : (
              <div className="space-y-2">
                {upcoming.map(s => (
                  <SessionCard key={s.id} session={s} userId={user.id} onRsvp={updateRsvp} onDelete={deleteSession} />
                ))}
              </div>
            )}
          </div>

          {past.length > 0 && (
            <div>
              <h2 className="font-medium text-sm text-xogun-muted uppercase tracking-wider mb-2">Pasadas</h2>
              <div className="space-y-2 opacity-60">
                {past.map(s => (
                  <SessionCard key={s.id} session={s} userId={user.id} onRsvp={updateRsvp} onDelete={deleteSession} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

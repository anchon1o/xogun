import { useState } from 'react'
import { Search, UserPlus, Check, X, Users, Clock, Send } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useFriendships } from '../hooks/useFriendships'
import { UserAvatar } from '../hooks/useAvatars'

function UserSearch({ onRequestSent }) {
  const { user } = useAuth()
  const { searchUsers, sendRequest, isFriend, hasPendingWith } = useFriendships(user?.id)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)

  async function handleSearch(q) {
    setQuery(q)
    if (!q.trim()) { setResults([]); return }
    setSearching(true)
    const data = await searchUsers(q)
    setResults(data)
    setSearching(false)
  }

  async function handleSend(userId) {
    await sendRequest(userId)
    onRequestSent?.()
  }

  return (
    <div className="card space-y-3">
      <label className="label flex items-center gap-1.5"><Search size={11} /> Buscar usuarios</label>
      <input className="input" placeholder="Nome do usuario..." value={query}
        onChange={e => handleSearch(e.target.value)} />
      {searching && <p className="text-xogun-muted text-xs">Buscando...</p>}
      {results.length > 0 && (
        <div className="space-y-1">
          {results.map(u => {
            const alreadyFriend = isFriend(u.id)
            const alreadyPending = hasPendingWith(u.id)
            return (
              <div key={u.id} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-xogun-surface transition-colors">
                <UserAvatar profile={u} size={32} />
                <span className="flex-1 text-sm truncate">{u.display_name || u.email?.replace('@xogun.app', '')}</span>
                {alreadyFriend ? (
                  <span className="text-xogun-muted text-xs flex items-center gap-1"><Check size={12} /> Amigos</span>
                ) : alreadyPending ? (
                  <span className="text-xogun-muted text-xs flex items-center gap-1"><Clock size={12} /> Pendente</span>
                ) : (
                  <button onClick={() => handleSend(u.id)} className="btn-secondary text-xs py-1 flex items-center gap-1">
                    <UserPlus size={12} /> Engadir
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
      {query && !searching && results.length === 0 && (
        <p className="text-xogun-muted text-xs">Ningún usuario atopado</p>
      )}
    </div>
  )
}

export default function FriendsPage() {
  const { user } = useAuth()
  const { friends, pending, sent, loading, acceptRequest, rejectRequest, cancelRequest, removeFriend, getFriendProfile } = useFriendships(user?.id)
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="section-title flex items-center gap-2"><Users size={20} /> Amigos</h1>
        <p className="section-subtitle">Conecta con outros usuarios para compartir coleccións e listas</p>
      </div>

      <UserSearch key={refreshKey} onRequestSent={() => setRefreshKey(k => k + 1)} />

      {pending.length > 0 && (
        <div>
          <h2 className="font-medium text-sm text-xogun-muted uppercase tracking-wider mb-2">Solicitudes recibidas</h2>
          <div className="space-y-2">
            {pending.map(f => {
              const profile = f.requester_profile
              return (
                <div key={f.id} className="card flex items-center gap-3">
                  <UserAvatar profile={profile} size={36} />
                  <span className="flex-1 text-sm font-medium truncate">{profile?.display_name || 'Usuario'}</span>
                  <button onClick={() => acceptRequest(f.id)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors">
                    <Check size={13} /> Aceptar
                  </button>
                  <button onClick={() => rejectRequest(f.id)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-xogun-red/30 text-xogun-red hover:bg-xogun-red/10 transition-colors">
                    <X size={13} /> Rexeitar
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {sent.length > 0 && (
        <div>
          <h2 className="font-medium text-sm text-xogun-muted uppercase tracking-wider mb-2">Solicitudes enviadas</h2>
          <div className="space-y-2">
            {sent.map(f => {
              const profile = f.addressee_profile
              return (
                <div key={f.id} className="card flex items-center gap-3">
                  <UserAvatar profile={profile} size={36} />
                  <span className="flex-1 text-sm truncate">{profile?.display_name || 'Usuario'}</span>
                  <span className="text-xogun-muted text-xs flex items-center gap-1"><Send size={12} /> Pendente</span>
                  <button onClick={() => cancelRequest(f.id)} className="btn-ghost p-1.5 hover:text-xogun-red"><X size={13} /></button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-medium text-sm text-xogun-muted uppercase tracking-wider mb-2">
          Os teus amigos {friends.length > 0 && `(${friends.length})`}
        </h2>
        {loading ? (
          <p className="text-xogun-muted text-sm">Cargando...</p>
        ) : friends.length === 0 ? (
          <p className="text-xogun-muted text-sm">Aínda non tes amigos engadidos. Búscaos arriba.</p>
        ) : (
          <div className="space-y-2">
            {friends.map(f => {
              const profile = getFriendProfile(f)
              return (
                <div key={f.id} className="card flex items-center gap-3">
                  <UserAvatar profile={profile} size={36} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{profile?.display_name || 'Usuario'}</p>
                  </div>
                  <button onClick={() => { if (confirm('Eliminar esta amizade?')) removeFriend(f.id) }}
                    className="btn-ghost p-1.5 hover:text-xogun-red"><X size={13} /></button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

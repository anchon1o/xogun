import { useState } from 'react'
import { Play, Pause, SkipForward, SkipBack, Plus, Trash2, Music, Volume2, ListMusic, X, Share2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useMusicPlayer } from '../../contexts/MusicPlayerContext'
import { usePlaylists, usePlaylistTracks, getYouTubeId, getYouTubeTitle } from '../../hooks/usePlaylists'

function TrackAdder({ playlistId, onAdded }) {
  const { addTrack } = usePlaylistTracks(playlistId)
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  async function add() {
    const id = getYouTubeId(url.trim())
    if (!id) return
    setLoading(true)
    const title = await getYouTubeTitle(url.trim())
    await addTrack({ youtube_url: url.trim(), title: title || 'Canción' })
    setUrl(''); setLoading(false)
    onAdded?.()
  }

  return (
    <div className="flex gap-2">
      <input className="input flex-1" placeholder="URL de YouTube..." value={url}
        onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
      <button onClick={add} disabled={loading || !url.trim()} className="btn-secondary px-3 disabled:opacity-50">
        {loading ? '…' : <Plus size={14} />}
      </button>
    </div>
  )
}

function PlaylistDetail({ playlist, onBack, onDeleted }) {
  const { tracks, removeTrack } = usePlaylistTracks(playlist.id)
  const { loadQueue, currentTrack, playing, toggle } = useMusicPlayer()
  const { deletePlaylist } = usePlaylists()

  function playAll(startIndex = 0) {
    const queue = tracks.map(t => ({ url: t.youtube_url, title: t.title }))
    loadQueue(queue, startIndex)
  }

  async function handleDelete() {
    if (!confirm(`Eliminar a playlist "${playlist.name}"?`)) return
    await deletePlaylist(playlist.id)
    onDeleted?.()
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="btn-ghost text-xs">← Volver</button>
        <h3 className="font-medium text-sm flex-1 truncate">{playlist.name}</h3>
        <button onClick={handleDelete} className="btn-ghost p-1 hover:text-xogun-red"><Trash2 size={13} /></button>
      </div>

      {tracks.length > 0 && (
        <button onClick={() => playAll(0)} className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
          <Play size={14} /> Reproducir todo
        </button>
      )}

      <div className="space-y-1 max-h-52 overflow-y-auto">
        {tracks.map((t, i) => {
          const isCurrent = currentTrack?.url === t.youtube_url
          return (
            <div key={t.id}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${isCurrent ? 'bg-xogun-accent/10 text-xogun-accent' : 'hover:bg-xogun-surface text-xogun-text'}`}
              onClick={() => isCurrent ? toggle() : playAll(i)}>
              {isCurrent && playing ? <Pause size={13} className="flex-shrink-0" /> : <Play size={13} className="flex-shrink-0 opacity-50" />}
              <span className="flex-1 truncate">{t.title}</span>
              <button onClick={e => { e.stopPropagation(); removeTrack(t.id) }} className="text-xogun-muted hover:text-xogun-red flex-shrink-0"><X size={12} /></button>
            </div>
          )
        })}
        {tracks.length === 0 && <p className="text-xogun-muted text-xs text-center py-3">Sen cancións aínda</p>}
      </div>

      <TrackAdder playlistId={playlist.id} />
    </div>
  )
}

function NewPlaylistForm({ onCreate, onCancel }) {
  const [name, setName] = useState('')
  return (
    <div className="space-y-2">
      <input className="input" placeholder="Nome da playlist" value={name} onChange={e => setName(e.target.value)} autoFocus
        onKeyDown={e => e.key === 'Enter' && name.trim() && onCreate(name.trim())} />
      <div className="flex gap-2">
        <button onClick={onCancel} className="btn-secondary flex-1 text-xs">Cancelar</button>
        <button onClick={() => name.trim() && onCreate(name.trim())} disabled={!name.trim()} className="btn-primary flex-1 text-xs disabled:opacity-50">Crear</button>
      </div>
    </div>
  )
}

export default function MusicWidget() {
  const { user, profile } = useAuth()
  const { playlists, loading, createPlaylist } = usePlaylists(user?.id)
  const { playing, toggle, next, prev, currentTrack, volume, setVolume, ready } = useMusicPlayer()
  const [selected, setSelected] = useState(null)
  const [showNew, setShowNew] = useState(false)

  if (!user) {
    return <p className="text-xogun-muted text-sm text-center py-8">Inicia sesión para crear e xestionar playlists.</p>
  }

  async function handleCreate(name) {
    const { data } = await createPlaylist({ name, is_public: false })
    setShowNew(false)
    if (data) setSelected(data)
  }

  return (
    <div className="space-y-4">
      {/* Mini reprodutor persistente */}
      {currentTrack && (
        <div className="card flex items-center gap-3 bg-xogun-accent/5 border-xogun-accent/30">
          <Music size={16} className="text-xogun-accent flex-shrink-0" />
          <span className="flex-1 text-sm truncate">{currentTrack.title}</span>
          <button onClick={prev} className="text-xogun-muted hover:text-xogun-text"><SkipBack size={14} /></button>
          <button onClick={toggle} className="w-7 h-7 rounded-full bg-xogun-accent text-xogun-bg flex items-center justify-center">
            {playing ? <Pause size={13} /> : <Play size={13} />}
          </button>
          <button onClick={next} className="text-xogun-muted hover:text-xogun-text"><SkipForward size={14} /></button>
        </div>
      )}

      {/* Volume */}
      {currentTrack && (
        <div className="flex items-center gap-2">
          <Volume2 size={14} className="text-xogun-muted flex-shrink-0" />
          <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(+e.target.value)}
            className="flex-1" style={{ accentColor: '#c8a96e' }} />
        </div>
      )}

      {!ready && <p className="text-xogun-muted text-xs text-center">Cargando reprodutor...</p>}

      {/* Playlist detail or list */}
      {selected ? (
        <PlaylistDetail playlist={selected} onBack={() => setSelected(null)} onDeleted={() => setSelected(null)} />
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="label mb-0 flex items-center gap-1"><ListMusic size={11} /> As miñas playlists</span>
            <button onClick={() => setShowNew(s => !s)} className="btn-ghost text-xs flex items-center gap-1"><Plus size={11} /> Nova</button>
          </div>

          {showNew && <NewPlaylistForm onCreate={handleCreate} onCancel={() => setShowNew(false)} />}

          {loading ? (
            <p className="text-xogun-muted text-xs text-center py-3">Cargando...</p>
          ) : playlists.length === 0 ? (
            <p className="text-xogun-muted text-xs text-center py-6">Aínda non tes playlists. Crea unha para engadir cancións de YouTube.</p>
          ) : (
            <div className="space-y-1">
              {playlists.map(p => (
                <button key={p.id} onClick={() => setSelected(p)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-xogun-surface transition-colors text-left">
                  <Music size={14} className="text-xogun-muted flex-shrink-0" />
                  <span className="flex-1 text-sm truncate">{p.name}</span>
                  <span className="text-xogun-muted text-xs flex-shrink-0">{p.playlist_tracks?.[0]?.count || 0}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

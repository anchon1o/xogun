import { useState } from 'react'
import { X, Users, Clock, Star, ExternalLink, Youtube, FileText, Edit2, Gauge, Palette, Globe, Link as LinkIcon } from 'lucide-react'
import { useCatalogMeta } from '../../hooks/useCatalogMeta'
import { useGameRating } from '../../hooks/useGameRating'
import { useGameOwners } from '../../hooks/useGameOwners'
import { useCollection, COLLECTION_STATUSES } from '../../hooks/useCollection'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { UserAvatar } from '../../hooks/useAvatars'
import ImagePreview from '../shared/ImagePreview'

const LANGUAGE_LABELS = { gl: 'Galego', es: 'Castelán', en: 'Inglés', pt: 'Portugués', fr: 'Francés' }

const VIDEO_TYPE_LABELS = {
  tutorial: 'Tutorial',
  gameplay: 'Gameplay',
  review: 'Reseña',
  quick: 'Partida rápida',
}

function getYouTubeThumbnail(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match?.[1] ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null
}

export default function GameDetail({ game, onClose, onEdit, canEdit }) {
  const { categories, mechanics } = useCatalogMeta()
  const { user } = useAuth()
  const toast = useToast()
  const { avg: communityAvg, count: ratingCount, refetch: refetchRating } = useGameRating(game?.id)
  const { getEntry, hasGame, updateEntry } = useCollection(user?.id)
  const { owners, loading: ownersLoading } = useGameOwners(game?.id)
  const [hoverRating, setHoverRating] = useState(0)

  if (!game) return null

  const myEntry = hasGame(game.id) ? getEntry(game.id) : null
  const myRating = myEntry?.personal_rating || 0

  async function setRating(value) {
    if (!user) { toast.info('Necesitas iniciar sesión para puntuar xogos'); return }
    if (!myEntry) { toast.info('Engade primeiro este xogo á túa colección para puntualo'); return }
    const { error } = await updateEntry(game.id, { personal_rating: value })
    if (error) { toast.error('Non se puido gardar a puntuación'); return }
    refetchRating()
  }

  const gameCategories = (game.category_ids || []).map(id => categories.find(c => c.id === id)).filter(Boolean)
  const gameMechanics = (game.mechanic_ids || []).map(id => mechanics.find(m => m.id === id)).filter(Boolean)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal max-w-2xl" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="font-display text-lg text-xogun-accent">{game.name}</h2>
          <div className="flex items-center gap-2">
            {canEdit && (
              <button onClick={() => onEdit?.(game)} className="btn-ghost p-1.5"><Edit2 size={15} /></button>
            )}
            <button onClick={onClose}><X size={18} className="text-xogun-muted" /></button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Header con imaxe */}
          <div className="flex gap-4">
            {game.images?.[0] && (
              <ImagePreview src={game.images[0]} alt={game.name} size={112} className="rounded-lg flex-shrink-0" fallbackIcon="🎲" />
            )}
            <div className="flex-1 min-w-0">
              {game.year_published && <p className="text-xogun-muted text-sm">{game.year_published}</p>}
              <div className="flex flex-wrap gap-3 text-sm text-xogun-muted mt-1">
                {(game.min_players || game.max_players) && (
                  <span className="flex items-center gap-1">
                    <Users size={13} />
                    {game.min_players === game.max_players ? game.min_players : `${game.min_players}–${game.max_players}`} xogadores
                  </span>
                )}
                {game.min_duration && (
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {game.max_duration && game.max_duration !== game.min_duration ? `${game.min_duration}–${game.max_duration}` : game.min_duration} min
                  </span>
                )}
                {game.bgg_rating && (
                  <span className="flex items-center gap-1 text-xogun-accent">
                    <Star size={13} />{Number(game.bgg_rating).toFixed(1)}
                  </span>
                )}
              </div>
              {(game.publisher || game.designer) && (
                <p className="text-xogun-muted text-xs mt-2">
                  {game.publisher && <>Editorial: {game.publisher}</>}
                  {game.publisher && game.designer && ' · '}
                  {game.designer && <>Deseño: {game.designer}</>}
                </p>
              )}
              {game.artists && (
                <p className="text-xogun-muted text-xs mt-0.5 flex items-center gap-1">
                  <Palette size={11} /> Ilustración: {game.artists}
                </p>
              )}
              {game.bgg_id && (
                <a href={`https://boardgamegeek.com/boardgame/${game.bgg_id}`} target="_blank" rel="noopener noreferrer"
                  className="text-xogun-accent text-xs mt-1.5 inline-flex items-center gap-1 hover:underline">
                  <LinkIcon size={11} /> Ver en BoardGameGeek
                </a>
              )}
            </div>
          </div>

          {/* Datos adicionais: idade, complexidade, xogadores recomendados, idiomas */}
          {(game.age || game.complexity || game.recommended_players || game.languages?.length > 0) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {game.age && (
                <div className="card py-2 text-center">
                  <p className="text-xogun-muted text-[10px] uppercase tracking-wider">Idade</p>
                  <p className="font-display text-lg text-xogun-text">{game.age}+</p>
                </div>
              )}
              {game.complexity && (
                <div className="card py-2 text-center">
                  <p className="text-xogun-muted text-[10px] uppercase tracking-wider flex items-center justify-center gap-1"><Gauge size={10} /> Complexidade</p>
                  <div className="flex items-center justify-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map(n => (
                      <span key={n} className="w-1.5 h-4 rounded-sm"
                        style={{ backgroundColor: n <= Math.round(game.complexity) ? 'var(--xogun-accent)' : 'var(--xogun-border)' }} />
                    ))}
                  </div>
                </div>
              )}
              {game.recommended_players && (
                <div className="card py-2 text-center">
                  <p className="text-xogun-muted text-[10px] uppercase tracking-wider">Recomendado</p>
                  <p className="font-display text-sm text-xogun-text mt-0.5">{game.recommended_players}</p>
                </div>
              )}
              {game.languages?.length > 0 && (
                <div className="card py-2 text-center">
                  <p className="text-xogun-muted text-[10px] uppercase tracking-wider flex items-center justify-center gap-1"><Globe size={10} /> Idiomas</p>
                  <p className="text-xs text-xogun-text mt-1">{game.languages.map(l => LANGUAGE_LABELS[l] || l).join(', ')}</p>
                </div>
              )}
            </div>
          )}

          {game.description && (
            <p className="text-sm text-xogun-text leading-relaxed">{game.description}</p>
          )}

          {/* Puntuacións */}
          <div className="card flex flex-wrap items-center gap-5">
            {game.bgg_rating && (
              <div className="text-center">
                <p className="text-xogun-muted text-[10px] uppercase tracking-wider mb-0.5">BGG</p>
                <p className="font-display text-lg text-xogun-text flex items-center gap-1 justify-center">
                  <Star size={13} className="text-xogun-muted" />{Number(game.bgg_rating).toFixed(1)}
                </p>
              </div>
            )}
            <div className="text-center">
              <p className="text-xogun-muted text-[10px] uppercase tracking-wider mb-0.5">Comunidade Xōgun</p>
              <p className="font-display text-lg text-xogun-accent flex items-center gap-1 justify-center">
                {communityAvg ? <><Star size={13} />{communityAvg}</> : <span className="text-xogun-muted text-sm">—</span>}
              </p>
              {ratingCount > 0 && <p className="text-xogun-muted text-[10px]">{ratingCount} valoración{ratingCount !== 1 ? 's' : ''}</p>}
            </div>
            <div className="flex-1 min-w-[140px]">
              <p className="text-xogun-muted text-[10px] uppercase tracking-wider mb-1">A miña valoración</p>
              {user ? (
                <div className="flex gap-0.5">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map(v => (
                    <button key={v} onClick={() => setRating(v)}
                      onMouseEnter={() => setHoverRating(v)} onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110">
                      <Star size={16}
                        className={(hoverRating || myRating) >= v ? 'text-xogun-accent' : 'text-xogun-border'}
                        fill={(hoverRating || myRating) >= v ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xogun-muted text-xs">Inicia sesión para puntuar</p>
              )}
              {user && !myEntry && (
                <p className="text-xogun-muted text-[10px] mt-1">Engade o xogo á túa colección para poder puntualo</p>
              )}
            </div>
          </div>

          {/* Categorías e mecánicas */}
          {(gameCategories.length > 0 || gameMechanics.length > 0) && (
            <div className="flex flex-wrap gap-1.5">
              {gameCategories.map(c => (
                <span key={c.id} className="badge border-xogun-border text-xogun-muted">{c.emoji} {c.name}</span>
              ))}
              {gameMechanics.map(m => (
                <span key={m.id} className="badge border-xogun-accent/30 text-xogun-accent">{m.name}</span>
              ))}
            </div>
          )}

          {/* Quen o ten */}
          {!ownersLoading && owners.length > 0 && (
            <div>
              <p className="label mb-2 flex items-center gap-1.5"><Users size={11} /> Quen o ten</p>
              <div className="flex flex-wrap gap-2">
                {owners.map((o, i) => {
                  const statusInfo = COLLECTION_STATUSES.find(s => s.id === o.status)
                  return (
                    <div key={o.profiles?.id || i} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-xogun-surface border border-xogun-border">
                      <UserAvatar profile={o.profiles} size={20} />
                      <span className="text-xs">{o.profiles?.display_name || 'Usuario'}</span>
                      <span className="text-xs" title={statusInfo?.label}>{statusInfo?.emoji}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Manual */}
          {game.rules_url && (
            <a href={game.rules_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 card hover:border-xogun-accent transition-colors text-sm">
              <FileText size={16} className="text-xogun-accent flex-shrink-0" />
              <span className="flex-1">Manual de instrucións</span>
              <ExternalLink size={13} className="text-xogun-muted" />
            </a>
          )}

          {/* Vídeos */}
          {game.videos?.length > 0 && (
            <div>
              <p className="label mb-2">Vídeos</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {game.videos.map((v, i) => {
                  const thumb = getYouTubeThumbnail(v.url)
                  return (
                    <a key={i} href={v.url} target="_blank" rel="noopener noreferrer"
                      className="card p-0 overflow-hidden hover:border-xogun-accent transition-colors group">
                      <div className="aspect-video bg-xogun-surface relative flex items-center justify-center">
                        {thumb ? <img src={thumb} alt={v.title} className="w-full h-full object-cover" /> : <Youtube size={24} className="text-xogun-muted" />}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Youtube size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium truncate">{v.title}</p>
                        <span className="badge border-xogun-border text-xogun-muted text-[9px] mt-1">{VIDEO_TYPE_LABELS[v.type] || v.type}</span>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

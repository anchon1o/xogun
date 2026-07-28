import { X, Users, Clock, Star, ExternalLink, Youtube, FileText, Edit2 } from 'lucide-react'
import { useCatalogMeta } from '../../hooks/useCatalogMeta'

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
  if (!game) return null

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
              <img src={game.images[0]} alt={game.name} className="w-28 h-28 object-cover rounded-lg flex-shrink-0" />
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
            </div>
          </div>

          {game.description && (
            <p className="text-sm text-xogun-text leading-relaxed">{game.description}</p>
          )}

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

import { useState } from 'react'
import { Users, Clock, Star, Plus, Check, Edit2, ChevronDown, Eye } from 'lucide-react'
import { useAppConfig } from '../../contexts/AppConfigContext'
import { COLLECTION_STATUSES, VISIBILITY_OPTIONS } from '../../hooks/useCollection'
import ImagePreview from './ImagePreview'

export default function GameCard({ game, userEntry, onSetStatus, onSetVisibility, onEdit, onOpenDetail, canEdit, compact = false }) {
  const { isFieldVisible } = useAppConfig()
  const image = game.images?.[0]
  const [menuOpen, setMenuOpen] = useState(false)
  const [visMenuOpen, setVisMenuOpen] = useState(false)
  const currentStatus = userEntry ? COLLECTION_STATUSES.find(s => s.id === userEntry.status) : null
  const currentVisibility = userEntry ? VISIBILITY_OPTIONS.find(v => v.id === (userEntry.visibility || 'friends')) : null

  function selectStatus(statusId) {
    onSetStatus?.(game, statusId)
    setMenuOpen(false)
    setVisMenuOpen(false)
  }

  function selectVisibility(vis) {
    onSetVisibility?.(game, vis)
    setVisMenuOpen(false)
  }

  return (
    <div onClick={() => onOpenDetail?.(game)}
      className="card-hover flex flex-col group animate-fade-in relative">
      {/* Cover */}
      <div className={`rounded-lg overflow-hidden bg-xogun-surface flex items-center justify-center mb-3 flex-shrink-0 relative ${compact ? 'h-28' : 'aspect-[4/3]'}`}>
        {image
          ? <ImagePreview src={image} alt={game.name} fill fallbackIcon="🎲" />
          : <span className="text-4xl">🎲</span>
        }
        {currentStatus && (
          <span className="absolute top-1.5 left-1.5 text-xs px-1.5 py-0.5 rounded-full backdrop-blur-sm"
            style={{ backgroundColor: currentStatus.color + 'cc', color: '#181206' }}>
            {currentStatus.emoji}
          </span>
        )}
        {canEdit && onEdit && (
          <button onClick={e => { e.stopPropagation(); onEdit(game) }}
            className="absolute top-1.5 right-1.5 w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center
                       opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-black/80">
            <Edit2 size={13} />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-sm leading-tight mb-1 line-clamp-2 text-xogun-text">{game.name}</h3>
        {game.year_published && <p className="text-xogun-muted text-xs mb-1">{game.year_published}</p>}

        <div className="flex items-center gap-2 flex-wrap text-xogun-muted text-xs mt-1">
          {isFieldVisible('min_players') && (game.min_players || game.max_players) && (
            <span className="flex items-center gap-0.5">
              <Users size={10} />
              {game.min_players === game.max_players ? game.min_players : `${game.min_players}–${game.max_players}`}
            </span>
          )}
          {isFieldVisible('min_duration') && game.min_duration && (
            <span className="flex items-center gap-0.5">
              <Clock size={10} />
              {game.max_duration && game.max_duration !== game.min_duration
                ? `${game.min_duration}–${game.max_duration}'`
                : `${game.min_duration}'`}
            </span>
          )}
          {isFieldVisible('bgg_rating') && game.bgg_rating && (
            <span className="flex items-center gap-0.5 ml-auto text-xogun-accent">
              <Star size={10} />{Number(game.bgg_rating).toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* Status selector */}
      {onSetStatus && (
        <div className="relative mt-3">
          <button onClick={e => { e.stopPropagation(); setMenuOpen(o => !o) }}
            className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all
              opacity-0 group-hover:opacity-100
              ${currentStatus ? 'bg-xogun-accent/20 text-xogun-accent border border-xogun-accent/30' : 'btn-secondary'}`}>
            {currentStatus ? <>{currentStatus.emoji} {currentStatus.label}</> : <><Plus size={11} /> Engadir</>}
            <ChevronDown size={11} />
          </button>

          {menuOpen && (
            <div onClick={e => e.stopPropagation()}
              className="absolute bottom-full left-0 right-0 mb-1 bg-xogun-card border border-xogun-border rounded-lg overflow-hidden shadow-xl z-20 animate-fade-in">
              {COLLECTION_STATUSES.map(s => (
                <button key={s.id} onClick={() => selectStatus(s.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-xogun-surface transition-colors ${userEntry?.status === s.id ? 'text-xogun-accent' : 'text-xogun-text'}`}>
                  {s.emoji} {s.label}
                  {userEntry?.status === s.id && <Check size={11} className="ml-auto" />}
                </button>
              ))}
              {userEntry && onSetVisibility && (
                <div className="border-t border-xogun-border relative">
                  <button onClick={e => { e.stopPropagation(); setVisMenuOpen(o => !o) }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-xogun-surface text-xogun-muted transition-colors">
                    <Eye size={11} /> Visibilidade: {currentVisibility?.emoji} {currentVisibility?.label}
                  </button>
                  {visMenuOpen && (
                    <div className="border-t border-xogun-border">
                      {VISIBILITY_OPTIONS.map(v => (
                        <button key={v.id} onClick={() => selectVisibility(v.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-xogun-surface transition-colors ${userEntry.visibility === v.id ? 'text-xogun-accent' : 'text-xogun-text'}`}>
                          {v.emoji} {v.label}
                          {userEntry.visibility === v.id && <Check size={11} className="ml-auto" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {userEntry && (
                <button onClick={() => selectStatus(null)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-xogun-surface text-xogun-red transition-colors border-t border-xogun-border">
                  Quitar da colección
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

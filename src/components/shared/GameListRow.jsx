import { useState } from 'react'
import { Users, Clock, Star, Plus, Check, Edit2, ChevronDown, Eye } from 'lucide-react'
import { COLLECTION_STATUSES, VISIBILITY_OPTIONS } from '../../hooks/useCollection'
import ImagePreview from './ImagePreview'

export default function GameListRow({ game, userEntry, onSetStatus, onSetVisibility, onEdit, canEdit, onClick }) {
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
    <div onClick={() => onClick?.(game)}
      className="card flex items-center gap-3 hover:border-xogun-accent/50 transition-colors cursor-pointer group relative">
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-xogun-surface flex items-center justify-center flex-shrink-0 relative">
        {image ? <ImagePreview src={image} alt={game.name} size={48} fallbackIcon="🎲" /> : <span className="text-xl">🎲</span>}
        {currentStatus && (
          <span className="absolute -top-1 -left-1 text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: currentStatus.color, color: '#181206' }}>
            {currentStatus.emoji}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{game.name}</p>
        <div className="flex items-center gap-3 text-xogun-muted text-xs mt-0.5">
          {game.year_published && <span>{game.year_published}</span>}
          {(game.min_players || game.max_players) && (
            <span className="flex items-center gap-0.5">
              <Users size={10} />
              {game.min_players === game.max_players ? game.min_players : `${game.min_players}–${game.max_players}`}
            </span>
          )}
          {game.min_duration && (
            <span className="flex items-center gap-0.5">
              <Clock size={10} />{game.min_duration}′
            </span>
          )}
        </div>
      </div>

      {game.bgg_rating && (
        <span className="text-xogun-accent text-xs flex items-center gap-0.5 flex-shrink-0">
          <Star size={11} />{Number(game.bgg_rating).toFixed(1)}
        </span>
      )}

      {canEdit && onEdit && (
        <button onClick={e => { e.stopPropagation(); onEdit(game) }}
          className="btn-ghost p-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit2 size={13} />
        </button>
      )}

      {onSetStatus && (
        <div className="relative flex-shrink-0">
          <button onClick={e => { e.stopPropagation(); setMenuOpen(o => !o) }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all
              ${currentStatus ? 'bg-xogun-accent/20 text-xogun-accent border border-xogun-accent/30' : 'btn-secondary'}`}>
            {currentStatus ? currentStatus.emoji : <Plus size={12} />}
            <ChevronDown size={10} />
          </button>

          {menuOpen && (
            <div onClick={e => e.stopPropagation()}
              className="absolute top-full right-0 mt-1 w-44 bg-xogun-card border border-xogun-border rounded-lg overflow-hidden shadow-xl z-20 animate-fade-in">
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
                    <Eye size={11} /> {currentVisibility?.emoji} {currentVisibility?.label}
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

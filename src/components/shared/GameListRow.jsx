import { Users, Clock, Star, Plus, Check, Edit2 } from 'lucide-react'

export default function GameListRow({ game, userEntry, onAddToCollection, onEdit, canEdit, onClick }) {
  const image = game.images?.[0]

  return (
    <div onClick={() => onClick?.(game)}
      className="card flex items-center gap-3 hover:border-xogun-accent/50 transition-colors cursor-pointer group">
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-xogun-surface flex items-center justify-center flex-shrink-0">
        {image ? <img src={image} alt={game.name} className="w-full h-full object-cover" /> : <span className="text-xl">🎲</span>}
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

      {onAddToCollection && (
        <button onClick={e => { e.stopPropagation(); onAddToCollection(game) }}
          className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all
            ${userEntry ? 'bg-xogun-accent/20 text-xogun-accent border border-xogun-accent/30' : 'btn-secondary'}`}>
          {userEntry ? <Check size={12} /> : <Plus size={12} />}
        </button>
      )}
    </div>
  )
}

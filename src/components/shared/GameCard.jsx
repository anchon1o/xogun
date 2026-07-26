import { Users, Clock, Star, Plus, Check } from 'lucide-react'
import { useAppConfig } from '../../contexts/AppConfigContext'

export default function GameCard({ game, userEntry, onAddToCollection, onOpenDetail, compact = false }) {
  const { isFieldVisible } = useAppConfig()
  const image = game.images?.[0]

  return (
    <div onClick={() => onOpenDetail?.(game)}
      className="card-hover flex flex-col group animate-fade-in">
      {/* Cover */}
      <div className={`rounded-lg overflow-hidden bg-xogun-surface flex items-center justify-center mb-3 flex-shrink-0 ${compact ? 'h-28' : 'aspect-[4/3]'}`}>
        {image
          ? <img src={image} alt={game.name} className="w-full h-full object-cover" loading="lazy" />
          : <span className="text-4xl">🎲</span>
        }
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

      {/* Collection button */}
      {onAddToCollection && (
        <button onClick={e => { e.stopPropagation(); onAddToCollection(game) }}
          className={`mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all
            opacity-0 group-hover:opacity-100
            ${userEntry ? 'bg-xogun-accent/20 text-xogun-accent border border-xogun-accent/30' : 'btn-secondary'}`}>
          {userEntry ? <><Check size={11} /> Na miña colección</> : <><Plus size={11} /> Engadir</>}
        </button>
      )}
    </div>
  )
}

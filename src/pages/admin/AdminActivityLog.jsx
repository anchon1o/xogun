import { useActivityLog } from '../../hooks/useActivityLog'

const ACTION_LABELS = {
  game_approved: { label: 'Xogo aprobado', emoji: '✅', color: 'text-green-400' },
  game_rejected: { label: 'Xogo rexeitado', emoji: '❌', color: 'text-xogun-red' },
  suggestion_approved: { label: 'Suxestión aprobada', emoji: '✏️', color: 'text-green-400' },
  suggestion_rejected: { label: 'Suxestión rexeitada', emoji: '✏️', color: 'text-xogun-red' },
  preset_approved: { label: 'Preset aprobado', emoji: '🎲', color: 'text-green-400' },
  preset_rejected: { label: 'Preset rexeitado', emoji: '🎲', color: 'text-xogun-red' },
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 60) return 'agora mesmo'
  if (diff < 3600) return `hai ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `hai ${Math.floor(diff / 3600)} h`
  return `hai ${Math.floor(diff / 86400)} d`
}

export default function AdminActivityLog() {
  const { entries, loading } = useActivityLog()

  return (
    <div>
      <h2 className="font-display text-xl text-xogun-accent mb-2">Rexistro de actividade</h2>
      <p className="text-xogun-muted text-sm mb-5">Últimas 100 accións de moderación, máis recentes primeiro.</p>

      {loading ? (
        <p className="text-xogun-muted text-sm">Cargando...</p>
      ) : entries.length === 0 ? (
        <p className="text-xogun-muted text-sm">Aínda non hai actividade rexistrada.</p>
      ) : (
        <div className="space-y-1">
          {entries.map(e => {
            const action = ACTION_LABELS[e.action] || { label: e.action, emoji: '📋', color: 'text-xogun-muted' }
            return (
              <div key={e.id} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-xogun-surface transition-colors text-sm flex-wrap">
                <span className="text-lg flex-shrink-0">{action.emoji}</span>
                <span className={`flex-shrink-0 font-medium ${action.color}`}>{action.label}</span>
                <span className="text-xogun-muted flex-1 min-w-[100px] truncate">{e.target_name}</span>
                <span className="text-xogun-muted text-xs flex-shrink-0">{e.profiles?.display_name || 'Sistema'}</span>
                <span className="text-xogun-muted text-xs flex-shrink-0">{timeAgo(e.created_at)}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

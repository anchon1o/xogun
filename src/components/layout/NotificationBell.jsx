import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, X } from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'

const TYPE_EMOJI = {
  friend_request: '👋',
  friend_accepted: '🤝',
  suggestion_approved: '✏️',
  preset_approved: '🎲',
  game_approved: '📚',
  challenge_received: '⚔️',
  session_reminder: '📅',
  social_game: '🐺',
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
  if (diff < 60) return 'agora mesmo'
  if (diff < 3600) return `hai ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `hai ${Math.floor(diff / 3600)} h`
  return `hai ${Math.floor(diff / 86400)} d`
}

export default function NotificationBell({ userId }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, remove } = useNotifications(userId)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  function handleClick(n) {
    if (!n.read) markAsRead(n.id)
    if (n.link) { navigate(n.link); setOpen(false) }
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="relative btn-ghost p-1.5">
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-xogun-red text-white text-[9px] flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-80 max-w-[90vw] card shadow-xl z-50 p-0 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-xogun-border">
              <span className="text-sm font-medium">Notificacións</span>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xogun-accent text-xs hover:underline">Marcar todo como lido</button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-xogun-muted text-xs text-center py-8">Sen notificacións</p>
              ) : (
                notifications.map(n => (
                  <div key={n.id} onClick={() => handleClick(n)}
                    className={`flex items-start gap-2 px-3 py-2.5 border-b border-xogun-border/50 last:border-0 cursor-pointer hover:bg-xogun-surface transition-colors ${!n.read ? 'bg-xogun-accent/5' : ''}`}>
                    <span className="text-lg flex-shrink-0">{TYPE_EMOJI[n.type] || '🔔'}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${!n.read ? 'text-xogun-text' : 'text-xogun-muted'}`}>{n.title}</p>
                      {n.body && <p className="text-xogun-muted text-[11px] mt-0.5">{n.body}</p>}
                      <p className="text-xogun-muted text-[10px] mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); remove(n.id) }} className="text-xogun-muted hover:text-xogun-red flex-shrink-0">
                      <X size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

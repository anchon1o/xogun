import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { notifyUser } from '../../hooks/useNotifications'
import { logActivity } from '../../hooks/useActivityLog'
import { CheckCircle, XCircle } from 'lucide-react'

export default function AdminSuggestions() {
  const { user } = useAuth()
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetch() }, [])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase
      .from('game_edit_suggestions')
      .select('*, games(name), profiles!suggested_by(display_name)')
      .eq('status', 'pending')
      .order('created_at')
    setSuggestions(data || [])
    setLoading(false)
  }

  async function resolve(suggestion, status) {
    const { id, game_id: gameId, field, new_value: newValue, suggested_by } = suggestion
    await supabase.from('game_edit_suggestions')
      .update({ status, reviewed_by: user.id, reviewed_at: new Date().toISOString() })
      .eq('id', id)
    if (status === 'approved') {
      const update = { [field]: newValue }
      await supabase.from('games').update(update).eq('id', gameId)
    }
    logActivity(user.id, {
      action: status === 'approved' ? 'suggestion_approved' : 'suggestion_rejected',
      targetType: 'suggestion',
      targetName: `${suggestion.games?.name || 'xogo'} · ${field}`,
    })
    if (suggested_by) {
      notifyUser(suggested_by, {
        type: 'suggestion_approved',
        title: status === 'approved' ? 'Suxestión aprobada' : 'Suxestión rexeitada',
        body: `A túa suxestión para "${suggestion.games?.name}" foi ${status === 'approved' ? 'aprobada' : 'rexeitada'}`,
        link: '/catalogo',
      })
    }
    fetch()
  }

  return (
    <div>
      <h2 className="font-display text-xl text-xogun-accent mb-5">Suxestións de edición</h2>
      {loading ? <p className="text-xogun-muted text-sm">Cargando...</p> :
        suggestions.length === 0 ? <p className="text-xogun-muted text-sm">Non hai suxestións pendentes. ✅</p> : (
          <div className="space-y-3">
            {suggestions.map(s => (
              <div key={s.id} className="card space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{s.games?.name}</p>
                    <p className="text-xogun-muted text-xs">Campo: <span className="text-xogun-accent">{s.field}</span> · Por: {s.profiles?.display_name || 'Anónimo'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => resolve(s, 'approved')}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors">
                      <CheckCircle size={13} /> Aprobar
                    </button>
                    <button onClick={() => resolve(s, 'rejected')}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-xogun-red/30 text-xogun-red hover:bg-xogun-red/10 transition-colors">
                      <XCircle size={13} /> Rexeitar
                    </button>
                  </div>
                </div>
                {s.note && <p className="text-xogun-muted text-xs italic">"{s.note}"</p>}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {s.old_value !== null && (
                    <div className="bg-xogun-surface rounded p-2">
                      <p className="text-xogun-muted mb-1">Valor actual:</p>
                      <p className="text-xogun-text font-mono">{JSON.stringify(s.old_value)}</p>
                    </div>
                  )}
                  <div className="bg-xogun-accent/10 rounded p-2">
                    <p className="text-xogun-muted mb-1">Novo valor:</p>
                    <p className="text-xogun-accent font-mono">{JSON.stringify(s.new_value)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}

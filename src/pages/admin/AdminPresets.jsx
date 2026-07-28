import { useAllToolPresets } from '../../hooks/useToolPresets'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { CheckCircle, XCircle, Gamepad2 } from 'lucide-react'

const TOOL_LABELS = { dice: '🎲 Dados', scoreboard: '🏆 Marcador', timer: '⏱️ Temporizador', turns: '🔄 Turnos' }

export default function AdminPresets() {
  const { user } = useAuth()
  const { presets, loading, refetch } = useAllToolPresets()
  const pending = presets.filter(p => !p.approved)
  const approved = presets.filter(p => p.approved)

  async function approve(preset) {
    await supabase.from('score_templates').update({ approved: true }).eq('id', preset.id)
    refetch()
  }
  async function reject(preset) {
    if (!confirm(`Rexeitar e eliminar o preset "${preset.name}"?`)) return
    await supabase.from('score_templates').delete().eq('id', preset.id)
    refetch()
  }
  async function remove(preset) {
    if (!confirm(`Eliminar o preset "${preset.name}"?`)) return
    await supabase.from('score_templates').delete().eq('id', preset.id)
    refetch()
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl text-xogun-accent mb-5">Presets pendentes de aprobación</h2>
        {loading ? <p className="text-xogun-muted text-sm">Cargando...</p> :
          pending.length === 0 ? <p className="text-xogun-muted text-sm">Non hai presets pendentes. ✅</p> : (
            <div className="space-y-3">
              {pending.map(p => (
                <div key={p.id} className="card flex items-start gap-4">
                  <Gamepad2 size={20} className="text-xogun-muted flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xogun-muted text-xs">{p.games?.name || 'Xogo descoñecido'}</p>
                    <div className="flex gap-1 flex-wrap mt-1.5">
                      {(p.config?.tools || []).map(t => (
                        <span key={t} className="badge border-xogun-border text-xogun-muted text-[10px]">{TOOL_LABELS[t] || t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => approve(p)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors">
                      <CheckCircle size={13} /> Aprobar
                    </button>
                    <button onClick={() => reject(p)} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-xogun-red/30 text-xogun-red hover:bg-xogun-red/10 transition-colors">
                      <XCircle size={13} /> Rexeitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>

      <div>
        <h2 className="font-display text-xl text-xogun-accent mb-5">Presets aprobados</h2>
        {approved.length === 0 ? <p className="text-xogun-muted text-sm">Non hai presets aprobados aínda.</p> : (
          <div className="space-y-2">
            {approved.map(p => (
              <div key={p.id} className="card flex items-center gap-3">
                <Gamepad2 size={16} className="text-xogun-accent flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xogun-muted text-xs">{p.games?.name || 'Xogo descoñecido'}</p>
                </div>
                <button onClick={() => remove(p)} className="btn-ghost p-1.5 hover:text-xogun-red flex-shrink-0"><XCircle size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

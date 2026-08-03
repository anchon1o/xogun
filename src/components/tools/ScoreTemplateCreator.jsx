import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToolPresets } from '../../hooks/useToolPresets'
import { TEMPLATE_PRESETS } from '../../lib/scoreTemplates'

export default function ScoreTemplateCreator({ gameId, gameName, onClose, onCreated }) {
  const { user, profile } = useAuth()
  const { createPreset } = useToolPresets(gameId, user?.id)
  const [name, setName] = useState('')
  const [sections, setSections] = useState([{ id: crypto.randomUUID(), label: '' }])
  const [saving, setSaving] = useState(false)

  function applyPreset(preset) {
    setName(preset.name)
    setSections(preset.scoreSections.length
      ? preset.scoreSections.map(s => ({ id: crypto.randomUUID(), label: s.label }))
      : [{ id: crypto.randomUUID(), label: '' }])
  }

  function addSection() { setSections(s => [...s, { id: crypto.randomUUID(), label: '' }]) }
  function removeSection(id) { setSections(s => s.filter(x => x.id !== id)) }
  function updateSection(id, label) { setSections(s => s.map(x => x.id === id ? { ...x, label } : x)) }

  async function handleSave() {
    const validSections = sections.filter(s => s.label.trim())
    if (!name.trim() || validSections.length === 0 || !gameId) return
    setSaving(true)
    const config = {
      scoreSections: validSections.map(s => ({ id: s.id, label: s.label.trim(), type: 'number' })),
    }
    const { data, error } = await createPreset(user.id, name.trim(), config)
    setSaving(false)
    if (!error) onCreated?.(data)
  }

  if (!gameId) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal max-w-sm" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="font-display text-sm text-xogun-accent">Plantilla de marcador</h3>
            <button onClick={onClose}><X size={18} className="text-xogun-muted" /></button>
          </div>
          <div className="p-4">
            <p className="text-xogun-muted text-sm">
              Para crear unha plantilla precisas ter un xogo seleccionado na sesión.
              Volve a "Configurar sesión" e elixe un xogo primeiro.
            </p>
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="btn-primary">Entendido</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal max-w-md" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="font-display text-sm text-xogun-accent">Nova plantilla de marcador</h3>
          <button onClick={onClose}><X size={18} className="text-xogun-muted" /></button>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-xogun-muted text-xs">Para: <span className="text-xogun-text">{gameName}</span></p>

          <div>
            <label className="label">Partir dun preset (opcional)</label>
            <div className="flex gap-1.5 flex-wrap">
              {TEMPLATE_PRESETS.filter(p => p.scoreSections.length > 0).map(p => (
                <button key={p.name} onClick={() => applyPreset(p)} className="btn-secondary text-xs">{p.name}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Nome da plantilla</label>
            <input className="input" placeholder="Ex: Marcador oficial" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div>
            <label className="label">Categorías de puntuación</label>
            <div className="space-y-2">
              {sections.map((s, i) => (
                <div key={s.id} className="flex gap-2">
                  <input className="input flex-1" placeholder={`Categoría ${i + 1} (ex: Puntos de vitoria)`}
                    value={s.label} onChange={e => updateSection(s.id, e.target.value)} />
                  {sections.length > 1 && (
                    <button onClick={() => removeSection(s.id)} className="text-xogun-muted hover:text-xogun-red px-1"><Trash2 size={13} /></button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={addSection} className="btn-ghost flex items-center gap-1.5 text-xs mt-2">
              <Plus size={12} /> Engadir categoría
            </button>
          </div>

          {!profile?.is_admin && (
            <p className="text-xogun-accent text-xs bg-xogun-accent/10 border border-xogun-accent/30 rounded-lg px-3 py-2">
              ℹ️ Quedará pendente de aprobación antes de estar dispoñible para todos.
            </p>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleSave} disabled={saving || !name.trim()} className="btn-primary disabled:opacity-50">
            {saving ? 'Gardando...' : 'Gardar plantilla'}
          </button>
        </div>
      </div>
    </div>
  )
}

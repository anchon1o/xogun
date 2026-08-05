import { useState } from 'react'
import { Plus, Trash2, ArrowLeft, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { useCharacterTemplates, useCharacters } from '../../hooks/useCharacterSheets'
import { BUILTIN_TEMPLATES, getThemeStyle } from '../../lib/characterTemplates'

function NewCharacterForm({ allTemplates, onCreate, onCancel }) {
  const [templateId, setTemplateId] = useState(BUILTIN_TEMPLATES[0].id)
  const [name, setName] = useState('')

  return (
    <div className="card space-y-3">
      <div>
        <label className="label">Sistema de xogo</label>
        <select className="input" value={templateId} onChange={e => setTemplateId(e.target.value)}>
          {allTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Nome do personaxe</label>
        <input className="input" placeholder="Ex: Thalindra a Elfa" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <button onClick={onCancel} className="btn-secondary flex-1">Cancelar</button>
        <button onClick={() => name.trim() && onCreate(templateId, name.trim())} disabled={!name.trim()}
          className="btn-primary flex-1 disabled:opacity-50">Crear personaxe</button>
      </div>
    </div>
  )
}

function CharacterSheet({ character, template, onUpdate, onDelete, onBack }) {
  const toast = useToast()
  const style = getThemeStyle(template?.theme)
  const stats = template?.config?.stats || []
  const fields = template?.config?.fields || []
  const [data, setData] = useState(character.data || {})

  async function updateField(id, value) {
    const next = { ...data, [id]: value }
    setData(next)
    const { error } = await onUpdate(character.id, { data: next })
    if (error) toast.error('Non se puido gardar o cambio')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="btn-ghost text-xs flex items-center gap-1"><ArrowLeft size={13} /> Volver</button>
        <h3 className="font-display text-lg flex-1 truncate" style={{ color: style.accent }}>{style.emoji} {character.name}</h3>
        <button onClick={() => { if (confirm(`Eliminar "${character.name}"?`)) onDelete(character.id) }} className="text-xogun-muted hover:text-xogun-red">
          <Trash2 size={15} />
        </button>
      </div>

      <div className={`rounded-2xl p-4 bg-gradient-to-b ${style.bg} border`} style={{ borderColor: style.accent + '40' }}>
        {stats.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
            {stats.map(s => (
              <div key={s.id} className="text-center card py-2">
                <p className="text-xogun-muted text-[10px] uppercase tracking-wider">{s.abbr}</p>
                <input type="number" value={data[s.id] ?? ''} onChange={e => updateField(s.id, e.target.value)}
                  className="w-full text-center bg-transparent font-display text-2xl outline-none"
                  style={{ color: style.accent }} placeholder="—" />
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {fields.map(f => (
            <div key={f.id} className={f.type === 'textarea' ? 'col-span-2' : ''}>
              <label className="text-xogun-muted text-[11px] block mb-1">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea className="input" rows={4} value={data[f.id] || ''} onChange={e => updateField(f.id, e.target.value)} />
              ) : (
                <input type={f.type === 'number' ? 'number' : 'text'} className="input"
                  value={data[f.id] || ''} onChange={e => updateField(f.id, e.target.value)} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CharacterSheetWidget() {
  const { user } = useAuth()
  const toast = useToast()
  const { templates: customTemplates } = useCharacterTemplates(user?.id)
  const { characters, loading, createCharacter, updateCharacter, deleteCharacter } = useCharacters(user?.id)
  const [showNew, setShowNew] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const allTemplates = [...BUILTIN_TEMPLATES, ...customTemplates]

  if (!user) {
    return <p className="text-xogun-muted text-sm text-center py-8">Inicia sesión para crear e gardar personaxes.</p>
  }

  async function handleCreate(templateId, name) {
    const isBuiltin = templateId.startsWith('builtin-')
    const { data, error } = await createCharacter(isBuiltin ? null : templateId, isBuiltin ? templateId : null, name, {})
    if (error) { toast.error('Non se puido crear o personaxe'); return }
    setShowNew(false)
    if (data) setSelectedId(data.id)
  }

  function resolveTemplate(character) {
    if (character.template_id) return character.character_sheet_templates
    if (character.builtin_template_id) {
      return BUILTIN_TEMPLATES.find(t => t.id === character.builtin_template_id) || BUILTIN_TEMPLATES[0]
    }
    return BUILTIN_TEMPLATES[0]
  }

  const selected = characters.find(c => c.id === selectedId)

  if (selected) {
    return (
      <CharacterSheet character={selected} template={resolveTemplate(selected)}
        onUpdate={updateCharacter} onDelete={id => { deleteCharacter(id); setSelectedId(null) }}
        onBack={() => setSelectedId(null)} />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="label mb-0 flex items-center gap-1.5"><User size={11} /> Os meus personaxes</span>
        <button onClick={() => setShowNew(s => !s)} className="btn-ghost text-xs flex items-center gap-1"><Plus size={11} /> Novo</button>
      </div>

      {showNew && <NewCharacterForm allTemplates={allTemplates} onCreate={handleCreate} onCancel={() => setShowNew(false)} />}

      {loading ? (
        <p className="text-xogun-muted text-xs text-center py-3">Cargando...</p>
      ) : characters.length === 0 ? (
        <p className="text-xogun-muted text-xs text-center py-8">Aínda non tes personaxes. Crea o primeiro arriba.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {characters.map(c => {
            const template = resolveTemplate(c)
            const style = getThemeStyle(template?.theme)
            return (
              <button key={c.id} onClick={() => setSelectedId(c.id)}
                className={`card-hover text-left bg-gradient-to-b ${style.bg}`} style={{ borderColor: style.accent + '30' }}>
                <span className="text-2xl">{style.emoji}</span>
                <p className="text-sm font-medium mt-1 truncate">{c.name}</p>
                <p className="text-xogun-muted text-[10px] truncate">{template?.name || 'Personaxe'}</p>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

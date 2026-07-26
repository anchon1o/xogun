import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react'

function MetaSection({ title, table, emojiCol = false }) {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm]       = useState({ name: '', emoji: '', active: true })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { fetch() }, [table])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase.from(table).select('*').order('sort_order')
    setItems(data || []); setLoading(false)
  }

  function openCreate() { setEditItem(null); setForm({ name:'',emoji:'',active:true }); setShowForm(true) }
  function openEdit(item) { setEditItem(item); setForm({ name:item.name,emoji:item.emoji||'',active:item.active }); setShowForm(true) }

  async function handleSave() {
    if (!form.name.trim()) return
    if (editItem) await supabase.from(table).update({ name:form.name, emoji:form.emoji||null, active:form.active }).eq('id',editItem.id)
    else await supabase.from(table).insert({ name:form.name, emoji:form.emoji||null, active:form.active, sort_order: items.length })
    setShowForm(false); fetch()
  }

  async function handleDelete(id) {
    if (!confirm('Eliminar este elemento?')) return
    await supabase.from(table).delete().eq('id', id); fetch()
  }

  async function toggleActive(item) {
    await supabase.from(table).update({ active: !item.active }).eq('id', item.id); fetch()
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base text-xogun-accent">{title}</h3>
        <button onClick={openCreate} className="btn-secondary flex items-center gap-1 text-xs py-1"><Plus size={12} /> Engadir</button>
      </div>
      {loading ? <p className="text-xogun-muted text-xs">Cargando...</p> : (
        <div className="space-y-1">
          {items.map(item => (
            <div key={item.id} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${item.active ? '' : 'opacity-40'}`}>
              <GripVertical size={12} className="text-xogun-border flex-shrink-0" />
              {emojiCol && <span>{item.emoji}</span>}
              <span className="text-sm flex-1">{item.name}</span>
              <button onClick={() => toggleActive(item)} className={`text-xs px-2 py-0.5 rounded border transition-colors ${item.active ? 'border-green-500/30 text-green-400 hover:border-xogun-red/30 hover:text-xogun-red' : 'border-xogun-border text-xogun-muted hover:border-green-500/30 hover:text-green-400'}`}>
                {item.active ? 'Activo' : 'Inactivo'}
              </button>
              <button onClick={() => openEdit(item)} className="btn-ghost p-1"><Edit2 size={12} /></button>
              <button onClick={() => handleDelete(item.id)} className="btn-ghost p-1 hover:text-xogun-red"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      )}
      {showForm && (
        <div className="modal-backdrop">
          <div className="modal max-w-sm">
            <div className="modal-header">
              <h3 className="font-display text-base text-xogun-accent">{editItem ? 'Editar' : 'Engadir'} {title.toLowerCase()}</h3>
              <button onClick={() => setShowForm(false)} className="text-xogun-muted text-xl">×</button>
            </div>
            <div className="p-4 space-y-3">
              {emojiCol && <div><label className="label">Emoji</label><input className="input" value={form.emoji} onChange={e => setForm(f=>({...f,emoji:e.target.value}))} placeholder="🎲" /></div>}
              <div><label className="label">Nome</label><input className="input" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} autoFocus /></div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
              <button onClick={handleSave} className="btn-primary">Gardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminCatalog() {
  return (
    <div>
      <h2 className="font-display text-xl text-xogun-accent mb-5">Estrutura do catálogo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetaSection title="Categorías" table="game_categories" emojiCol={true} />
        <MetaSection title="Mecánicas" table="game_mechanics" emojiCol={false} />
      </div>
    </div>
  )
}

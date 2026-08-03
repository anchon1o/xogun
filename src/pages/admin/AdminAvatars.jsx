import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Trash2, Edit2 } from 'lucide-react'

export default function AdminAvatars() {
  const [avatars, setAvatars]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm]         = useState({ name: '', svg: '', active: true })
  const PREVIEW_COLOR           = '#c8a96e'

  useEffect(() => { fetch() }, [])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase.from('avatars').select('*').order('sort_order')
    setAvatars(data || []); setLoading(false)
  }

  function openCreate() { setEditItem(null); setForm({ name:'',svg:'',active:true }); setShowForm(true) }
  function openEdit(av) { setEditItem(av); setForm({ name:av.name,svg:av.svg,active:av.active }); setShowForm(true) }

  async function handleSave() {
    if (!form.name || !form.svg) return
    if (editItem) await supabase.from('avatars').update({ name:form.name,svg:form.svg,active:form.active }).eq('id',editItem.id)
    else await supabase.from('avatars').insert({ ...form, sort_order: avatars.length })
    setShowForm(false); fetch()
  }

  async function toggleActive(av) {
    await supabase.from('avatars').update({ active: !av.active }).eq('id', av.id); fetch()
  }

  async function handleDelete(id) {
    if (!confirm('Eliminar este avatar?')) return
    await supabase.from('avatars').delete().eq('id', id); fetch()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl text-xogun-accent">Avatares</h2>
        <button onClick={openCreate} className="btn-primary flex items-center gap-1.5 text-xs"><Plus size={13} /> Novo avatar</button>
      </div>

      {loading ? <p className="text-xogun-muted text-sm">Cargando...</p> : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {avatars.map(av => {
            const colored = av.svg.replace(/fill="currentColor"/g, `fill="${PREVIEW_COLOR}"`)
            return (
              <div key={av.id} className={`card text-center space-y-2 ${!av.active ? 'opacity-40' : ''}`}>
                <div className="w-12 h-12 mx-auto rounded-full p-2"
                  style={{ backgroundColor: PREVIEW_COLOR + '22' }}
                  dangerouslySetInnerHTML={{ __html: colored }} />
                <p className="text-xs text-xogun-muted truncate">{av.name}</p>
                <div className="flex gap-1 justify-center">
                  <button onClick={() => toggleActive(av)} className={`text-xs px-1.5 py-0.5 rounded border transition-colors ${av.active ? 'border-green-500/30 text-green-400' : 'border-xogun-border text-xogun-muted'}`}>
                    {av.active ? 'On' : 'Off'}
                  </button>
                  <button onClick={() => openEdit(av)} className="btn-ghost p-0.5"><Edit2 size={11} /></button>
                  <button onClick={() => handleDelete(av.id)} className="btn-ghost p-0.5 hover:text-xogun-red"><Trash2 size={11} /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal max-w-lg">
            <div className="modal-header">
              <h3 className="font-display text-base text-xogun-accent">{editItem ? 'Editar' : 'Novo'} avatar</h3>
              <button onClick={() => setShowForm(false)} className="text-xogun-muted text-xl">×</button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="label">Nome</label>
                <input className="input" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} /></div>
              <div><label className="label">SVG (código completo)</label>
                <textarea className="input font-mono text-xs" rows={6} value={form.svg}
                  onChange={e => setForm(f=>({...f,svg:e.target.value}))}
                  placeholder='<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">...</svg>' />
                <p className="text-xogun-muted text-[11px] mt-1">
                  Usa <code className="text-xogun-accent">fill="currentColor"</code> nas formas principais
                  para que o avatar herde a cor elixida por cada usuario.
                </p>
              </div>
              {form.svg && (
                <div>
                  <label className="label">Vista previa</label>
                  <div className="w-16 h-16 rounded-full p-2" style={{ backgroundColor: PREVIEW_COLOR + '22' }}
                    dangerouslySetInnerHTML={{ __html: form.svg.replace(/fill="currentColor"/g, `fill="${PREVIEW_COLOR}"`) }} />
                </div>
              )}
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

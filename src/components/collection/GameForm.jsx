import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppConfig } from '../../contexts/AppConfigContext'
import { useCatalogMeta } from '../../hooks/useCatalogMeta'
import { useGames } from '../../hooks/useGames'

export default function GameForm({ game, onClose, onSaved }) {
  const { user, profile } = useAuth()
  const { isFieldVisible } = useAppConfig()
  const { categories, mechanics } = useCatalogMeta()
  const { addGame, updateGame, checkDuplicate } = useGames()

  const [form, setForm] = useState({
    name: game?.name || '', description: game?.description || '',
    publisher: game?.publisher || '', designer: game?.designer || '',
    year_published: game?.year_published || '', min_players: game?.min_players || '',
    max_players: game?.max_players || '', min_duration: game?.min_duration || '',
    max_duration: game?.max_duration || '', age: game?.age || '',
    complexity: game?.complexity || '', bgg_rating: game?.bgg_rating || '',
    bgg_id: game?.bgg_id || '', images: game?.images || [],
    category_ids: game?.category_ids || [], mechanic_ids: game?.mechanic_ids || [],
  })
  const [newImageUrl, setNewImageUrl] = useState('')
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')
  const [duplicate, setDuplicate]     = useState(null)

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }
  function toggleArray(key, id) {
    setForm(f => { const arr = f[key] || []; return { ...f, [key]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id] } })
  }
  function addImage() { if (!newImageUrl.trim()) return; setForm(f => ({ ...f, images: [...f.images, newImageUrl.trim()] })); setNewImageUrl('') }
  function removeImage(idx) { setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) })) }

  async function handleSave() {
    if (!form.name.trim()) { setError('O nome é obrigatorio'); return }
    setSaving(true); setError('')
    if (!game) {
      const dup = await checkDuplicate(form.name, form.bgg_id || null)
      if (dup) { setDuplicate(dup); setSaving(false); return }
    }
    const numFields = ['year_published','min_players','max_players','min_duration','max_duration','age','bgg_id']
    const floatFields = ['complexity','bgg_rating']
    const payload = { ...form, added_by: user?.id, approved: profile?.is_admin || false,
      ...numFields.reduce((a,k) => ({ ...a, [k]: form[k]===''?null:Number(form[k]) }), {}),
      ...floatFields.reduce((a,k) => ({ ...a, [k]: form[k]===''?null:parseFloat(form[k]) }), {}),
    }
    const { error } = game ? await updateGame(game.id, payload) : await addGame(payload)
    if (error) { setError(error.message); setSaving(false) } else { onSaved?.(); onClose() }
  }

  if (duplicate) return (
    <div className="modal-backdrop">
      <div className="modal max-w-md">
        <div className="modal-header">
          <h2 className="font-display text-lg text-xogun-accent">Xogo xa existente</h2>
          <button onClick={onClose}><X size={18} className="text-xogun-muted" /></button>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-sm text-xogun-muted">Este xogo xa está no catálogo:</p>
          <div className="card"><p className="font-medium">{duplicate.name}</p>
            <p className="text-xs mt-1">{duplicate.approved ? '✅ Aprobado' : '⏳ Pendente de aprobación'}</p>
          </div>
          <p className="text-sm">Queres engadir este xogo á túa colección en vez de crear un duplicado?</p>
        </div>
        <div className="modal-footer">
          <button onClick={() => setDuplicate(null)} className="btn-secondary">Cancelar</button>
          <button onClick={() => { onSaved?.(duplicate); onClose() }} className="btn-primary">Engadir á colección</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2 className="font-display text-lg text-xogun-accent">{game ? 'Editar xogo' : 'Engadir xogo ao catálogo'}</h2>
          <button onClick={onClose}><X size={18} className="text-xogun-muted" /></button>
        </div>
        <div className="p-5 space-y-4">
          {!profile?.is_admin && !game && (
            <div className="bg-xogun-accent/10 border border-xogun-accent/30 rounded-lg px-3 py-2 text-xs text-xogun-accent">
              ℹ️ O xogo quedará pendente de aprobación polo administrador antes de aparecer no catálogo.
            </div>
          )}
          <div><label className="label">Nome *</label>
            <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nome do xogo" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Editorial</label><input className="input" value={form.publisher} onChange={e => set('publisher', e.target.value)} /></div>
            <div><label className="label">Deseñador</label><input className="input" value={form.designer} onChange={e => set('designer', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label">Ano</label><input className="input" type="number" value={form.year_published} onChange={e => set('year_published', e.target.value)} /></div>
            <div><label className="label">Idade</label><input className="input" type="number" value={form.age} onChange={e => set('age', e.target.value)} placeholder="8+" /></div>
            <div><label className="label">Complexidade (1-5)</label><input className="input" type="number" step="0.1" min={1} max={5} value={form.complexity} onChange={e => set('complexity', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div><label className="label">Xog. mín.</label><input className="input" type="number" min={1} value={form.min_players} onChange={e => set('min_players', e.target.value)} /></div>
            <div><label className="label">Xog. máx.</label><input className="input" type="number" min={1} value={form.max_players} onChange={e => set('max_players', e.target.value)} /></div>
            <div><label className="label">Dur. mín.</label><input className="input" type="number" value={form.min_duration} onChange={e => set('min_duration', e.target.value)} placeholder="min" /></div>
            <div><label className="label">Dur. máx.</label><input className="input" type="number" value={form.max_duration} onChange={e => set('max_duration', e.target.value)} placeholder="min" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">BGG ID</label><input className="input" type="number" value={form.bgg_id} onChange={e => set('bgg_id', e.target.value)} /></div>
            <div><label className="label">Puntuación BGG</label><input className="input" type="number" step="0.1" min={0} max={10} value={form.bgg_rating} onChange={e => set('bgg_rating', e.target.value)} /></div>
          </div>
          <div><label className="label">Imaxes (URLs)</label>
            <div className="space-y-2">
              {form.images.map((url, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <img src={url} alt="" className="w-10 h-10 object-cover rounded" onError={e => e.target.style.display='none'} />
                  <span className="text-xs text-xogun-muted flex-1 truncate">{url}</span>
                  <button onClick={() => removeImage(i)} className="text-xogun-muted hover:text-xogun-red"><Trash2 size={13} /></button>
                </div>
              ))}
              <div className="flex gap-2">
                <input className="input flex-1" placeholder="https://..." value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} onKeyDown={e => e.key==='Enter'&&addImage()} />
                <button onClick={addImage} className="btn-secondary px-3"><Plus size={14} /></button>
              </div>
            </div>
          </div>
          <div><label className="label">Categorías</label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map(c => (
                <button key={c.id} onClick={() => toggleArray('category_ids', c.id)}
                  className={`badge transition-colors ${form.category_ids.includes(c.id) ? 'border-xogun-accent text-xogun-accent bg-xogun-accent/10' : 'border-xogun-border text-xogun-muted hover:border-xogun-accent'}`}>
                  {c.emoji} {c.name}
                </button>
              ))}
            </div>
          </div>
          <div><label className="label">Mecánicas</label>
            <div className="flex flex-wrap gap-1.5">
              {mechanics.map(m => (
                <button key={m.id} onClick={() => toggleArray('mechanic_ids', m.id)}
                  className={`badge transition-colors ${form.mechanic_ids.includes(m.id) ? 'border-xogun-accent text-xogun-accent bg-xogun-accent/10' : 'border-xogun-border text-xogun-muted hover:border-xogun-accent'}`}>
                  {m.name}
                </button>
              ))}
            </div>
          </div>
          <div><label className="label">Descrición</label>
            <textarea className="input" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Breve descrición do xogo..." /></div>
          {error && <p className="text-xogun-red text-sm">{error}</p>}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? 'Gardando...' : game ? 'Gardar cambios' : 'Engadir ao catálogo'}
          </button>
        </div>
      </div>
    </div>
  )
}

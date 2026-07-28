import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAppConfig } from '../../contexts/AppConfigContext'
import { useCatalogMeta } from '../../hooks/useCatalogMeta'
import { useGames } from '../../hooks/useGames'
import { supabase } from '../../lib/supabase'
import ImagePreview from '../shared/ImagePreview'

export default function GameForm({ game, onClose, onSaved }) {
  const { user, profile } = useAuth()
  const { isFieldVisible } = useAppConfig()
  const { categories, mechanics } = useCatalogMeta()
  const { addGame, updateGame, checkDuplicate } = useGames()
  const isAdmin = !!profile?.is_admin

  const [form, setForm] = useState({
    name: game?.name || '', description: game?.description || '',
    publisher: game?.publisher || '', designer: game?.designer || '',
    year_published: game?.year_published || '', min_players: game?.min_players || '',
    max_players: game?.max_players || '', min_duration: game?.min_duration || '',
    max_duration: game?.max_duration || '', age: game?.age || '',
    complexity: game?.complexity || '', bgg_rating: game?.bgg_rating || '',
    bgg_id: game?.bgg_id || '', images: game?.images || [],
    videos: game?.videos || [], rules_url: game?.rules_url || '',
    category_ids: game?.category_ids || [], mechanic_ids: game?.mechanic_ids || [],
  })
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newVideoUrl, setNewVideoUrl] = useState('')
  const [newVideoTitle, setNewVideoTitle] = useState('')
  const [newVideoType, setNewVideoType] = useState('tutorial')
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')
  const [duplicate, setDuplicate]     = useState(null)
  const [suggestionSent, setSuggestionSent] = useState(false)

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }
  function toggleArray(key, id) {
    setForm(f => { const arr = f[key] || []; return { ...f, [key]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id] } })
  }
  function addImage() { if (!newImageUrl.trim()) return; setForm(f => ({ ...f, images: [...f.images, newImageUrl.trim()] })); setNewImageUrl('') }
  function removeImage(idx) { setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) })) }
  function addVideo() {
    if (!newVideoUrl.trim()) return
    setForm(f => ({ ...f, videos: [...f.videos, { url: newVideoUrl.trim(), title: newVideoTitle.trim() || 'Vídeo', type: newVideoType }] }))
    setNewVideoUrl(''); setNewVideoTitle('')
  }
  function removeVideo(idx) { setForm(f => ({ ...f, videos: f.videos.filter((_, i) => i !== idx) })) }

  async function handleSave() {
    if (!form.name.trim()) { setError('O nome é obrigatorio'); return }
    setSaving(true); setError('')

    // Creación dun xogo novo (sen game existente)
    if (!game) {
      const dup = await checkDuplicate(form.name, form.bgg_id || null)
      if (dup) { setDuplicate(dup); setSaving(false); return }

      const numFields = ['year_published','min_players','max_players','min_duration','max_duration','age','bgg_id']
      const floatFields = ['complexity','bgg_rating']
      const payload = { ...form, added_by: user?.id, approved: isAdmin,
        ...numFields.reduce((a,k) => ({ ...a, [k]: form[k]===''?null:Number(form[k]) }), {}),
        ...floatFields.reduce((a,k) => ({ ...a, [k]: form[k]===''?null:parseFloat(form[k]) }), {}),
      }
      const { error } = await addGame(payload)
      if (error) { setError(error.message); setSaving(false) } else { onSaved?.(); onClose() }
      return
    }

    // Edición dun xogo existente
    const numFields = ['year_published','min_players','max_players','min_duration','max_duration','age','bgg_id']
    const floatFields = ['complexity','bgg_rating']
    const normalized = { ...form,
      ...numFields.reduce((a,k) => ({ ...a, [k]: form[k]===''?null:Number(form[k]) }), {}),
      ...floatFields.reduce((a,k) => ({ ...a, [k]: form[k]===''?null:parseFloat(form[k]) }), {}),
    }

    if (isAdmin) {
      // Admin: edición directa
      const { error } = await updateGame(game.id, normalized)
      if (error) { setError(error.message); setSaving(false) } else { onSaved?.(); onClose() }
    } else {
      // Usuario normal: crear suxestións de edición por cada campo cambiado
      const changedFields = Object.keys(normalized).filter(key => {
        const oldVal = game[key]
        const newVal = normalized[key]
        return JSON.stringify(oldVal ?? null) !== JSON.stringify(newVal ?? null)
      })

      if (changedFields.length === 0) { setSaving(false); onClose(); return }

      const suggestions = changedFields.map(field => ({
        game_id: game.id,
        suggested_by: user.id,
        field,
        old_value: game[field] ?? null,
        new_value: normalized[field] ?? null,
      }))

      const { error } = await supabase.from('game_edit_suggestions').insert(suggestions)
      if (error) { setError(error.message); setSaving(false) }
      else {
        setSuggestionSent(true)
        setSaving(false)
        setTimeout(() => { onClose() }, 1800)
      }
    }
  }

  if (suggestionSent) return (
    <div className="modal-backdrop">
      <div className="modal max-w-sm">
        <div className="p-8 text-center">
          <div className="text-4xl mb-3">✅</div>
          <p className="font-display text-lg text-xogun-accent mb-1">Suxestión enviada</p>
          <p className="text-xogun-muted text-sm">Un administrador revisará os teus cambios antes de que se apliquen.</p>
        </div>
      </div>
    </div>
  )

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
          <h2 className="font-display text-lg text-xogun-accent">{!game ? 'Engadir xogo ao catálogo' : isAdmin ? 'Editar xogo' : 'Suxerir edición'}</h2>
          <button onClick={onClose}><X size={18} className="text-xogun-muted" /></button>
        </div>
        <div className="p-5 space-y-4">
          {!isAdmin && !game && (
            <div className="bg-xogun-accent/10 border border-xogun-accent/30 rounded-lg px-3 py-2 text-xs text-xogun-accent">
              ℹ️ O xogo quedará pendente de aprobación polo administrador antes de aparecer no catálogo.
            </div>
          )}
          {!isAdmin && game && (
            <div className="bg-xogun-accent/10 border border-xogun-accent/30 rounded-lg px-3 py-2 text-xs text-xogun-accent">
              ℹ️ Como non es administrador, os teus cambios enviaranse como suxestión de edición para revisión.
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
                  <ImagePreview src={url} size={40} />
                  <span className="text-xs text-xogun-muted flex-1 truncate">{url}</span>
                  <button onClick={() => removeImage(i)} className="text-xogun-muted hover:text-xogun-red"><Trash2 size={13} /></button>
                </div>
              ))}
              <div className="flex gap-2 items-center">
                {newImageUrl.trim() && <ImagePreview src={newImageUrl.trim()} size={40} />}
                <input className="input flex-1" placeholder="https://..." value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} onKeyDown={e => e.key==='Enter'&&addImage()} />
                <button onClick={addImage} className="btn-secondary px-3"><Plus size={14} /></button>
              </div>
            </div>
          </div>

          <div><label className="label">Manual de instrucións (URL)</label>
            <input className="input" placeholder="https://... (PDF ou web da editorial)" value={form.rules_url} onChange={e => set('rules_url', e.target.value)} />
          </div>

          <div><label className="label">Vídeos (tutoriais, gameplays, reseñas...)</label>
            <div className="space-y-2">
              {form.videos.map((v, i) => (
                <div key={i} className="flex gap-2 items-center bg-xogun-surface rounded-lg px-2 py-1.5">
                  <span className="badge border-xogun-border text-xogun-muted text-[10px] flex-shrink-0">{v.type}</span>
                  <span className="text-xs flex-1 truncate">{v.title}</span>
                  <button onClick={() => removeVideo(i)} className="text-xogun-muted hover:text-xogun-red flex-shrink-0"><Trash2 size={13} /></button>
                </div>
              ))}
              <div className="flex gap-2 flex-wrap">
                <select className="input w-32 flex-shrink-0" value={newVideoType} onChange={e => setNewVideoType(e.target.value)}>
                  <option value="tutorial">Tutorial</option>
                  <option value="gameplay">Gameplay</option>
                  <option value="review">Reseña</option>
                  <option value="quick">Partida rápida</option>
                </select>
                <input className="input flex-1 min-w-[120px]" placeholder="Título" value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} />
                <input className="input flex-1 min-w-[160px]" placeholder="URL de YouTube" value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} onKeyDown={e => e.key==='Enter'&&addVideo()} />
                <button onClick={addVideo} className="btn-secondary px-3 flex-shrink-0"><Plus size={14} /></button>
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
            {saving ? 'Gardando...' : !game ? 'Engadir ao catálogo' : isAdmin ? 'Gardar cambios' : 'Enviar suxestión'}
          </button>
        </div>
      </div>
    </div>
  )
}

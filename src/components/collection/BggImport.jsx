import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { X, Upload, CheckCircle } from 'lucide-react'

export default function BggImport({ onClose, onImported, userId }) {
  const [step, setStep]     = useState('upload')
  const [games, setGames]   = useState([])
  const [selected, setSelected] = useState(new Set())
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError]   = useState('')

  function parseXml(xml) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xml, 'text/xml')
    const items = doc.querySelectorAll('item')
    const parsed = []
    items.forEach(item => {
      const own = item.querySelector('status')?.getAttribute('own')
      if (own !== '1') return
      const get = sel => { const el = item.querySelector(sel); return el ? el.textContent.trim() : null }
      parsed.push({
        bgg_id:        parseInt(item.getAttribute('objectid')) || null,
        name:          get('name') || 'Sen nome',
        year_published: parseInt(get('yearpublished')) || null,
        min_players:   parseInt(item.querySelector('stats')?.getAttribute('minplayers')) || null,
        max_players:   parseInt(item.querySelector('stats')?.getAttribute('maxplayers')) || null,
        min_duration:  parseInt(item.querySelector('stats')?.getAttribute('minplaytime')) || null,
        max_duration:  parseInt(item.querySelector('stats')?.getAttribute('playingtime')) || null,
        bgg_rating:    parseFloat(item.querySelector('stats rating average')?.getAttribute('value')) || null,
        images:        item.querySelector('image') ? [get('image')] : [],
        approved:      true,
        added_by:      userId,
      })
    })
    return parsed
  }

  function handleFile(e) {
    const file = e.target.files[0]; if (!file) return
    setError('')
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const parsed = parseXml(ev.target.result)
        if (!parsed.length) { setError('Non se atoparon xogos marcados como "poseídos".'); return }
        setGames(parsed); setSelected(new Set(parsed.map((_, i) => i))); setStep('preview')
      } catch { setError('Erro ao procesar o arquivo XML.') }
    }
    reader.readAsText(file)
  }

  async function handleImport() {
    setImporting(true)
    const toImport = games.filter((_, i) => selected.has(i))
    const { error } = await supabase.from('games').upsert(toImport, { onConflict: 'bgg_id', ignoreDuplicates: false })
    if (error) { setError(error.message); setImporting(false) }
    else {
      if (userId) {
        // auto-add to user collection
        const { data: inserted } = await supabase.from('games').select('id,bgg_id').in('bgg_id', toImport.map(g => g.bgg_id).filter(Boolean))
        if (inserted?.length) {
          await supabase.from('user_games').upsert(inserted.map(g => ({ user_id: userId, game_id: g.id, status: 'owned' })), { onConflict: 'user_id,game_id', ignoreDuplicates: true })
        }
      }
      setResult(toImport.length); setStep('done'); onImported?.()
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2 className="font-display text-lg text-xogun-accent">Importar desde BoardGameGeek</h2>
          <button onClick={onClose}><X size={18} className="text-xogun-muted" /></button>
        </div>
        <div className="p-5">
          {step === 'upload' && (
            <div className="space-y-4">
              <div className="bg-xogun-surface rounded-lg p-4 text-sm text-xogun-muted space-y-1">
                <p className="font-medium text-xogun-text">Como exportar de BGG:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Vai a boardgamegeek.com → o teu perfil</li>
                  <li>Abre a túa colección → exportar como XML</li>
                  <li>Sube o arquivo aquí</li>
                </ol>
              </div>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-xogun-border rounded-xl p-8 cursor-pointer hover:border-xogun-accent transition-colors">
                <Upload size={24} className="text-xogun-muted mb-2" />
                <span className="text-xogun-muted text-sm">Seleccionar arquivo XML de BGG</span>
                <input type="file" accept=".xml" className="hidden" onChange={handleFile} />
              </label>
              {error && <p className="text-xogun-red text-sm">{error}</p>}
            </div>
          )}
          {step === 'preview' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-xogun-muted">{selected.size} de {games.length} xogos seleccionados</p>
                <button onClick={() => selected.size === games.length ? setSelected(new Set()) : setSelected(new Set(games.map((_,i)=>i)))} className="btn-ghost text-xs">
                  {selected.size === games.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
                </button>
              </div>
              <div className="space-y-1 max-h-80 overflow-y-auto">
                {games.map((g, i) => (
                  <label key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-xogun-surface cursor-pointer">
                    <input type="checkbox" checked={selected.has(i)} onChange={() => setSelected(s => { const n=new Set(s); n.has(i)?n.delete(i):n.add(i); return n })} className="accent-xogun-accent" />
                    <span className="text-sm flex-1">{g.name}</span>
                    <span className="text-xogun-muted text-xs">{g.year_published}</span>
                    {g.bgg_rating && <span className="text-xogun-accent text-xs">★{g.bgg_rating.toFixed(1)}</span>}
                  </label>
                ))}
              </div>
              {error && <p className="text-xogun-red text-sm">{error}</p>}
            </div>
          )}
          {step === 'done' && (
            <div className="text-center py-8">
              <CheckCircle size={48} className="text-green-400 mx-auto mb-3" />
              <p className="font-display text-xl">{result} xogos importados</p>
              <p className="text-xogun-muted text-sm mt-1">Engadidos ao catálogo e á túa colección</p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          {step === 'done' ? <button onClick={onClose} className="btn-primary">Pechar</button>
          : step === 'preview' ? <>
            <button onClick={() => setStep('upload')} className="btn-secondary">Atrás</button>
            <button onClick={handleImport} disabled={importing||!selected.size} className="btn-primary disabled:opacity-50">
              {importing ? 'Importando...' : `Importar ${selected.size} xogos`}
            </button>
          </> : <button onClick={onClose} className="btn-secondary">Cancelar</button>}
        </div>
      </div>
    </div>
  )
}

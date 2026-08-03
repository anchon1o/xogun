import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { Search, Check, ImageOff, Zap, Loader2 } from 'lucide-react'
import ImagePreview from '../../components/shared/ImagePreview'

// Comproba se unha imaxe carga de verdade (non abonda con recibir a URL de BGG,
// xa que moitas están bloqueadas por hotlink e nunca chegan a renderizar).
function testImageLoads(url) {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
    setTimeout(() => resolve(false), 6000)
  })
}

export default function AdminImages() {
  const [games, setGames]     = useState([])
  const [loading, setLoading] = useState(true)
  const [inputs, setInputs]   = useState({})
  const [savedCount, setSavedCount] = useState(0)
  const [bulkRunning, setBulkRunning] = useState(false)
  const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0, found: 0 })
  const firstInputRef = useRef(null)

  useEffect(() => { fetch() }, [])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase
      .from('games')
      .select('id, name, images, bgg_id')
      .eq('approved', true)
      .order('name')
    const missing = (data || []).filter(g => !g.images || g.images.length === 0)
    setGames(missing)
    setLoading(false)
    setTimeout(() => firstInputRef.current?.focus(), 100)
  }

  function searchUrl(name) {
    return `https://www.google.com/search?q=${encodeURIComponent(name + ' xogo de mesa')}&tbm=isch`
  }

  async function saveImage(gameId, url) {
    if (!url.trim()) return
    await supabase.from('games').update({ images: [url.trim()] }).eq('id', gameId)
    setGames(g => g.filter(x => x.id !== gameId))
    setInputs(i => { const n = { ...i }; delete n[gameId]; return n })
    setSavedCount(c => c + 1)
    setTimeout(() => {
      const next = document.querySelector('[data-image-input]')
      next?.focus()
    }, 50)
  }

  // Intenta traer automaticamente a imaxe de BGG para todos os xogos que
  // teñan bgg_id, comprobando que a imaxe carga de verdade antes de gardala.
  async function runBulkImport() {
    const withBggId = games.filter(g => g.bgg_id)
    if (withBggId.length === 0) return
    setBulkRunning(true)
    setBulkProgress({ done: 0, total: withBggId.length, found: 0 })

    let found = 0
    for (let i = 0; i < withBggId.length; i++) {
      const game = withBggId[i]
      try {
        const res = await fetch(`/api/bgg-import?id=${game.bgg_id}`)
        const data = await res.json()
        const imageUrl = data.images?.[0]
        if (imageUrl) {
          const loads = await testImageLoads(imageUrl)
          if (loads) {
            await supabase.from('games').update({ images: [imageUrl] }).eq('id', game.id)
            setGames(g => g.filter(x => x.id !== game.id))
            found++
          }
        }
      } catch {
        // ignora erros individuais e segue co seguinte
      }
      setBulkProgress({ done: i + 1, total: withBggId.length, found })
      // Pequena pausa para non saturar a API de BGG
      await new Promise(r => setTimeout(r, 300))
    }
    setSavedCount(c => c + found)
    setBulkRunning(false)
  }

  const withBggIdCount = games.filter(g => g.bgg_id).length

  return (
    <div>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <h2 className="font-display text-xl text-xogun-accent">Imaxes pendentes</h2>
        {savedCount > 0 && <span className="text-xogun-accent text-sm">✓ {savedCount} gardadas nesta sesión</span>}
      </div>

      {withBggIdCount > 0 && (
        <div className="card mb-4 flex items-center gap-3 flex-wrap">
          <Zap size={18} className="text-xogun-accent flex-shrink-0" />
          <div className="flex-1 min-w-[200px]">
            <p className="text-sm font-medium">Importación rápida dende BGG</p>
            <p className="text-xogun-muted text-xs">
              {withBggIdCount} xogos teñen ID de BGG — pódese intentar traer a súa imaxe automaticamente
              (só se garda se a imaxe carga de verdade).
            </p>
          </div>
          {bulkRunning ? (
            <div className="flex items-center gap-2 text-xs text-xogun-muted flex-shrink-0">
              <Loader2 size={14} className="animate-spin" />
              {bulkProgress.done}/{bulkProgress.total} · {bulkProgress.found} atopadas
            </div>
          ) : (
            <button onClick={runBulkImport} className="btn-primary flex items-center gap-1.5 text-xs flex-shrink-0">
              <Zap size={13} /> Intentar traer todas
            </button>
          )}
        </div>
      )}

      <p className="text-xogun-muted text-sm mb-5">
        Para o resto: clic en 🔍 para buscar a imaxe en Google (ábrese noutra pestana),
        despois fai clic dereito → "Copiar enderezo da imaxe" e pégao aquí. Ao premer Enter gárdase automaticamente.
      </p>

      {loading ? (
        <p className="text-xogun-muted text-sm">Cargando...</p>
      ) : games.length === 0 ? (
        <p className="text-xogun-muted text-sm">🎉 Todos os xogos teñen imaxe.</p>
      ) : (
        <div className="space-y-2">
          <p className="text-xogun-muted text-xs">{games.length} xogos sen imaxe</p>
          {games.map((g, i) => (
            <div key={g.id} className="card flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <div className="w-10 h-10 rounded-lg bg-xogun-surface flex items-center justify-center flex-shrink-0">
                {inputs[g.id]?.trim() ? <ImagePreview src={inputs[g.id].trim()} size={40} /> : <ImageOff size={16} className="text-xogun-muted" />}
              </div>
              <span className="text-sm truncate flex-1 min-w-[100px] basis-full sm:basis-auto">{g.name}</span>
              <a href={searchUrl(g.name)} target="_blank" rel="noopener noreferrer"
                className="btn-ghost p-2 flex-shrink-0" title="Buscar en Google Imaxes">
                <Search size={15} />
              </a>
              <input
                ref={i === 0 ? firstInputRef : null}
                data-image-input
                className="input flex-1 min-w-0"
                placeholder="Pega aquí a URL da imaxe..."
                value={inputs[g.id] || ''}
                onChange={e => setInputs(prev => ({ ...prev, [g.id]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && saveImage(g.id, inputs[g.id] || '')}
              />
              <button onClick={() => saveImage(g.id, inputs[g.id] || '')}
                disabled={!inputs[g.id]?.trim()}
                className="btn-secondary p-2 flex-shrink-0 disabled:opacity-30">
                <Check size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Gamepad2, Plus, X, Users, LayoutList } from 'lucide-react'
import { useGames } from '../../hooks/useGames'
import { useGameSession } from '../../contexts/GameSessionContext'
import { useToolPresets } from '../../hooks/useToolPresets'

export default function SessionSetup({ onDone, onSkip }) {
  const { startSession } = useGameSession()
  const [search, setSearch] = useState('')
  const [selectedGame, setSelectedGame] = useState(null)
  const [names, setNames] = useState(['', ''])
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)
  const { games } = useGames({ search })
  const { presets } = useToolPresets(selectedGame?.id)

  const scoreTemplates = presets.filter(p => p.config?.scoreSections?.length > 0)

  useEffect(() => { setSelectedTemplateId(null) }, [selectedGame?.id])

  function updateName(i, val) { setNames(n => n.map((x, j) => j === i ? val : x)) }
  function addSlot() { setNames(n => [...n, '']) }
  function removeSlot(i) { setNames(n => n.filter((_, j) => j !== i)) }

  function confirm() {
    const validNames = names.map(n => n.trim()).filter(Boolean)
    const finalNames = validNames.length > 0 ? validNames : ['Xogador 1', 'Xogador 2']
    const template = scoreTemplates.find(t => t.id === selectedTemplateId) || null
    startSession(selectedGame, finalNames, template)
    onDone?.()
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="text-center mb-6">
        <Gamepad2 size={40} className="text-xogun-accent mx-auto mb-3" />
        <h2 className="font-display text-xl text-xogun-text mb-1">Configurar sesión</h2>
        <p className="text-xogun-muted text-sm">O xogo e os xogadores compartiranse en todas as ferramentas.</p>
      </div>

      {/* Game picker */}
      <div className="mb-5">
        <label className="label">Xogo (opcional)</label>
        {selectedGame ? (
          <div className="flex items-center gap-2 card py-2">
            {selectedGame.images?.[0]
              ? <img src={selectedGame.images[0]} className="w-8 h-8 rounded object-cover" />
              : <span className="text-lg">🎲</span>}
            <span className="text-sm flex-1">{selectedGame.name}</span>
            <button onClick={() => setSelectedGame(null)} className="text-xogun-muted hover:text-xogun-red"><X size={14} /></button>
          </div>
        ) : (
          <>
            <input className="input" placeholder="Buscar xogo..." value={search} onChange={e => setSearch(e.target.value)} />
            {search && (
              <div className="mt-1 space-y-1 max-h-40 overflow-y-auto">
                {games.slice(0, 6).map(g => (
                  <button key={g.id} onClick={() => { setSelectedGame(g); setSearch('') }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-xogun-card transition-colors text-sm text-left">
                    {g.images?.[0] ? <img src={g.images[0]} className="w-6 h-6 rounded object-cover" /> : <span>🎲</span>}
                    {g.name}
                  </button>
                ))}
                {games.length === 0 && <p className="text-xogun-muted text-xs py-2 px-1">Sen resultados</p>}
              </div>
            )}
          </>
        )}
      </div>

      {/* Score template picker (only if game selected and has templates) */}
      {selectedGame && scoreTemplates.length > 0 && (
        <div className="mb-5">
          <label className="label flex items-center gap-1.5"><LayoutList size={11} /> Plantilla de marcador</label>
          <div className="space-y-1.5">
            <button onClick={() => setSelectedTemplateId(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${!selectedTemplateId ? 'border-xogun-accent text-xogun-accent bg-xogun-accent/10' : 'border-xogun-border text-xogun-muted hover:border-xogun-accent'}`}>
              Xenérico (rondas simples)
            </button>
            {scoreTemplates.map(t => (
              <button key={t.id} onClick={() => setSelectedTemplateId(t.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${selectedTemplateId === t.id ? 'border-xogun-accent text-xogun-accent bg-xogun-accent/10' : 'border-xogun-border text-xogun-muted hover:border-xogun-accent'}`}>
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Players */}
      <div className="mb-6">
        <label className="label flex items-center gap-1.5"><Users size={11} /> Xogadores</label>
        <div className="space-y-2">
          {names.map((n, i) => (
            <div key={i} className="flex gap-2">
              <input className="input flex-1" placeholder={`Xogador ${i + 1}`} value={n}
                onChange={e => updateName(i, e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSlot()} />
              {names.length > 1 && (
                <button onClick={() => removeSlot(i)} className="text-xogun-muted hover:text-xogun-red px-1"><X size={14} /></button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addSlot} className="btn-ghost flex items-center gap-1 text-xs mt-2">
          <Plus size={12} /> Engadir xogador
        </button>
      </div>

      <div className="flex gap-2">
        {onSkip && <button onClick={onSkip} className="btn-secondary flex-1">Omitir</button>}
        <button onClick={confirm} className="btn-primary flex-1">Comezar sesión</button>
      </div>
    </div>
  )
}

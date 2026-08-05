import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { useAppConfig } from '../../contexts/AppConfigContext'
import { useToast } from '../../contexts/ToastContext'
import Logo from '../../components/shared/Logo'

export default function AdminAppearance() {
  const { config, updateConfig } = useAppConfig()
  const toast = useToast()
  const [appName, setAppName] = useState(config.app_name || 'Xōgun')
  const [logoUrl, setLogoUrl] = useState(config.logo_url || '')
  const [newColor, setNewColor] = useState('#e8955a')

  const accentPresets = config.accent_presets || []

  async function addColor() {
    if (accentPresets.includes(newColor)) return
    await updateConfig('accent_presets', [...accentPresets, newColor])
  }

  async function removeColor(color) {
    await updateConfig('accent_presets', accentPresets.filter(c => c !== color))
  }

  async function saveName() {
    await updateConfig('app_name', appName)
    toast.success('Nome gardado')
  }

  async function saveLogo() {
    await updateConfig('logo_url', logoUrl || null)
    toast.success('Logo gardado')
  }

  function resetLogo() {
    setLogoUrl('')
    updateConfig('logo_url', null)
  }

  const fields = config.visible_game_fields || {}
  function toggleField(key) {
    updateConfig('visible_game_fields', { ...fields, [key]: !fields[key] })
  }

  const FIELD_LABELS = {
    description: 'Descrición', min_players: 'Xogadores mínimos', max_players: 'Xogadores máximos',
    min_duration: 'Duración mínima', max_duration: 'Duración máxima', age: 'Idade',
    complexity: 'Complexidade', bgg_rating: 'Puntuación BGG', bgg_id: 'ID de BGG',
    categories: 'Categorías', mechanics: 'Mecánicas', images: 'Imaxes',
    publisher: 'Editorial', designer: 'Deseñador',
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl text-xogun-accent">Aparencia</h2>

      <div className="card space-y-4">
        <h3 className="font-medium text-sm text-xogun-muted uppercase tracking-wider">Logo</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-xogun-surface border border-xogun-border flex items-center justify-center">
            <Logo size={40} />
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-xogun-muted text-xs">
              Por defecto úsase o selo de Xōgun, que se adapta automaticamente á cor de acento do tema.
              Podes subilo a calquera servizo de imaxes (imgur, etc.) e pegar aquí a URL para usar un logo personalizado.
            </p>
            <div className="flex gap-2">
              <input className="input flex-1" placeholder="https://... (URL da imaxe do logo)"
                value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
              <button onClick={saveLogo} className="btn-primary flex-shrink-0">Gardar</button>
            </div>
            {config.logo_url && (
              <button onClick={resetLogo} className="text-xogun-muted text-xs hover:text-xogun-red transition-colors underline">
                Restaurar selo por defecto
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-medium text-sm text-xogun-muted uppercase tracking-wider">Paleta de cores dispoñibles</h3>
        <p className="text-xogun-muted text-xs">
          Cores que os usuarios poden elixir como cor de acento no seu perfil.
        </p>
        <div className="flex flex-wrap gap-2">
          {accentPresets.map(color => (
            <div key={color} className="relative group">
              <div className="w-10 h-10 rounded-lg border-2 border-xogun-border" style={{ backgroundColor: color }} />
              <button onClick={() => removeColor(color)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-xogun-red text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)}
            className="w-10 h-10 rounded-lg border-2 border-xogun-border cursor-pointer p-0" />
          <button onClick={addColor} className="btn-secondary flex items-center gap-1.5 text-xs">
            <Plus size={12} /> Engadir cor
          </button>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-medium text-sm text-xogun-muted uppercase tracking-wider">Nome da aplicación</h3>
        <div className="flex gap-2">
          <input className="input flex-1" value={appName} onChange={e => setAppName(e.target.value)} />
          <button onClick={saveName} className="btn-primary">Gardar</button>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-medium text-sm text-xogun-muted uppercase tracking-wider">Campos visibles nas fichas de xogo</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(FIELD_LABELS).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={fields[key] !== false} onChange={() => toggleField(key)} className="accent-xogun-accent" />
              <span className="text-sm text-xogun-text">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

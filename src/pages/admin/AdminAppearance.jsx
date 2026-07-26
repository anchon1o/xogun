import { useState } from 'react'
import { useAppConfig } from '../../contexts/AppConfigContext'

const ACCENT_PRESETS = [
  '#c8a96e','#e8c87a','#6e8dc8','#6ec87e','#c86e6e',
  '#c86ec8','#6ec8c8','#e87a6e','#a86ec8','#6ec8a8',
]

export default function AdminAppearance() {
  const { config, updateConfig } = useAppConfig()
  const [appName, setAppName] = useState(config.app_name || 'Xogún')

  async function saveName() {
    await updateConfig('app_name', appName)
    alert('Nome gardado')
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

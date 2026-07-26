import { useAppConfig } from '../../contexts/AppConfigContext'

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-xogun-border last:border-0">
      <div>
        <p className="text-sm font-medium text-xogun-text">{label}</p>
        {description && <p className="text-xogun-muted text-xs mt-0.5">{description}</p>}
      </div>
      <button onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-xogun-accent' : 'bg-xogun-border'}`}>
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}

export default function AdminFeatures() {
  const { config, updateConfig } = useAppConfig()

  function updateFeature(key, value) {
    updateConfig('features', { ...config.features, [key]: value })
  }
  function updateTool(key, value) {
    updateConfig('tools_enabled', { ...config.tools_enabled, [key]: value })
  }

  const features = config.features || {}
  const tools = config.tools_enabled || {}

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl text-xogun-accent">Funcionalidades</h2>

      <div className="card">
        <h3 className="font-medium text-sm text-xogun-muted uppercase tracking-wider mb-2">Colección e catálogo</h3>
        <Toggle label="Catálogo público" description="Calquera pode ver o catálogo sen iniciar sesión"
          checked={features.catalog_public} onChange={v => updateFeature('catalog_public', v)} />
        <Toggle label="Coleccións públicas" description="Os usuarios poden facer as súas coleccións visibles"
          checked={features.collections_public} onChange={v => updateFeature('collections_public', v)} />
        <Toggle label="Lista de desexos" description="Os usuarios poden marcar xogos que queren ter"
          checked={features.wishlist} onChange={v => updateFeature('wishlist', v)} />
        <Toggle label="Importación de BGG" description="Permite importar colecciones desde BoardGameGeek"
          checked={features.bgg_import} onChange={v => updateFeature('bgg_import', v)} />
        <Toggle label="Moderación de xogos" description="Os xogos novos requiren aprobación do admin"
          checked={features.game_moderation} onChange={v => updateFeature('game_moderation', v)} />
      </div>

      <div className="card">
        <h3 className="font-medium text-sm text-xogun-muted uppercase tracking-wider mb-2">Partidas</h3>
        <Toggle label="Historial de partidas"
          checked={features.match_history} onChange={v => updateFeature('match_history', v)} />
        <Toggle label="Partidas planificadas" description="Permite crear quedadas e eventos futuros"
          checked={features.planned_matches} onChange={v => updateFeature('planned_matches', v)} />
        <Toggle label="Logros"
          checked={features.achievements} onChange={v => updateFeature('achievements', v)} />
        <Toggle label="Plantillas de marcador"
          checked={features.score_templates} onChange={v => updateFeature('score_templates', v)} />
      </div>

      <div className="card">
        <h3 className="font-medium text-sm text-xogun-muted uppercase tracking-wider mb-2">Ferramentas</h3>
        <Toggle label="Ferramentas públicas" description="Calquera pode usar as ferramentas sen conta"
          checked={features.tools_public} onChange={v => updateFeature('tools_public', v)} />
        <Toggle label="🎲 Dados 3D"       checked={tools.dice}             onChange={v => updateTool('dice', v)} />
        <Toggle label="🏆 Marcador"        checked={tools.scoreboard}       onChange={v => updateTool('scoreboard', v)} />
        <Toggle label="⏱️ Temporizador"    checked={tools.timer}            onChange={v => updateTool('timer', v)} />
        <Toggle label="🔄 Orde de turnos"  checked={tools.turns}            onChange={v => updateTool('turns', v)} />
        <Toggle label="🎴 Repartidor de roles" checked={tools.role_dealer}  onChange={v => updateTool('role_dealer', v)} />
        <Toggle label="🏦 Banco de recursos"   checked={tools.resource_bank} onChange={v => updateTool('resource_bank', v)} />
        <Toggle label="🎯 Contador de obxectivos" checked={tools.objective_counter} onChange={v => updateTool('objective_counter', v)} />
        <Toggle label="🎰 Selector de xogador inicial" checked={tools.first_player} onChange={v => updateTool('first_player', v)} />
        <Toggle label="📅 Planificador de sesión" checked={tools.session_planner} onChange={v => updateTool('session_planner', v)} />
      </div>
    </div>
  )
}

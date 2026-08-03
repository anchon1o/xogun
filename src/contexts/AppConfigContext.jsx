import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AppConfigContext = createContext(null)

const DEFAULTS = {
  app_name: 'Xogún',
  maintenance_mode: false,
  logo_url: null,
  features: {
    tools_public: true,
    catalog_public: true,
    collections_public: true,
    wishlist: true,
    match_history: true,
    planned_matches: true,
    bgg_import: true,
    game_moderation: true,
    achievements: true,
    score_templates: true,
  },
  visible_game_fields: {
    description: true, min_players: true, max_players: true,
    min_duration: true, max_duration: true, age: true,
    complexity: true, bgg_rating: true, bgg_id: true,
    categories: true, mechanics: true, images: true,
    publisher: true, designer: true,
  },
  tools_enabled: {
    dice: true, scoreboard: true, timer: true, turns: true,
    role_dealer: true, resource_bank: true, objective_counter: true,
    first_player: true, session_planner: true, music: true,
    match_notes: true, team_generator: true, soundboard: true, character_sheet: true,
  },
  accent_presets: [
    '#c8a96e', '#e8c87a', '#e8955a', '#6e8dc8',
    '#6ec87e', '#c86e6e', '#c86ec8', '#6ec8c8',
  ],
}

export function AppConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadConfig() }, [])

  async function loadConfig() {
    const { data } = await supabase.from('app_config').select('key, value')
    if (data) {
      const merged = { ...DEFAULTS }
      data.forEach(row => { merged[row.key] = row.value })
      setConfig(merged)
    }
    setLoading(false)
  }

  async function updateConfig(key, value) {
    await supabase.from('app_config').upsert({ key, value })
    setConfig(c => ({ ...c, [key]: value }))
  }

  function isFeatureEnabled(feature) { return config.features?.[feature] ?? true }
  function isToolEnabled(tool)       { return config.tools_enabled?.[tool] ?? true }
  function isFieldVisible(field)     { return config.visible_game_fields?.[field] ?? true }

  return (
    <AppConfigContext.Provider value={{ config, loading, updateConfig, isFeatureEnabled, isToolEnabled, isFieldVisible }}>
      {children}
    </AppConfigContext.Provider>
  )
}

export const useAppConfig = () => useContext(AppConfigContext)

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Un "preset de ferramentas" garda que widgets amosar e con que configuración
 * cando se selecciona un xogo concreto. Reutiliza a táboa score_templates
 * ampliando o seu campo `config` para incluír non só o marcador senón
 * tamén que outras ferramentas activar (dados, temporizador, turnos...).
 *
 * config JSONB shape:
 * {
 *   "tools": ["dice", "scoreboard"],       // widgets a amosar por defecto
 *   "scoreboard": { "sections": [...] }    // configuración específica do marcador
 * }
 */
export function useToolPresets(gameId, userId) {
  const [presets, setPresets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!gameId) { setPresets([]); setLoading(false); return }
    fetch()
  }, [gameId])

  async function fetch() {
    setLoading(true)
    let query = supabase.from('score_templates').select('*').eq('game_id', gameId)
    // Amosar aprobados para todos, e ademais os propios pendentes se hai usuario
    const { data } = userId
      ? await query.or(`approved.eq.true,created_by.eq.${userId}`)
      : await query.eq('approved', true)
    setPresets(data || [])
    setLoading(false)
  }

  async function createPreset(uid, name, config) {
    const { data, error } = await supabase
      .from('score_templates')
      .insert({ game_id: gameId, name, config, created_by: uid, approved: false })
      .select().single()
    if (!error) fetch()
    return { data, error }
  }

  async function deletePreset(id) {
    const { error } = await supabase.from('score_templates').delete().eq('id', id)
    if (!error) fetch()
    return { error }
  }

  return { presets, loading, refetch: fetch, createPreset, deletePreset }
}

export function useAllToolPresets() {
  const [presets, setPresets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetch() }, [])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase.from('score_templates').select('*, games(name)').order('name')
    setPresets(data || [])
    setLoading(false)
  }

  return { presets, loading, refetch: fetch }
}

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useCharacterTemplates(userId) {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetch() }, [userId])

  async function fetch() {
    setLoading(true)
    let query = supabase.from('character_sheet_templates').select('*, games(name)')
    const { data } = userId
      ? await query.or(`approved.eq.true,created_by.eq.${userId}`)
      : await query.eq('approved', true)
    setTemplates(data || [])
    setLoading(false)
  }

  async function createTemplate(name, theme, config, gameId) {
    const { data, error } = await supabase
      .from('character_sheet_templates')
      .insert({ name, theme, config, game_id: gameId || null, created_by: userId, approved: false })
      .select().single()
    if (!error) fetch()
    return { data, error }
  }

  return { templates, loading, createTemplate, refetch: fetch }
}

export function useCharacters(userId) {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    fetch()
  }, [userId])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase
      .from('characters')
      .select('*, character_sheet_templates(name, theme, config)')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    setCharacters(data || [])
    setLoading(false)
  }

  async function createCharacter(templateId, builtinTemplateId, name, data = {}) {
    const { data: character, error } = await supabase
      .from('characters')
      .insert({ template_id: templateId, builtin_template_id: builtinTemplateId, user_id: userId, name, data })
      .select('*, character_sheet_templates(name, theme, config)').single()
    if (!error) fetch()
    return { data: character, error }
  }

  async function updateCharacter(id, updates) {
    const { error } = await supabase
      .from('characters')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (!error) fetch()
    return { error }
  }

  async function deleteCharacter(id) {
    const { error } = await supabase.from('characters').delete().eq('id', id)
    if (!error) setCharacters(c => c.filter(x => x.id !== id))
    return { error }
  }

  return { characters, loading, createCharacter, updateCharacter, deleteCharacter, refetch: fetch }
}

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useGames(filters = {}) {
  const [games, setGames]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('games').select('*').eq('approved', true).order('name')

    if (filters.search)     query = query.ilike('name', `%${filters.search}%`)
    if (filters.players)    query = query.lte('min_players', filters.players).gte('max_players', filters.players)
    if (filters.maxDuration) query = query.lte('min_duration', filters.maxDuration)
    if (filters.category)   query = query.contains('category_ids', [filters.category])
    if (filters.mechanic)   query = query.contains('mechanic_ids', [filters.mechanic])

    const { data, error } = await query
    if (error) setError(error.message)
    else setGames(data || [])
    setLoading(false)
  }, [JSON.stringify(filters)])

  useEffect(() => { fetch() }, [fetch])

  async function addGame(game) {
    const { data, error } = await supabase.from('games').insert(game).select().single()
    return { data, error }
  }

  async function updateGame(id, updates) {
    const { data, error } = await supabase.from('games').update(updates).eq('id', id).select().single()
    if (!error) setGames(g => g.map(x => x.id === id ? data : x))
    return { error }
  }

  async function deleteGame(id) {
    const { error } = await supabase.from('games').delete().eq('id', id)
    if (!error) setGames(g => g.filter(x => x.id !== id))
    return { error }
  }

  async function approveGame(id, approverId) {
    return updateGame(id, { approved: true, approved_by: approverId, approved_at: new Date().toISOString() })
  }

  async function checkDuplicate(name, bggId) {
    let query = supabase.from('games').select('id, name, bgg_id, approved')
    if (bggId) query = query.eq('bgg_id', bggId)
    else query = query.ilike('name', name.trim())
    const { data } = await query.limit(1)
    return data?.[0] || null
  }

  return { games, loading, error, refetch: fetch, addGame, updateGame, deleteGame, approveGame, checkDuplicate }
}

export function usePendingGames() {
  const [games, setGames]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetch() }, [])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase.from('games').select('*, profiles!added_by(display_name)').eq('approved', false).order('created_at')
    setGames(data || [])
    setLoading(false)
  }

  return { games, loading, refetch: fetch }
}

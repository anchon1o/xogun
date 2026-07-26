import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useMatches(userId) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    fetch()
  }, [userId])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase
      .from('matches')
      .select('*, games(name, images), match_players(*, profiles(display_name, avatar_color))')
      .eq('created_by', userId)
      .order('created_at', { ascending: false })
    setMatches(data || [])
    setLoading(false)
  }

  async function createMatch(matchData, players) {
    const { data: match, error } = await supabase
      .from('matches')
      .insert({ ...matchData, created_by: userId })
      .select()
      .single()
    if (error) return { error }

    if (players?.length) {
      await supabase.from('match_players').insert(
        players.map(p => ({ match_id: match.id, ...p }))
      )
    }
    await fetch()
    return { data: match, error: null }
  }

  async function updateMatch(id, updates) {
    const { error } = await supabase.from('matches').update(updates).eq('id', id)
    if (!error) await fetch()
    return { error }
  }

  async function finishMatch(id, scores) {
    return updateMatch(id, { status: 'finished', finished_at: new Date().toISOString(), scores })
  }

  async function deleteMatch(id) {
    const { error } = await supabase.from('matches').delete().eq('id', id)
    if (!error) setMatches(m => m.filter(x => x.id !== id))
    return { error }
  }

  return { matches, loading, refetch: fetch, createMatch, updateMatch, finishMatch, deleteMatch }
}

export function useMatchPlayers(matchId) {
  const [players, setPlayers] = useState([])

  useEffect(() => {
    if (!matchId) return
    supabase.from('match_players')
      .select('*, profiles(display_name, avatar_color)')
      .eq('match_id', matchId)
      .then(({ data }) => setPlayers(data || []))
  }, [matchId])

  async function addPlayer(player) {
    const { data, error } = await supabase.from('match_players').insert({ match_id: matchId, ...player }).select().single()
    if (!error) setPlayers(p => [...p, data])
    return { error }
  }

  async function updatePlayer(id, updates) {
    const { error } = await supabase.from('match_players').update(updates).eq('id', id)
    if (!error) setPlayers(p => p.map(x => x.id === id ? { ...x, ...updates } : x))
    return { error }
  }

  return { players, addPlayer, updatePlayer }
}

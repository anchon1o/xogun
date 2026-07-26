import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const COLLECTION_STATUSES = [
  { id: 'owned',    label: 'Teño',      emoji: '🎲', color: '#6ec87e' },
  { id: 'wishlist', label: 'Quero ter', emoji: '⭐', color: '#c8a96e' },
  { id: 'played',   label: 'Xoguei',   emoji: '✅', color: '#6e8dc8' },
  { id: 'favorite', label: 'Favorito', emoji: '❤️', color: '#c86e6e' },
]

export function useCollection(userId) {
  const [collection, setCollection] = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    fetch()
  }, [userId])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase
      .from('user_games')
      .select('*, games(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setCollection(data || [])
    setLoading(false)
  }

  async function addToCollection(gameId, status = 'owned') {
    const { data, error } = await supabase
      .from('user_games')
      .upsert({ user_id: userId, game_id: gameId, status }, { onConflict: 'user_id,game_id' })
      .select('*, games(*)').single()
    if (!error) setCollection(c => [data, ...c.filter(x => x.game_id !== gameId)])
    return { error }
  }

  async function removeFromCollection(gameId) {
    const { error } = await supabase.from('user_games').delete().eq('user_id', userId).eq('game_id', gameId)
    if (!error) setCollection(c => c.filter(x => x.game_id !== gameId))
    return { error }
  }

  async function updateEntry(gameId, updates) {
    const { data, error } = await supabase
      .from('user_games').update(updates).eq('user_id', userId).eq('game_id', gameId)
      .select('*, games(*)').single()
    if (!error) setCollection(c => c.map(x => x.game_id === gameId ? data : x))
    return { error }
  }

  async function incrementPlayed(gameId) {
    const entry = collection.find(x => x.game_id === gameId)
    const times = (entry?.times_played || 0) + 1
    return updateEntry(gameId, { times_played: times })
  }

  function getEntry(gameId) { return collection.find(x => x.game_id === gameId) }
  function hasGame(gameId)  { return !!getEntry(gameId) }

  const stats = {
    total:    collection.length,
    owned:    collection.filter(x => x.status === 'owned').length,
    wishlist: collection.filter(x => x.status === 'wishlist').length,
    played:   collection.filter(x => x.status === 'played').length,
    favorite: collection.filter(x => x.status === 'favorite').length,
    timesPlayed: collection.reduce((acc, x) => acc + (x.times_played || 0), 0),
  }

  return { collection, loading, stats, refetch: fetch, addToCollection, removeFromCollection, updateEntry, incrementPlayed, getEntry, hasGame }
}

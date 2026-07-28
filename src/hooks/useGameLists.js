import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useGameLists(userId) {
  const [lists, setLists]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    fetch()
  }, [userId])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase
      .from('game_lists')
      .select('*, game_list_items(count)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    setLists(data || [])
    setLoading(false)
  }

  async function createList(name, extra = {}) {
    const { data, error } = await supabase
      .from('game_lists')
      .insert({ user_id: userId, name, ...extra })
      .select().single()
    if (!error) fetch()
    return { data, error }
  }

  async function updateList(id, updates) {
    const { error } = await supabase.from('game_lists').update(updates).eq('id', id)
    if (!error) fetch()
    return { error }
  }

  async function deleteList(id) {
    const { error } = await supabase.from('game_lists').delete().eq('id', id)
    if (!error) setLists(l => l.filter(x => x.id !== id))
    return { error }
  }

  return { lists, loading, refetch: fetch, createList, updateList, deleteList }
}

export function useGameListItems(listId) {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!listId) { setLoading(false); return }
    fetch()
  }, [listId])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase
      .from('game_list_items')
      .select('*, games(*)')
      .eq('list_id', listId)
      .order('sort_order')
    setItems(data || [])
    setLoading(false)
  }

  async function addGame(gameId, note = null) {
    const { data, error } = await supabase
      .from('game_list_items')
      .insert({ list_id: listId, game_id: gameId, note, sort_order: items.length })
      .select('*, games(*)').single()
    if (!error) setItems(i => [...i, data])
    return { error }
  }

  async function removeGame(gameId) {
    const { error } = await supabase.from('game_list_items').delete().eq('list_id', listId).eq('game_id', gameId)
    if (!error) setItems(i => i.filter(x => x.game_id !== gameId))
    return { error }
  }

  function hasGame(gameId) { return items.some(i => i.game_id === gameId) }

  return { items, loading, refetch: fetch, addGame, removeGame, hasGame }
}

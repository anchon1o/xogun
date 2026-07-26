import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function usePlaylists(userId) {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    fetch()
  }, [userId])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase
      .from('playlists')
      .select('*, games(name), playlist_tracks(count)')
      .eq('created_by', userId)
      .order('created_at', { ascending: false })
    setPlaylists(data || [])
    setLoading(false)
  }

  async function createPlaylist(data) {
    const { data: pl, error } = await supabase
      .from('playlists')
      .insert({ ...data, created_by: userId })
      .select().single()
    if (!error) fetch()
    return { data: pl, error }
  }

  async function updatePlaylist(id, updates) {
    const { error } = await supabase.from('playlists').update(updates).eq('id', id)
    if (!error) fetch()
    return { error }
  }

  async function deletePlaylist(id) {
    const { error } = await supabase.from('playlists').delete().eq('id', id)
    if (!error) setPlaylists(p => p.filter(x => x.id !== id))
    return { error }
  }

  return { playlists, loading, refetch: fetch, createPlaylist, updatePlaylist, deletePlaylist }
}

export function usePlaylistTracks(playlistId) {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!playlistId) return
    supabase.from('playlist_tracks').select('*').eq('playlist_id', playlistId).order('sort_order')
      .then(({ data }) => { setTracks(data || []); setLoading(false) })
  }, [playlistId])

  async function addTrack(track) {
    const { data, error } = await supabase
      .from('playlist_tracks')
      .insert({ playlist_id: playlistId, ...track, sort_order: tracks.length })
      .select().single()
    if (!error) setTracks(t => [...t, data])
    return { error }
  }

  async function removeTrack(id) {
    const { error } = await supabase.from('playlist_tracks').delete().eq('id', id)
    if (!error) setTracks(t => t.filter(x => x.id !== id))
    return { error }
  }

  async function reorderTracks(newOrder) {
    setTracks(newOrder)
    await Promise.all(newOrder.map((t, i) =>
      supabase.from('playlist_tracks').update({ sort_order: i }).eq('id', t.id)
    ))
  }

  return { tracks, loading, addTrack, removeTrack, reorderTracks }
}

// Extrae el ID de YouTube de una URL
export function getYouTubeId(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match?.[1] || null
}

// Obtiene título via oEmbed (sin API key)
export async function getYouTubeTitle(url) {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`)
    const data = await res.json()
    return data.title || null
  } catch { return null }
}

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { notifyUser } from './useNotifications'

export function useChallenges(userId) {
  const [sent, setSent] = useState([])
  const [received, setReceived] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    fetch()
  }, [userId])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase
      .from('challenges')
      .select(`
        *,
        games(name, images),
        from_profile:profiles!from_user(display_name, avatar_id, avatar_color),
        to_profile:profiles!to_user(display_name, avatar_id, avatar_color)
      `)
      .or(`from_user.eq.${userId},to_user.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (data) {
      setSent(data.filter(c => c.from_user === userId))
      setReceived(data.filter(c => c.to_user === userId))
    }
    setLoading(false)
  }

  async function createChallenge({ toUser, gameId, title, description, deadline }) {
    const { data, error } = await supabase
      .from('challenges')
      .insert({ from_user: userId, to_user: toUser, game_id: gameId || null, title, description, deadline: deadline || null })
      .select().single()
    if (!error) {
      fetch()
      const { data: me } = await supabase.from('profiles').select('display_name').eq('id', userId).single()
      notifyUser(toUser, {
        type: 'challenge_received',
        title: 'Novo reto!',
        body: `${me?.display_name || 'Alguén'} retoute: "${title}"`,
        link: '/retos',
      })
    }
    return { data, error }
  }

  async function resolveChallenge(id, status) {
    const challenge = [...sent, ...received].find(c => c.id === id)
    const { error } = await supabase
      .from('challenges')
      .update({ status, resolved_at: new Date().toISOString() })
      .eq('id', id)
    if (!error) {
      fetch()
      if (challenge) {
        const otherUser = challenge.from_user === userId ? challenge.to_user : challenge.from_user
        const statusLabel = { accepted: 'aceptado', completed: 'completado', failed: 'fallado', declined: 'rexeitado' }[status] || status
        notifyUser(otherUser, {
          type: 'challenge_received',
          title: 'Reto actualizado',
          body: `O reto "${challenge.title}" foi ${statusLabel}`,
          link: '/retos',
        })
      }
    }
    return { error }
  }

  async function deleteChallenge(id) {
    const { error } = await supabase.from('challenges').delete().eq('id', id)
    if (!error) { setSent(s => s.filter(c => c.id !== id)); setReceived(r => r.filter(c => c.id !== id)) }
    return { error }
  }

  return { sent, received, loading, createChallenge, resolveChallenge, deleteChallenge, refetch: fetch }
}

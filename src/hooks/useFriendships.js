import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { notifyUser } from './useNotifications'

export function useFriendships(userId) {
  const [friends, setFriends]   = useState([])
  const [pending, setPending]   = useState([])  // solicitudes recibidas
  const [sent, setSent]         = useState([])   // solicitudes enviadas
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    fetch()
  }, [userId])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase
      .from('friendships')
      .select(`
        *,
        requester_profile:profiles!requester(id, display_name, avatar_id, avatar_color),
        addressee_profile:profiles!addressee(id, display_name, avatar_id, avatar_color)
      `)
      .or(`requester.eq.${userId},addressee.eq.${userId}`)

    if (data) {
      setFriends(data.filter(f => f.status === 'accepted'))
      setPending(data.filter(f => f.status === 'pending' && f.addressee === userId))
      setSent(data.filter(f => f.status === 'pending' && f.requester === userId))
    }
    setLoading(false)
  }

  async function sendRequest(addresseeId) {
    const { data: me } = await supabase.from('profiles').select('display_name').eq('id', userId).single()
    const { error } = await supabase.from('friendships').insert({ requester: userId, addressee: addresseeId })
    if (!error) {
      fetch()
      notifyUser(addresseeId, {
        type: 'friend_request',
        title: 'Nova solicitude de amizade',
        body: `${me?.display_name || 'Alguén'} quere ser o teu amigo`,
        link: '/amigos',
      })
    }
    return { error }
  }

  async function acceptRequest(friendshipId) {
    const friendship = [...pending, ...sent].find(f => f.id === friendshipId)
    const { error } = await supabase.from('friendships')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', friendshipId)
    if (!error) {
      fetch()
      if (friendship) {
        const { data: me } = await supabase.from('profiles').select('display_name').eq('id', userId).single()
        notifyUser(friendship.requester, {
          type: 'friend_accepted',
          title: 'Solicitude aceptada',
          body: `${me?.display_name || 'Alguén'} aceptou a túa solicitude de amizade`,
          link: '/amigos',
        })
      }
    }
    return { error }
  }

  async function rejectRequest(friendshipId) {
    const { error } = await supabase.from('friendships').delete().eq('id', friendshipId)
    if (!error) fetch()
    return { error }
  }

  async function cancelRequest(friendshipId) {
    const { error } = await supabase.from('friendships').delete().eq('id', friendshipId)
    if (!error) fetch()
    return { error }
  }

  async function removeFriend(friendshipId) {
    const { error } = await supabase.from('friendships').delete().eq('id', friendshipId)
    if (!error) fetch()
    return { error }
  }

  function isFriend(otherUserId) {
    return friends.some(f => f.requester === otherUserId || f.addressee === otherUserId)
  }

  function hasPendingWith(otherUserId) {
    return sent.some(f => f.addressee === otherUserId) || pending.some(f => f.requester === otherUserId)
  }

  function getFriendProfile(f) {
    return f.requester === userId ? f.addressee_profile : f.requester_profile
  }

  async function searchUsers(query) {
    if (!query?.trim()) return []
    const { data } = await supabase
      .from('profiles')
      .select('id, display_name, email, avatar_id, avatar_color')
      .ilike('display_name', `%${query.trim()}%`)
      .neq('id', userId)
      .limit(10)
    return data || []
  }

  return {
    friends, pending, sent, loading,
    sendRequest, acceptRequest, rejectRequest, cancelRequest, removeFriend,
    isFriend, hasPendingWith, getFriendProfile, searchUsers, refetch: fetch,
  }
}

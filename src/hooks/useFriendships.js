import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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
    const { error } = await supabase.from('friendships').insert({ requester: userId, addressee: addresseeId })
    if (!error) fetch()
    return { error }
  }

  async function acceptRequest(friendshipId) {
    const { error } = await supabase.from('friendships')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', friendshipId)
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

  function getFriendProfile(f) {
    return f.requester === userId ? f.addressee_profile : f.requester_profile
  }

  return { friends, pending, sent, loading, sendRequest, acceptRequest, removeFriend, isFriend, getFriendProfile, refetch: fetch }
}

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { notifyUser } from './useNotifications'

export function useSessionCalendar(userId) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    fetch()
  }, [userId])

  async function fetch() {
    setLoading(true)
    const { data: myInvites } = await supabase
      .from('session_invites')
      .select('match_id')
      .eq('user_id', userId)
    const invitedMatchIds = (myInvites || []).map(i => i.match_id)

    let query = supabase
      .from('matches')
      .select(`
        *,
        games(name, images),
        session_invites(id, user_id, rsvp, profiles(display_name, avatar_id, avatar_color))
      `)
      .eq('status', 'planned')
      .order('planned_at')

    if (invitedMatchIds.length > 0) {
      query = query.or(`created_by.eq.${userId},id.in.(${invitedMatchIds.join(',')})`)
    } else {
      query = query.eq('created_by', userId)
    }

    const { data } = await query
    setSessions(data || [])
    setLoading(false)
  }

  async function createSession({ gameId, gameName, plannedAt, notes, inviteUserIds = [] }) {
    const { data: match, error } = await supabase
      .from('matches')
      .insert({ game_id: gameId || null, game_name: gameName || null, status: 'planned', planned_at: plannedAt, notes, created_by: userId })
      .select().single()
    if (error || !match) return { error }

    if (inviteUserIds.length > 0) {
      await supabase.from('session_invites').insert(
        inviteUserIds.map(uid => ({ match_id: match.id, user_id: uid }))
      )
      const { data: me } = await supabase.from('profiles').select('display_name').eq('id', userId).single()
      inviteUserIds.forEach(uid => {
        notifyUser(uid, {
          type: 'session_reminder',
          title: 'Convite a unha sesión',
          body: `${me?.display_name || 'Alguén'} convidoute a xogar ${gameName || 'algo'}`,
          link: '/calendario',
        })
      })
    }
    fetch()
    return { data: match, error: null }
  }

  async function updateRsvp(matchId, rsvp) {
    const { error } = await supabase
      .from('session_invites')
      .update({ rsvp })
      .eq('match_id', matchId)
      .eq('user_id', userId)
    if (!error) fetch()
    return { error }
  }

  async function deleteSession(matchId) {
    const { error } = await supabase.from('matches').delete().eq('id', matchId)
    if (!error) setSessions(s => s.filter(x => x.id !== matchId))
    return { error }
  }

  return { sessions, loading, createSession, updateRsvp, deleteSession, refetch: fetch }
}

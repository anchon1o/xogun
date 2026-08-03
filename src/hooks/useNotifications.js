import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }
    fetch()
    const interval = setInterval(fetch, 30000)
    return () => clearInterval(interval)
  }, [userId])

  async function fetch() {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30)
    setNotifications(data || [])
    setLoading(false)
  }

  async function markAsRead(id) {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x))
  }

  async function markAllAsRead() {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id)
    if (unreadIds.length === 0) return
    await supabase.from('notifications').update({ read: true }).in('id', unreadIds)
    setNotifications(n => n.map(x => ({ ...x, read: true })))
  }

  async function remove(id) {
    await supabase.from('notifications').delete().eq('id', id)
    setNotifications(n => n.filter(x => x.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead, remove, refetch: fetch }
}

export async function notifyUser(userId, { type, title, body, link }) {
  const { data: profile } = await supabase.from('profiles').select('notifications_enabled').eq('id', userId).single()
  if (profile && profile.notifications_enabled === false) return
  await supabase.from('notifications').insert({ user_id: userId, type, title, body, link })
}

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useActivityLog() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetch() }, [])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase
      .from('activity_log')
      .select('*, profiles(display_name)')
      .order('created_at', { ascending: false })
      .limit(100)
    setEntries(data || [])
    setLoading(false)
  }

  return { entries, loading, refetch: fetch }
}

export async function logActivity(adminId, { action, targetType, targetName }) {
  await supabase.from('activity_log').insert({
    admin_id: adminId, action, target_type: targetType, target_name: targetName,
  })
}

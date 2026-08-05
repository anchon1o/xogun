import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useGameOwners(gameId) {
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!gameId) { setLoading(false); return }
    fetch()
  }, [gameId])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase
      .from('user_games')
      .select('status, personal_rating, profiles(id, display_name, avatar_id, avatar_color)')
      .eq('game_id', gameId)
    setOwners((data || []).filter(o => o.profiles))
    setLoading(false)
  }

  return { owners, loading }
}

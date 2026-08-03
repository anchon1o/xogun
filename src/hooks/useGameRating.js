import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useGameRating(gameId) {
  const [avg, setAvg] = useState(null)
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!gameId) { setLoading(false); return }
    fetch()
  }, [gameId])

  async function fetch() {
    setLoading(true)
    const { data } = await supabase
      .from('user_games')
      .select('personal_rating')
      .eq('game_id', gameId)
      .not('personal_rating', 'is', null)
    if (data?.length) {
      const sum = data.reduce((a, r) => a + r.personal_rating, 0)
      setAvg(Math.round((sum / data.length) * 10) / 10)
      setCount(data.length)
    } else {
      setAvg(null)
      setCount(0)
    }
    setLoading(false)
  }

  return { avg, count, loading, refetch: fetch }
}

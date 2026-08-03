import { useMemo } from 'react'

export function useStats(matches, userId, userName) {
  return useMemo(() => {
    const finished = matches.filter(m => m.status === 'finished')

    if (finished.length === 0) {
      return {
        totalMatches: 0, totalWins: 0, winRate: 0,
        gamesPlayed: [], mostPlayedGame: null,
        favoriteOpponents: [], winStreak: 0, longestWinStreak: 0,
        matchesByMonth: [],
      }
    }

    function myEntry(match) {
      return match.match_players?.find(p =>
        p.user_id === userId || (userName && p.guest_name === userName)
      )
    }

    const withMe = finished.filter(m => myEntry(m))
    const wins = withMe.filter(m => myEntry(m)?.winner)

    const gameCounts = {}
    finished.forEach(m => {
      const name = m.game_name || m.games?.name || 'Sen xogo'
      gameCounts[name] = (gameCounts[name] || 0) + 1
    })
    const gamesPlayed = Object.entries(gameCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
    const mostPlayedGame = gamesPlayed[0] || null

    const opponentCounts = {}
    finished.forEach(m => {
      (m.match_players || []).forEach(p => {
        const name = p.profiles?.display_name || p.guest_name
        if (!name || name === userName) return
        opponentCounts[name] = (opponentCounts[name] || 0) + 1
      })
    })
    const favoriteOpponents = Object.entries(opponentCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const sortedByDate = [...withMe].sort((a, b) =>
      new Date(b.finished_at || b.created_at) - new Date(a.finished_at || a.created_at)
    )
    let winStreak = 0
    for (const m of sortedByDate) {
      if (myEntry(m)?.winner) winStreak++
      else break
    }
    let longestWinStreak = 0, currentRun = 0
    for (const m of [...sortedByDate].reverse()) {
      if (myEntry(m)?.winner) { currentRun++; longestWinStreak = Math.max(longestWinStreak, currentRun) }
      else currentRun = 0
    }

    const monthCounts = {}
    finished.forEach(m => {
      const d = new Date(m.finished_at || m.created_at)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      monthCounts[key] = (monthCounts[key] || 0) + 1
    })
    const matchesByMonth = Object.entries(monthCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, count]) => ({ month, count }))

    return {
      totalMatches: withMe.length,
      totalWins: wins.length,
      winRate: withMe.length ? Math.round((wins.length / withMe.length) * 100) : 0,
      gamesPlayed,
      mostPlayedGame,
      favoriteOpponents,
      winStreak,
      longestWinStreak,
      matchesByMonth,
    }
  }, [matches, userId, userName])
}

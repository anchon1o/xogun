import { createContext, useContext, useState, useCallback } from 'react'

/**
 * Sesión de partida compartida entre todas as ferramentas.
 * Gárdase en memoria (non persiste entre recargas por deseño —
 * unha sesión é algo puntual dunha tarde de xogo).
 *
 * players: [{ id, name, color, userId? }]
 * game: { id, name, images } | null
 */
const GameSessionContext = createContext(null)

const PLAYER_COLORS = ['#c8a96e', '#6e8dc8', '#6ec87e', '#c86e6e', '#c86ec8', '#6ec8c8', '#c8b46e', '#8e6ec8']

export function GameSessionProvider({ children }) {
  const [game, setGame] = useState(null)
  const [players, setPlayers] = useState([])

  const startSession = useCallback((gameData, playerNames) => {
    setGame(gameData || null)
    setPlayers(playerNames.map((name, i) => ({
      id: crypto.randomUUID(),
      name,
      color: PLAYER_COLORS[i % PLAYER_COLORS.length],
    })))
  }, [])

  const clearSession = useCallback(() => {
    setGame(null)
    setPlayers([])
  }, [])

  const updatePlayer = useCallback((id, updates) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }, [])

  const addPlayer = useCallback((name) => {
    setPlayers(prev => [...prev, { id: crypto.randomUUID(), name, color: PLAYER_COLORS[prev.length % PLAYER_COLORS.length] }])
  }, [])

  const removePlayer = useCallback((id) => {
    setPlayers(prev => prev.filter(p => p.id !== id))
  }, [])

  const hasActiveSession = players.length > 0

  return (
    <GameSessionContext.Provider value={{
      game, players, hasActiveSession,
      startSession, clearSession, updatePlayer, addPlayer, removePlayer,
    }}>
      {children}
    </GameSessionContext.Provider>
  )
}

export const useGameSession = () => useContext(GameSessionContext)

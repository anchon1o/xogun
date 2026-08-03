/**
 * Definición de logros de Xogún.
 * Non se garda estado en base de datos — recalcúlanse sempre a partir
 * das estatísticas e da colección xa cargadas, así que un logro "desbloqueado"
 * é simplemente un logro cuxa condición se cumpre agora mesmo cos datos actuais.
 */

export const ACHIEVEMENTS = [
  {
    id: 'first_match',
    emoji: '🎲',
    name: 'Primeira partida',
    description: 'Rexistra a túa primeira partida',
    check: (stats) => stats.totalMatches >= 1,
  },
  {
    id: 'veteran_10',
    emoji: '⚔️',
    name: 'Veterano',
    description: 'Rexistra 10 partidas',
    check: (stats) => stats.totalMatches >= 10,
  },
  {
    id: 'veteran_50',
    emoji: '🏛️',
    name: 'Lenda de mesa',
    description: 'Rexistra 50 partidas',
    check: (stats) => stats.totalMatches >= 50,
  },
  {
    id: 'first_win',
    emoji: '🏆',
    name: 'Primeira vitoria',
    description: 'Gaña a túa primeira partida',
    check: (stats) => stats.totalWins >= 1,
  },
  {
    id: 'streak_3',
    emoji: '🔥',
    name: 'Racha quente',
    description: 'Gaña 3 partidas seguidas',
    check: (stats) => stats.longestWinStreak >= 3,
  },
  {
    id: 'streak_5',
    emoji: '☄️',
    name: 'Imparable',
    description: 'Gaña 5 partidas seguidas',
    check: (stats) => stats.longestWinStreak >= 5,
  },
  {
    id: 'high_winrate',
    emoji: '💎',
    name: 'Estratega',
    description: 'Consegue un 60% de vitorias con polo menos 5 partidas',
    check: (stats) => stats.totalMatches >= 5 && stats.winRate >= 60,
  },
  {
    id: 'variety_5',
    emoji: '🎭',
    name: 'Explorador',
    description: 'Xoga a 5 xogos distintos',
    check: (stats) => stats.gamesPlayed.length >= 5,
  },
  {
    id: 'variety_15',
    emoji: '🗺️',
    name: 'Coleccionista de experiencias',
    description: 'Xoga a 15 xogos distintos',
    check: (stats) => stats.gamesPlayed.length >= 15,
  },
  {
    id: 'social_5',
    emoji: '👥',
    name: 'Alma de festa',
    description: 'Xoga con 5 persoas distintas',
    check: (stats) => stats.favoriteOpponents.length >= 5,
  },
  {
    id: 'collection_10',
    emoji: '📚',
    name: 'Comezando a colección',
    description: 'Ten 10 xogos na túa colección',
    check: (stats, collectionCount) => collectionCount >= 10,
  },
  {
    id: 'collection_50',
    emoji: '🏰',
    name: 'Ludoteca persoal',
    description: 'Ten 50 xogos na túa colección',
    check: (stats, collectionCount) => collectionCount >= 50,
  },
  {
    id: 'collection_100',
    emoji: '👑',
    name: 'Gran mestre coleccionista',
    description: 'Ten 100 xogos na túa colección',
    check: (stats, collectionCount) => collectionCount >= 100,
  },
]

export function getUnlockedAchievements(stats, collectionCount) {
  return ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: a.check(stats, collectionCount),
  }))
}

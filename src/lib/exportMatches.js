function csvEscape(value) {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function downloadCSV(headers, rows, filename) {
  const csv = [headers, ...rows]
    .map(row => row.map(csvEscape).join(','))
    .join('\n')

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportMatchesToCSV(matches, filename = 'xogun-partidas.csv') {
  const headers = ['Xogo', 'Estado', 'Data', 'Xogadores', 'Gañador(es)', 'Puntuacións']
  const rows = matches.map(m => {
    const date = m.finished_at || m.planned_at || m.created_at
    const players = (m.match_players || []).map(p => p.profiles?.display_name || p.guest_name || 'Convidado')
    const winners = (m.match_players || []).filter(p => p.winner).map(p => p.profiles?.display_name || p.guest_name || 'Convidado')
    const scores = (m.match_players || [])
      .map(p => `${p.profiles?.display_name || p.guest_name || 'Convidado'}:${p.score?.total ?? '—'}`)
      .join(' | ')
    return [
      m.game_name || m.games?.name || 'Sen xogo',
      m.status === 'finished' ? 'Rematada' : m.status === 'planned' ? 'Planificada' : 'En curso',
      date ? new Date(date).toLocaleDateString('gl') : '',
      players.join(', '),
      winners.join(', '),
      scores,
    ]
  })
  downloadCSV(headers, rows, filename)
}

/**
 * Exporta a colección persoal completa: estado, puntuación propia,
 * visibilidade e data de alta de cada entrada.
 */
export function exportCollectionToCSV(collection, filename = 'xogun-coleccion.csv') {
  const STATUS_LABELS = { owned: 'Teño', wishlist: 'Quero ter', played: 'Xoguei', favorite: 'Favorito' }
  const VIS_LABELS = { private: 'Privada', friends: 'Só amigos', public: 'Pública' }

  const headers = ['Xogo', 'Estado', 'A miña puntuación', 'Visibilidade', 'Veces xogado', 'Data de alta']
  const rows = collection.map(entry => [
    entry.games?.name || 'Xogo descoñecido',
    STATUS_LABELS[entry.status] || entry.status,
    entry.personal_rating ?? '',
    VIS_LABELS[entry.visibility] || entry.visibility || '',
    entry.times_played ?? 0,
    entry.created_at ? new Date(entry.created_at).toLocaleDateString('gl') : '',
  ])
  downloadCSV(headers, rows, filename)
}

/**
 * Exporta un resumo de estatísticas persoais (as mesmas que se mostran
 * na páxina de Estatísticas) como táboa clave-valor.
 */
export function exportStatsToCSV(stats, filename = 'xogun-estatisticas.csv') {
  const headers = ['Métrica', 'Valor']
  const rows = [
    ['Total de partidas', stats.totalMatches],
    ['Vitorias', stats.totalWins],
    ['Porcentaxe de vitorias', `${stats.winRate}%`],
    ['Racha actual', stats.winStreak],
    ['Racha máxima', stats.longestWinStreak],
    ['Xogo máis xogado', stats.mostPlayedGame?.name || '—'],
    ['Xogos distintos xogados', stats.gamesPlayed.length],
  ]
  stats.favoriteOpponents.forEach((o, i) => {
    rows.push([`Adversario frecuente #${i + 1}`, `${o.name} (${o.count} partidas)`])
  })
  downloadCSV(headers, rows, filename)
}

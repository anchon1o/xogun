function csvEscape(value) {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
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

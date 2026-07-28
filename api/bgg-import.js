// Proxy servidor-a-servidor á API de BGG, xa que esta non permite
// chamadas CORS directas desde o navegador. Recibe un bgg_id ou unha
// URL completa de BGG, extrae o ID, e devolve os datos xa parseados
// e listos para encher o formulario de GameForm.

function extractBggId(input) {
  const trimmed = String(input).trim()
  // Se xa é só un número
  if (/^\d+$/.test(trimmed)) return trimmed
  // URL tipo https://boardgamegeek.com/boardgame/13/catan
  const match = trimmed.match(/boardgamegeek\.com\/boardgame(?:expansion)?\/(\d+)/)
  return match?.[1] || null
}

function extractTag(xml, tag, attr) {
  const regex = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"[^>]*/?>`, 'i')
  const match = xml.match(regex)
  return match?.[1] || null
}

function extractAllTag(xml, tag, type, attr = 'value') {
  const regex = new RegExp(`<${tag}[^>]*type="${type}"[^>]*${attr}="([^"]*)"[^>]*/?>`, 'gi')
  const results = []
  let m
  while ((m = regex.exec(xml)) !== null) results.push(decodeHtml(m[1]))
  return results
}

function decodeHtml(str) {
  if (!str) return str
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#10;/g, '\n')
}

function extractDescription(xml) {
  const match = xml.match(/<description>([\s\S]*?)<\/description>/)
  if (!match) return null
  const text = decodeHtml(match[1])
  // Limitar a ~500 caracteres, cortando na última frase completa posible
  if (text.length <= 500) return text.trim()
  const cut = text.slice(0, 500)
  const lastPeriod = cut.lastIndexOf('.')
  return (lastPeriod > 300 ? cut.slice(0, lastPeriod + 1) : cut).trim() + '…'
}

module.exports = async function handler(req, res) {
  const input = req.query.id || req.query.url
  if (!input) return res.status(400).json({ error: 'Falta o parámetro id ou url' })

  const bggId = extractBggId(input)
  if (!bggId) return res.status(400).json({ error: 'Non se puido recoñecer un ID de BGG válido nesa URL' })

  try {
    const response = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${bggId}&stats=1`, {
      headers: { 'User-Agent': 'Xogun/1.0 (board game collection app)' },
    })

    if (!response.ok) {
      return res.status(502).json({ error: `BGG respondeu con erro ${response.status}` })
    }

    const xml = await response.text()

    if (xml.includes('<item')  === false) {
      return res.status(404).json({ error: 'Non se atopou ningún xogo con ese ID en BGG' })
    }

    const name = decodeHtml(
      extractTag(xml, 'name[^>]*type="primary"', 'value') ||
      extractTag(xml, 'name', 'value')
    )
    const yearPublished = extractTag(xml, 'yearpublished', 'value')
    const minPlayers = extractTag(xml, 'minplayers', 'value')
    const maxPlayers = extractTag(xml, 'maxplayers', 'value')
    const minDuration = extractTag(xml, 'minplaytime', 'value')
    const maxDuration = extractTag(xml, 'maxplaytime', 'value')
    const age = extractTag(xml, 'minage', 'value')
    const description = extractDescription(xml)

    const imageMatch = xml.match(/<image>([\s\S]*?)<\/image>/)
    const image = imageMatch ? decodeHtml(imageMatch[1].trim()) : null

    const ratingMatch = xml.match(/<average value="([\d.]+)"/)
    const bggRating = ratingMatch ? parseFloat(ratingMatch[1]) : null

    const weightMatch = xml.match(/<averageweight value="([\d.]+)"/)
    const complexity = weightMatch ? parseFloat(weightMatch[1]) : null

    const publishers = extractAllTag(xml, 'link', 'boardgamepublisher')
    const designers = extractAllTag(xml, 'link', 'boardgamedesigner')
    const artists = extractAllTag(xml, 'link', 'boardgameartist')
    const categoryNames = extractAllTag(xml, 'link', 'boardgamecategory')
    const mechanicNames = extractAllTag(xml, 'link', 'boardgamemechanic')

    return res.status(200).json({
      bgg_id: parseInt(bggId),
      name,
      description,
      publisher: publishers[0] || null,
      designer: designers.slice(0, 2).join(', ') || null,
      artists: artists.slice(0, 2).join(', ') || null,
      year_published: yearPublished ? parseInt(yearPublished) : null,
      min_players: minPlayers ? parseInt(minPlayers) : null,
      max_players: maxPlayers ? parseInt(maxPlayers) : null,
      min_duration: minDuration ? parseInt(minDuration) : null,
      max_duration: maxDuration ? parseInt(maxDuration) : null,
      age: age ? parseInt(age) : null,
      complexity,
      bgg_rating: bggRating,
      images: image ? [image] : [],
      // Nomes de categorías/mecánicas de BGG — o cliente deberá tentar
      // emparellalos coa listaxe interna configurable (non son IDs directos)
      suggested_categories: categoryNames,
      suggested_mechanics: mechanicNames,
    })
  } catch (err) {
    console.error('BGG import error:', err)
    return res.status(500).json({ error: 'Erro ao conectar con BoardGameGeek. Téntao de novo.' })
  }
}

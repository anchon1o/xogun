export const ROLE_DESCRIPTIONS = {
  'Lobo': { team: 'evil', desc: 'Cada noite, os lobos elixen xuntos a quen devorar. De día, finxe ser inocente.' },
  'Aldeán': { team: 'good', desc: 'Non tes poderes especiais. A túa arma é observar e votar con xuízo.' },
  'Vidente': { team: 'good', desc: 'Cada noite podes descubrir en segredo o bando dun xogador.' },
  'Bruxa': { team: 'good', desc: 'Tes unha poción de vida e unha de morte, para usar unha soa vez cada unha.' },
  'Cazador': { team: 'good', desc: 'Se morres, podes levar a alguén máis contigo ao caer.' },
  'Cupido': { team: 'good', desc: 'Na primeira noite, unes a dous xogadores en amor — se un morre, o outro tamén.' },

  'Mafioso': { team: 'evil', desc: 'Cada noite, a mafia escolle xuntos a quen eliminar.' },
  'Cidadán': { team: 'good', desc: 'Sen poderes especiais — o teu voto é a túa ferramenta.' },
  'Detective': { team: 'good', desc: 'Cada noite podes investigar se alguén pertence á mafia.' },
  'Médico': { team: 'good', desc: 'Cada noite podes protexer a unha persoa de ser eliminada.' },

  'Washerwoman': { team: 'good', desc: 'Na primeira noite descobres que un de dous xogadores ten un rol concreto do Pobo.' },
  'Empath': { team: 'good', desc: 'Cada noite sabes cantos dos teus dous veciños vivos son do Mal.' },
  'Chef': { team: 'good', desc: 'Na primeira noite sabes cantas parellas de xogadores malvados están sentados xuntos.' },
  'Investigator': { team: 'good', desc: 'Na primeira noite descobres que un de dous xogadores ten un rol concreto Minion.' },
  'Imp': { team: 'evil', desc: 'Cada noite eliximes a alguén para matar. Se te matan a ti, un Minion pode converterse en ti.' },
  'Minion': { team: 'evil', desc: 'Coñeces aos outros do Mal e ao Demo. Colabora en segredo para gañar.' },
  'Butler': { team: 'good', desc: 'Cada noite elixes a alguén — só podes votar se esa persoa tamén vota.' },
  'Saint': { team: 'good', desc: 'Se es axustizado por votación, o Pobo perde inmediatamente. Ten coidado co que dis.' },

  'Impostor': { team: 'evil', desc: 'Non coñeces a palabra secreta. Escoita e finxe sabela sen que che pillen.' },
}

// Banco de palabras para o preset "Mentiroso" — mesma idea que a versión
// dun só dispositivo: unha palabra secreta repartida a todos agás ao impostor.
const MENTIROSO_WORDS = [
  'Praia', 'Montaña', 'Piano', 'Elefante', 'Chocolate', 'Bicicleta', 'Paraugas',
  'Faro', 'Castelo', 'Violín', 'Cabalo', 'Pirata', 'Dragón', 'Bruxa', 'Robot',
  'Xeado', 'Pizza', 'Foguete', 'Illa', 'Bosque', 'Volcán', 'Circo', 'Tren',
  'Avión', 'Globo', 'Camelo', 'Pingüín', 'Sereo', 'Cabaleiro', 'Muíño',
]

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function buildRolePool(preset, n) {
  if (n <= 0) return []

  if (preset === 'lobo') {
    const wolves = Math.max(1, Math.floor(n / 4))
    const specials = []
    if (n >= 5) specials.push('Vidente')
    if (n >= 7) specials.push('Bruxa')
    if (n >= 9) specials.push('Cazador')
    const villagers = Math.max(0, n - wolves - specials.length)
    return shuffle([
      ...Array(wolves).fill('Lobo'),
      ...specials,
      ...Array(villagers).fill('Aldeán'),
    ]).slice(0, n)
  }

  if (preset === 'mafia') {
    const mafiosos = Math.max(1, Math.floor(n / 4))
    const specials = []
    if (n >= 5) specials.push('Detective')
    if (n >= 7) specials.push('Médico')
    const citizens = Math.max(0, n - mafiosos - specials.length)
    return shuffle([
      ...Array(mafiosos).fill('Mafioso'),
      ...specials,
      ...Array(citizens).fill('Cidadán'),
    ]).slice(0, n)
  }

  if (preset === 'clocktower') {
    const imps = 1
    const minions = n >= 7 ? (n >= 10 ? 2 : 1) : (n >= 5 ? 1 : 0)
    const townsfolkPool = ['Washerwoman', 'Empath', 'Chef', 'Investigator', 'Butler', 'Saint']
    const remaining = Math.max(0, n - imps - minions)
    const townsfolk = []
    for (let i = 0; i < remaining; i++) townsfolk.push(townsfolkPool[i % townsfolkPool.length])
    return shuffle([
      ...Array(imps).fill('Imp'),
      ...Array(minions).fill('Minion'),
      ...townsfolk,
    ]).slice(0, n)
  }

  if (preset === 'mentiroso') {
    const word = MENTIROSO_WORDS[Math.floor(Math.random() * MENTIROSO_WORDS.length)]
    return ['Impostor', ...Array(Math.max(0, n - 1)).fill(`🗝️ ${word}`)]
  }

  return Array(n).fill('')
}

export const SOCIAL_PRESETS = [
  { id: 'lobo', label: '🐺 Lobo clásico', minPlayers: 4 },
  { id: 'mafia', label: '🕴️ Mafia', minPlayers: 4 },
  { id: 'clocktower', label: '🕰️ Blood on the Clocktower (simplificado)', minPlayers: 5 },
  { id: 'mentiroso', label: '🤫 Mentiroso (palabra secreta)', minPlayers: 3 },
  { id: 'custom', label: '✏️ Personalizado', minPlayers: 2 },
]

export function getRoleInfo(name) {
  return ROLE_DESCRIPTIONS[name] || { team: 'neutral', desc: 'Sen descrición para este rol.' }
}

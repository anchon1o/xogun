export const ROLE_DESCRIPTIONS = {
  // ── Lobo clásico ──
  'Lobo': { team: 'evil', desc: 'Cada noite, os lobos elixen xuntos a quen devorar. De día, finxe ser inocente.' },
  'Aldeán': { team: 'good', desc: 'Non tes poderes especiais. A túa arma é observar e votar con xuízo.' },
  'Vidente': { team: 'good', desc: 'Cada noite podes descubrir en segredo o bando dun xogador.' },
  'Bruxa': { team: 'good', desc: 'Tes unha poción de vida e unha de morte, para usar unha soa vez cada unha.' },
  'Cazador': { team: 'good', desc: 'Se morres, podes levar a alguén máis contigo ao caer.' },
  'Cupido': { team: 'good', desc: 'Na primeira noite, unes a dous xogadores en amor — se un morre, o outro tamén.' },

  // ── Mafia ──
  'Mafioso': { team: 'evil', desc: 'Cada noite, a mafia escolle xuntos a quen eliminar.' },
  'Cidadán': { team: 'good', desc: 'Sen poderes especiais — o teu voto é a túa ferramenta.' },
  'Detective': { team: 'good', desc: 'Cada noite podes investigar se alguén pertence á mafia.' },
  'Médico': { team: 'good', desc: 'Cada noite podes protexer a unha persoa de ser eliminada.' },

  // ── Blood on the Clocktower — Trouble Brewing (Pobo/Township) ──
  'Washerwoman': { team: 'good', desc: 'Na 1ª noite, descobres que un de dous xogadores é un Pobo concreto.' },
  'Librarian': { team: 'good', desc: 'Na 1ª noite, descobres que un de dous xogadores é un Marxinado concreto (ou que non hai ningún).' },
  'Investigator': { team: 'good', desc: 'Na 1ª noite, descobres que un de dous xogadores é un Esbirro concreto.' },
  'Chef': { team: 'good', desc: 'Na 1ª noite, sabes cantas parellas de xogadores malvados están sentados xuntos.' },
  'Empath': { team: 'good', desc: 'Cada noite, sabes cantos dos teus dous veciños vivos son do Mal.' },
  'Fortune Teller': { team: 'good', desc: 'Cada noite, elixe dous xogadores: descobres se un deles é o Demo (pode haber un falso positivo).' },
  'Undertaker': { team: 'good', desc: 'Cada noite (agás a 1ª), descobres o rol de quen foi axustizado hoxe.' },
  'Monk': { team: 'good', desc: 'Cada noite (agás a 1ª), protexe a un xogador da morte do Demo.' },
  'Ravenkeeper': { team: 'good', desc: 'Se morres de noite, esperta e descobre o rol de alguén.' },
  'Virgin': { team: 'good', desc: 'A primeira vez que un Pobo te nomea para votación, esa persoa é axustizada de inmediato.' },
  'Slayer': { team: 'good', desc: 'Unha vez por partida, de día, apunta a alguén — se é o Demo, morre.' },
  'Soldier': { team: 'good', desc: 'Estás a salvo do ataque do Demo.' },
  'Mayor': { team: 'good', desc: 'Se só quedan 3 vivos e non hai execución, o Pobo gaña. Se morres de noite, outro pode morrer no teu lugar.' },

  // Marxinados (bo equipo, pero prexudiciais)
  'Butler': { team: 'good', desc: 'Cada noite elixes a alguén — só podes votar se esa persoa tamén vota.' },
  'Drunk': { team: 'good', desc: 'Non sabes que es o Bébedo. Pensas que tes un poder de Pobo, pero non funciona.' },
  'Recluse': { team: 'good', desc: 'Podes rexistrar como do Mal aínda sendo do Pobo.' },
  'Saint': { team: 'good', desc: 'Se es axustizado por votación, o Pobo perde de inmediato. Ten coidado co que dis.' },

  // Esbirros (Mal)
  'Poisoner': { team: 'evil', desc: 'Cada noite, escolle a alguén — o seu poder non funciona esa noite.' },
  'Spy': { team: 'evil', desc: 'Ves o grimorio completo cada noite. Podes rexistrar como do Pobo.' },
  'Scarlet Woman': { team: 'evil', desc: 'Se hai 5 ou máis vivos e o Demo morre, convérteste no novo Demo.' },
  'Baron': { team: 'evil', desc: 'Ao inicio da partida, engádense dous Marxinados extra ao xogo.' },

  // Demo
  'Imp': { team: 'evil', desc: 'Cada noite, elixe a alguén para matar. Se te matas a ti mesmo, un Esbirro pasa a ser o novo Imp.' },
  'Minion': { team: 'evil', desc: 'Coñeces aos outros do Mal e ao Demo. Colabora en segredo para gañar.' },

  // ── Resistencia: Avalon ──
  'Merlín': { team: 'good', desc: 'Coñeces a todos os Servos de Mordred (agás a Mordred, se está en xogo). Non te descubras ou os malvados poden gañar ao final.' },
  'Percival': { team: 'good', desc: 'Ves a Merlín e Morgana, pero non sabes cal é cal.' },
  'Servo leal de Arthur': { team: 'good', desc: 'Non tes información especial. Confía no teu instinto e no resultado das misións.' },
  'Morgana': { team: 'evil', desc: 'Apareces ante Percival coma se foses Merlín, para confundilo.' },
  'Mordred': { team: 'evil', desc: 'Merlín non pode identificarte coma malvado.' },
  'Oberon': { team: 'evil', desc: 'Es do Mal, pero nin coñeces aos outros malvados nin eles saben quen es ti.' },
  'Asasino': { team: 'evil', desc: 'Se o Pobo gaña tres misións, tes unha última oportunidade: adiviña quen é Merlín para roubarlle a vitoria.' },
  'Servo de Mordred': { team: 'evil', desc: 'Coñeces aos outros malvados (agás Oberon, se está en xogo). Colaborade en segredo.' },

  // ── Mentiroso ──
  'Impostor': { team: 'evil', desc: 'Non coñeces a palabra secreta. Escoita e finxe sabela sen que che pillen.' },
}

// Banco de palabras para o preset "Mentiroso" — unha palabra secreta
// repartida a todos agás ao impostor.
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

// Distribución oficial de Blood on the Clocktower (guión Trouble Brewing)
// por número de xogadores: [Pobo, Marxinados, Esbirros, Demos]
const CLOCKTOWER_TABLE = {
  5: [3, 0, 1, 1], 6: [3, 1, 1, 1], 7: [5, 0, 1, 1], 8: [5, 1, 1, 1],
  9: [5, 2, 1, 1], 10: [7, 0, 2, 1], 11: [7, 1, 2, 1], 12: [7, 2, 2, 1],
  13: [9, 0, 3, 1], 14: [9, 1, 3, 1], 15: [9, 2, 3, 1],
}

// Distribución de Resistencia: Avalon por número de xogadores: [bo, malo]
const AVALON_TABLE = {
  5: [3, 2], 6: [4, 2], 7: [4, 3], 8: [5, 3], 9: [6, 3], 10: [6, 4],
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
    const clamped = Math.max(5, Math.min(15, n))
    const [townCount, outsiderCount, minionCount, demonCount] = CLOCKTOWER_TABLE[clamped]
    const townsfolkPool = [
      'Washerwoman', 'Librarian', 'Investigator', 'Chef', 'Empath', 'Fortune Teller',
      'Undertaker', 'Monk', 'Ravenkeeper', 'Virgin', 'Slayer', 'Soldier', 'Mayor',
    ]
    const outsiderPool = ['Butler', 'Drunk', 'Recluse', 'Saint']
    const minionPool = ['Poisoner', 'Spy', 'Scarlet Woman', 'Baron']

    const pool = [
      ...shuffle(townsfolkPool).slice(0, townCount),
      ...shuffle(outsiderPool).slice(0, outsiderCount),
      ...shuffle(minionPool).slice(0, minionCount),
      ...Array(demonCount).fill('Imp'),
    ]
    // Se n queda fóra da táboa oficial (moi poucos/moitos xogadores), axusta
    // engadindo Pobo xenérico ou recortando para que cadre exactamente con n.
    while (pool.length < n) pool.push(townsfolkPool[pool.length % townsfolkPool.length])
    return shuffle(pool).slice(0, n)
  }

  if (preset === 'avalon') {
    const clamped = Math.max(5, Math.min(10, n))
    const [goodCount, evilCount] = AVALON_TABLE[clamped]
    const goodSpecials = ['Merlín']
    if (n >= 6) goodSpecials.push('Percival')
    const evilSpecials = ['Morgana', 'Asasino']
    if (n >= 7) evilSpecials.push('Mordred')
    if (n >= 9) evilSpecials.push('Oberon')

    const goodFiller = Math.max(0, goodCount - goodSpecials.length)
    const evilFiller = Math.max(0, evilCount - evilSpecials.length)
    const pool = [
      ...goodSpecials,
      ...Array(goodFiller).fill('Servo leal de Arthur'),
      ...evilSpecials,
      ...Array(evilFiller).fill('Servo de Mordred'),
    ]
    while (pool.length < n) pool.push('Servo leal de Arthur')
    return shuffle(pool).slice(0, n)
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
  { id: 'clocktower', label: '🕰️ Blood on the Clocktower', minPlayers: 5 },
  { id: 'avalon', label: '🗡️ Resistencia: Avalon', minPlayers: 5 },
  { id: 'mentiroso', label: '🤫 Mentiroso (palabra secreta)', minPlayers: 3 },
  { id: 'custom', label: '✏️ Personalizado', minPlayers: 2 },
]

export function getRoleInfo(name) {
  return ROLE_DESCRIPTIONS[name] || { team: 'neutral', desc: 'Sen descrición para este rol.' }
}

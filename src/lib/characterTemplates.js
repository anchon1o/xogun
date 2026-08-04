export const BUILTIN_TEMPLATES = [
  {
    id: 'builtin-dnd5e',
    name: 'Dungeons & Dragons 5e',
    theme: 'fantasy',
    config: {
      stats: [
        { id: 'str', label: 'Forza', abbr: 'FOR' },
        { id: 'dex', label: 'Destreza', abbr: 'DES' },
        { id: 'con', label: 'Constitución', abbr: 'CON' },
        { id: 'int', label: 'Intelixencia', abbr: 'INT' },
        { id: 'wis', label: 'Sabedoría', abbr: 'SAB' },
        { id: 'cha', label: 'Carisma', abbr: 'CAR' },
      ],
      fields: [
        { id: 'class', label: 'Clase', type: 'text' },
        { id: 'race', label: 'Raza', type: 'text' },
        { id: 'level', label: 'Nivel', type: 'number' },
        { id: 'background', label: 'Trasfondo', type: 'text' },
        { id: 'hp', label: 'Puntos de golpe', type: 'number' },
        { id: 'ac', label: 'Clase de armadura', type: 'number' },
        { id: 'notes', label: 'Notas / Equipo / Feitizos', type: 'textarea' },
      ],
    },
  },
  {
    id: 'builtin-generic',
    name: 'Xenérico (calquera xogo de rol)',
    theme: 'fantasy',
    config: {
      stats: [
        { id: 'stat1', label: 'Forza', abbr: 'FOR' },
        { id: 'stat2', label: 'Axilidade', abbr: 'AXI' },
        { id: 'stat3', label: 'Mente', abbr: 'MEN' },
      ],
      fields: [
        { id: 'class', label: 'Clase / Rol', type: 'text' },
        { id: 'level', label: 'Nivel', type: 'number' },
        { id: 'hp', label: 'Vida', type: 'number' },
        { id: 'notes', label: 'Notas / Inventario', type: 'textarea' },
      ],
    },
  },
  {
    id: 'builtin-vampire',
    name: 'Vampiro: A Mascarada',
    theme: 'horror',
    config: {
      stats: [
        { id: 'strength', label: 'Forza', abbr: 'FOR' },
        { id: 'dexterity', label: 'Destreza', abbr: 'DES' },
        { id: 'charisma', label: 'Carisma', abbr: 'CAR' },
        { id: 'manipulation', label: 'Manipulación', abbr: 'MAN' },
        { id: 'intelligence', label: 'Intelixencia', abbr: 'INT' },
        { id: 'wits', label: 'Astucia', abbr: 'AST' },
      ],
      fields: [
        { id: 'clan', label: 'Clan', type: 'text' },
        { id: 'generation', label: 'Xeración', type: 'text' },
        { id: 'humanity', label: 'Humanidade', type: 'number' },
        { id: 'vitae', label: 'Sangue (Vitae)', type: 'number' },
        { id: 'notes', label: 'Notas / Disciplinas / Vínculos', type: 'textarea' },
      ],
    },
  },
  {
    id: 'builtin-cyberpunk',
    name: 'Cyberpunk (xenérico sci-fi)',
    theme: 'scifi',
    config: {
      stats: [
        { id: 'reflexes', label: 'Reflexos', abbr: 'REF' },
        { id: 'tech', label: 'Técnica', abbr: 'TEC' },
        { id: 'intelligence', label: 'Intelixencia', abbr: 'INT' },
        { id: 'will', label: 'Vontade', abbr: 'VON' },
      ],
      fields: [
        { id: 'role', label: 'Rol (Solo, Netrunner, Fixer...)', type: 'text' },
        { id: 'level', label: 'Nivel', type: 'number' },
        { id: 'hp', label: 'Vida', type: 'number' },
        { id: 'armor', label: 'Armadura', type: 'number' },
        { id: 'notes', label: 'Notas / Ciberware / Equipo', type: 'textarea' },
      ],
    },
  },
  {
    id: 'builtin-pbta',
    name: 'Lixeiro tipo Apocalypse World',
    theme: 'modern',
    config: {
      stats: [
        { id: 'cool', label: 'Frialdade', abbr: 'FRI' },
        { id: 'hard', label: 'Dureza', abbr: 'DUR' },
        { id: 'hot', label: 'Atractivo', abbr: 'ATR' },
        { id: 'sharp', label: 'Perspicacia', abbr: 'PER' },
        { id: 'weird', label: 'Rareza', abbr: 'RAR' },
      ],
      fields: [
        { id: 'playbook', label: 'Arquetipo (Playbook)', type: 'text' },
        { id: 'harm', label: 'Dano acumulado', type: 'number' },
        { id: 'notes', label: 'Notas / Movementos / Vínculos', type: 'textarea' },
      ],
    },
  },
]

export const THEME_STYLES = {
  fantasy: { bg: 'from-amber-950/40 to-xogun-card', accent: '#c8a96e', emoji: '🐉' },
  scifi:   { bg: 'from-cyan-950/40 to-xogun-card',  accent: '#6ec8c8', emoji: '🚀' },
  horror:  { bg: 'from-red-950/40 to-xogun-card',   accent: '#c86e6e', emoji: '🕯️' },
  modern:  { bg: 'from-slate-800/40 to-xogun-card',  accent: '#8e6ec8', emoji: '🎭' },
}

export function getThemeStyle(theme) {
  return THEME_STYLES[theme] || THEME_STYLES.fantasy
}

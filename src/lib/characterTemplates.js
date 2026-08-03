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

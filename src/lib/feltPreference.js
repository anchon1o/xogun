export const FELT_COLORS = [
  { id: 'green',    label: 'Verde clásico', bg: '#1a4d3a', border: '#2d7a5a' },
  { id: 'burgundy', label: 'Granate',       bg: '#4d1a2a', border: '#7a2d47' },
  { id: 'navy',     label: 'Azul mariño',   bg: '#1a2a4d', border: '#2d477a' },
  { id: 'wood',     label: 'Madeira',       bg: '#3d2817', border: '#6b4a2a' },
  { id: 'purple',   label: 'Púrpura',       bg: '#3a1a4d', border: '#5d2d7a' },
  { id: 'charcoal', label: 'Carbón',        bg: '#252525', border: '#404040' },
]

const STORAGE_KEY = 'xogun-felt-color'

export function loadFeltPreference() {
  try { return localStorage.getItem(STORAGE_KEY) || 'green' } catch { return 'green' }
}

export function saveFeltPreference(id) {
  try { localStorage.setItem(STORAGE_KEY, id) } catch {}
}

export function getFelt(id) {
  return FELT_COLORS.find(f => f.id === id) || FELT_COLORS[0]
}

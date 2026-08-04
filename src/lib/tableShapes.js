export const TABLE_SHAPES = [
  { id: 'oval',   label: 'Oval' },
  { id: 'circle', label: 'Circular' },
  { id: 'rect',   label: 'Rectangular' },
  { id: 'square', label: 'Cadrada' },
]

const STORAGE_KEY = 'xogun-table-shape'

export function loadShapePreference() {
  try { return localStorage.getItem(STORAGE_KEY) || 'oval' } catch { return 'oval' }
}
export function saveShapePreference(id) {
  try { localStorage.setItem(STORAGE_KEY, id) } catch {}
}

const RECT = { top: 15, bottom: 85, left: 12, right: 88 }

function rectPositions(distribution) {
  const { top, right, bottom, left } = distribution
  const positions = []

  for (let i = 0; i < top; i++) {
    const f = (i + 1) / (top + 1)
    positions.push({ left: `${RECT.left + f * (RECT.right - RECT.left)}%`, top: `${RECT.top}%` })
  }
  for (let i = 0; i < right; i++) {
    const f = (i + 1) / (right + 1)
    positions.push({ left: `${RECT.right}%`, top: `${RECT.top + f * (RECT.bottom - RECT.top)}%` })
  }
  for (let i = 0; i < bottom; i++) {
    const f = (i + 1) / (bottom + 1)
    positions.push({ left: `${RECT.right - f * (RECT.right - RECT.left)}%`, top: `${RECT.bottom}%` })
  }
  for (let i = 0; i < left; i++) {
    const f = (i + 1) / (left + 1)
    positions.push({ left: `${RECT.left}%`, top: `${RECT.bottom - f * (RECT.bottom - RECT.top)}%` })
  }
  return positions
}

function ellipsePositions(n, rx, ry) {
  const positions = []
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2
    positions.push({ left: `${50 + rx * Math.cos(angle)}%`, top: `${50 + ry * Math.sin(angle)}%` })
  }
  return positions
}

export function positionsForShape(shape, n, distribution) {
  if (n <= 0) return []
  if (shape === 'circle') return ellipsePositions(n, 42, 42)
  if (shape === 'oval') return ellipsePositions(n, 46, 34)
  return rectPositions(distribution || evenSides(n))
}

export function evenSides(n) {
  const base = Math.floor(n / 4)
  const rem = n % 4
  const counts = [base, base, base, base]
  for (let i = 0; i < rem; i++) counts[i]++
  return { top: counts[0], right: counts[1], bottom: counts[2], left: counts[3] }
}

export function facingSides(n) {
  const top = Math.ceil(n / 2)
  const bottom = n - top
  return { top, right: 0, bottom, left: 0 }
}

export function oneVsRest(n) {
  if (n < 2) return { top: n, right: 0, bottom: 0, left: 0 }
  return { top: n - 1, right: 0, bottom: 1, left: 0 }
}

export function distributionSum(d) {
  return (d?.top || 0) + (d?.right || 0) + (d?.bottom || 0) + (d?.left || 0)
}

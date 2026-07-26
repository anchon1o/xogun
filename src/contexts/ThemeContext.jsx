import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export const THEMES = {
  dark: {
    bg:      '#0f0e17',
    surface: '#1a1828',
    card:    '#221f35',
    border:  '#2e2a45',
    text:    '#e8e4f0',
    muted:   '#8b85a0',
  },
  light: {
    bg:      '#f4f2f9',
    surface: '#ffffff',
    card:    '#eeeaf6',
    border:  '#d4cfe8',
    text:    '#1a1828',
    muted:   '#6b6480',
  },
}

export function ThemeProvider({ children, profile }) {
  const [mode, setMode]         = useState('dark')
  const [accentColor, setAccent] = useState('#c8a96e')

  useEffect(() => {
    if (profile) {
      setMode(profile.theme || 'dark')
      setAccent(profile.accent_color || '#c8a96e')
    }
  }, [profile])

  useEffect(() => {
    const t = THEMES[mode] || THEMES.dark
    const r = document.documentElement.style
    r.setProperty('--xogun-bg',      t.bg)
    r.setProperty('--xogun-surface', t.surface)
    r.setProperty('--xogun-card',    t.card)
    r.setProperty('--xogun-border',  t.border)
    r.setProperty('--xogun-text',    t.text)
    r.setProperty('--xogun-muted',   t.muted)
    r.setProperty('--xogun-accent',  accentColor)
    // gold variant slightly lighter
    r.setProperty('--xogun-gold',    lighten(accentColor, 0.15))
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode, accentColor])

  function lighten(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16)
    const r = Math.min(255, (num >> 16) + Math.round(255 * amount))
    const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * amount))
    const b = Math.min(255, (num & 0xff) + Math.round(255 * amount))
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
  }

  return (
    <ThemeContext.Provider value={{ mode, setMode, accentColor, setAccent }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

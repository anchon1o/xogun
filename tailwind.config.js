/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        xogun: {
          bg:      'var(--xogun-bg)',
          surface: 'var(--xogun-surface)',
          card:    'var(--xogun-card)',
          border:  'var(--xogun-border)',
          accent:  'var(--xogun-accent)',
          gold:    'var(--xogun-gold)',
          text:    'var(--xogun-text)',
          muted:   'var(--xogun-muted)',
          red:     '#d4463a',
          green:   '#4caf7d',
        }
      },
      fontFamily: {
        display: ['"Cinzel"', 'Georgia', 'serif'],
        body:    ['"Inter"', 'system-ui', 'sans-serif'],
        mono:    ['"IBM Plex Mono"', 'monospace'],
      },
      animation: {
        'fade-in':    'fadeIn .25s ease-out',
        'slide-up':   'slideUp .3s ease-out',
        'pop':        'pop .4s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 },                        to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pop:     { '0%': { transform: 'scale(1.2)' }, '60%': { transform: 'scale(.95)' }, '100%': { transform: 'scale(1)' } },
      }
    },
  },
  plugins: [],
}

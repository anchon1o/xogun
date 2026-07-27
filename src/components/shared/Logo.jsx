import { useAppConfig } from '../../contexts/AppConfigContext'

/**
 * Logo compoñente reutilizable.
 * - Se hai unha URL de logo personalizado (imaxe), úsase tal cual.
 * - Se non, úsase o SVG por defecto con currentColor, que herda a cor do tema.
 *
 * Para que un SVG cambie de cor co tema, debe usar fill="currentColor"
 * nas súas paths — así herda automaticamente a cor CSS `color` do elemento pai,
 * que en Xogún normalmente será var(--xogun-accent).
 */
export default function Logo({ size = 32, className = '', color }) {
  const { config } = useAppConfig()
  const customLogoUrl = config.logo_url

  if (customLogoUrl) {
    return (
      <img src={customLogoUrl} alt="Logo" style={{ width: size, height: size }}
        className={`object-contain ${className}`} />
    )
  }

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}
      className={className}
      style={{ color: color || 'var(--xogun-accent)' }}>
      <path d="M42 8 C36 8 32 14 34 20 C36 26 42 32 50 34 C58 32 64 26 66 20 C68 14 64 8 58 8 C54 8 51 12 50 16 C49 12 46 8 42 8 Z"
            fill="currentColor" opacity="0.85"/>
      <path d="M38 34 C30 36 22 40 18 46 L28 50 L24 62 L34 58 C36 66 42 70 50 70 C58 70 64 66 66 58 L76 62 L72 50 L82 46 C78 40 70 36 62 34 C58 40 54 42 50 42 C46 42 42 40 38 34 Z"
            fill="currentColor"/>
    </svg>
  )
}

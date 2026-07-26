import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAvatars() {
  const [avatars, setAvatars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('avatars').select('*').eq('active', true).order('sort_order')
      .then(({ data }) => { setAvatars(data || []); setLoading(false) })
  }, [])

  return { avatars, loading }
}

// Renders avatar SVG con el color del usuario
export function AvatarDisplay({ avatarSvg, color = '#c8a96e', size = 40, className = '' }) {
  if (!avatarSvg) {
    return (
      <div className={`rounded-full flex items-center justify-center font-bold text-white ${className}`}
        style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.4 }}>
        ?
      </div>
    )
  }
  const colored = avatarSvg.replace(/fill="currentColor"/g, `fill="${color}"`)
  return (
    <div className={`rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size, backgroundColor: color + '22' }}
      dangerouslySetInnerHTML={{ __html: colored }} />
  )
}

export function UserAvatar({ profile, size = 40, className = '' }) {
  const color = profile?.avatar_color || '#c8a96e'
  const initial = (profile?.display_name || profile?.email || '?')[0].toUpperCase()

  if (!profile?.avatar_id) {
    return (
      <div className={`rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}
        style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.38 }}>
        {initial}
      </div>
    )
  }

  // Si tiene avatar_id, el SVG debe venir del perfil con join o cachearse
  // Por simplicidad usamos la inicial coloreada como fallback hasta que se cargue
  return (
    <div className={`rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.38 }}>
      {initial}
    </div>
  )
}

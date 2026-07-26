import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Library, Wrench } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const username = profile?.display_name || profile?.email?.replace('@xogun.app', '')

  return (
    <div className="fixed inset-0 top-14 flex flex-col md:flex-row">
      {/* Colección block */}
      <button onClick={() => navigate('/catalogo')}
        className="group relative flex-1 flex flex-col items-center justify-center gap-4 border-b md:border-b-0 md:border-r border-xogun-border
                   hover:bg-xogun-card/40 transition-colors duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-xogun-accent/0 to-xogun-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Library size={56} className="text-xogun-accent relative z-10" strokeWidth={1.5} />
        <div className="text-center relative z-10 px-6">
          <h2 className="font-display text-3xl text-xogun-text mb-2">Colección</h2>
          <p className="text-xogun-muted text-sm max-w-xs leading-relaxed">
            Catálogo de xogos, coleccións persoais e historial de partidas.
          </p>
          {!user && (
            <span className="mt-4 inline-block text-xs text-xogun-muted border border-xogun-border rounded-full px-3 py-1">
              Require conta para coleccionar
            </span>
          )}
        </div>
      </button>

      {/* Centered logo seal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-xogun-bg border-2 border-xogun-accent flex items-center justify-center shadow-2xl">
          <img src="/logo-icon.png" alt="Xogún" className="w-12 h-12 md:w-14 md:h-14 object-contain" />
        </div>
      </div>

      {/* Ferramentas block */}
      <button onClick={() => navigate('/ferramentas')}
        className="group relative flex-1 flex flex-col items-center justify-center gap-4
                   hover:bg-xogun-card/40 transition-colors duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-xogun-accent/0 to-xogun-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Wrench size={56} className="text-xogun-accent relative z-10" strokeWidth={1.5} />
        <div className="text-center relative z-10 px-6">
          <h2 className="font-display text-3xl text-xogun-text mb-2">Ferramentas</h2>
          <p className="text-xogun-muted text-sm max-w-xs leading-relaxed">
            Dados 3D, marcadores, temporizadores e orde de turnos para as túas partidas.
          </p>
          <span className="mt-4 inline-block text-xs text-xogun-green border border-xogun-green/30 rounded-full px-3 py-1">
            Acceso libre
          </span>
        </div>
      </button>

      {/* Welcome message, small, top corner */}
      {user && (
        <p className="absolute top-3 left-1/2 -translate-x-1/2 text-xogun-muted text-xs z-20">
          Benvido, <span className="text-xogun-accent">{username}</span>
        </p>
      )}
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Library, Wrench } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const username = profile?.display_name || profile?.email?.replace('@xogun.app', '')

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center gap-10 py-10">
      {/* Hero */}
      <div className="text-center space-y-3">
        <img src="/logo-full.png" alt="Xogún" className="w-48 mx-auto object-contain" />
        {user && (
          <p className="text-xogun-muted text-sm">Benvido de volta, <span className="text-xogun-accent">{username}</span></p>
        )}
      </div>

      {/* Two big blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
        <button onClick={() => navigate('/catalogo')}
          className="group relative overflow-hidden rounded-2xl border border-xogun-border bg-xogun-card p-8
                     hover:border-xogun-accent transition-all duration-300 hover:scale-[1.02] text-left">
          <div className="absolute inset-0 bg-gradient-to-br from-xogun-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Library size={40} className="text-xogun-accent mb-4" />
          <h2 className="font-display text-2xl text-xogun-text mb-2">Colección</h2>
          <p className="text-xogun-muted text-sm leading-relaxed">
            Catálogo de xogos, coleccións persoais, historial de partidas e moito máis.
          </p>
          {!user && (
            <span className="mt-4 inline-block text-xs text-xogun-muted border border-xogun-border rounded-full px-3 py-1">
              Require conta para coleccionar
            </span>
          )}
        </button>

        <button onClick={() => navigate('/ferramentas')}
          className="group relative overflow-hidden rounded-2xl border border-xogun-border bg-xogun-card p-8
                     hover:border-xogun-accent transition-all duration-300 hover:scale-[1.02] text-left">
          <div className="absolute inset-0 bg-gradient-to-br from-xogun-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Wrench size={40} className="text-xogun-accent mb-4" />
          <h2 className="font-display text-2xl text-xogun-text mb-2">Ferramentas</h2>
          <p className="text-xogun-muted text-sm leading-relaxed">
            Dados 3D, marcadores, temporizadores, orde de turnos e moitas máis utilidades para as túas partidas.
          </p>
          <span className="mt-4 inline-block text-xs text-xogun-green border border-xogun-green/30 rounded-full px-3 py-1">
            Acceso libre
          </span>
        </button>
      </div>
    </div>
  )
}

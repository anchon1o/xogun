import { useNavigate } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

const LAST_CODE_KEY = 'xogun-last-social-code'
function loadLastCode() { try { return localStorage.getItem(LAST_CODE_KEY) } catch { return null } }

export default function SocialGameLauncherWidget() {
  const navigate = useNavigate()
  const lastCode = loadLastCode()

  return (
    <div className="text-center py-6 space-y-4">
      <span className="text-4xl">🐺</span>
      <p className="text-xogun-muted text-sm max-w-xs mx-auto">
        Lobo, Mafia, Blood on the Clocktower... cada xogador recibe o seu rol en privado no seu propio
        móbil. Ábrese nunha pantalla propia, fóra de Ferramentas.
      </p>
      {lastCode && (
        <button onClick={() => navigate(`/social/${lastCode}`)} className="btn-secondary flex items-center gap-1.5 text-xs mx-auto">
          Continuar sala {lastCode}
        </button>
      )}
      <button onClick={() => navigate('/social')} className="btn-primary flex items-center gap-2 mx-auto">
        <ExternalLink size={15} /> Abrir Xogo social
      </button>
    </div>
  )
}

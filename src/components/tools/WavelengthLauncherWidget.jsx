import { useNavigate } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

const LAST_CODE_KEY = 'xogun-last-escala-code'
function loadLastCode() { try { return localStorage.getItem(LAST_CODE_KEY) } catch { return null } }

export default function WavelengthLauncherWidget() {
  const navigate = useNavigate()
  const lastCode = loadLastCode()

  return (
    <div className="text-center py-6 space-y-4">
      <span className="text-4xl">🎯</span>
      <p className="text-xogun-muted text-sm max-w-xs mx-auto">
        Escala — a psíquica ve un obxectivo secreto nun dial e o grupo adivina a posición desde os seus
        móbiles. Ábrese nunha pantalla propia, fóra de Ferramentas.
      </p>
      {lastCode && (
        <button onClick={() => navigate(`/escala/${lastCode}`)} className="btn-secondary flex items-center gap-1.5 text-xs mx-auto">
          Continuar sala {lastCode}
        </button>
      )}
      <button onClick={() => navigate('/escala')} className="btn-primary flex items-center gap-2 mx-auto">
        <ExternalLink size={15} /> Abrir Escala
      </button>
    </div>
  )
}

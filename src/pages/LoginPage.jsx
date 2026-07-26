import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    const { error } = await signIn(username, password)
    if (error) { setError('Usuario ou contrasinal incorrecto'); setLoading(false) }
    else navigate('/')
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo-icon.png" alt="Xogún" className="w-16 h-16 object-contain mx-auto mb-4" />
          <h1 className="font-display text-3xl text-xogun-accent tracking-wider">Xogún</h1>
          <p className="text-xogun-muted text-sm mt-1">Inicia sesión para acceder á túa colección</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nome de usuario</label>
              <input className="input" type="text" placeholder="o teu usuario"
                value={username} onChange={e => setUsername(e.target.value)}
                required autoFocus autoCapitalize="none" autoCorrect="off" />
            </div>
            <div>
              <label className="label">Contrasinal</label>
              <input className="input" type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-xogun-red text-sm text-center">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
        <p className="text-center text-xogun-muted text-xs mt-4">
          Non tes conta? Fala co administrador da aplicación.
        </p>
        <div className="text-center mt-2">
          <Link to="/" className="text-xogun-muted text-xs hover:text-xogun-accent transition-colors">
            ← Volver ao inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

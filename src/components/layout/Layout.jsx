import { useState } from 'react'
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useAppConfig } from '../../contexts/AppConfigContext'
import { Library, Wrench, Shield, LogOut, LogIn, Swords, User, UsersRound, TrendingUp, Calendar as CalendarIcon, Menu, X, ChevronDown } from 'lucide-react'
import { UserAvatar } from '../../hooks/useAvatars'
import Logo from '../shared/Logo'
import NotificationBell from './NotificationBell'

export default function Layout() {
  const { user, profile, signOut } = useAuth()
  const { config } = useAppConfig()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  async function handleSignOut() {
    await signOut(); navigate('/'); setUserMenuOpen(false)
  }

  const navLinks = [
    { to: '/catalogo',    icon: Library,  label: 'Xogos' },
    { to: '/ferramentas', icon: Wrench,   label: 'Ferramentas' },
    ...(user ? [
      { to: '/partidas',  icon: Swords,   label: 'Partidas' },
    ] : []),
  ]

  return (
    <div className="min-h-screen flex flex-col bg-xogun-bg">
      <header className="bg-xogun-surface border-b border-xogun-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <Logo size={32} />
            <span className="font-display text-lg text-xogun-accent tracking-wider hidden sm:block">
              {config.app_name || 'Xogún'}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-4">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive ? 'tab-active' : 'tab-inactive'}`
                }>
                <Icon size={14} />{label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {user && profile?.notifications_enabled !== false && (
              <NotificationBell userId={user.id} />
            )}
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-xogun-border hover:border-xogun-accent transition-colors">
                  <UserAvatar profile={profile} size={28} />
                  <span className="hidden sm:block text-sm text-xogun-text">
                    {profile?.display_name || profile?.email?.replace('@xogun.app','')}
                  </span>
                  <ChevronDown size={12} className="text-xogun-muted" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 card shadow-xl z-50 py-1">
                    <NavLink to="/perfil" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-xogun-muted hover:text-xogun-text hover:bg-xogun-surface transition-colors">
                      <User size={13} /> O meu perfil
                    </NavLink>
                    <NavLink to="/amigos" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-xogun-muted hover:text-xogun-text hover:bg-xogun-surface transition-colors">
                      <UsersRound size={13} /> Amigos
                    </NavLink>
                    <NavLink to="/estatisticas" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-xogun-muted hover:text-xogun-text hover:bg-xogun-surface transition-colors">
                      <TrendingUp size={13} /> Estatísticas
                    </NavLink>
                    <NavLink to="/retos" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-xogun-muted hover:text-xogun-text hover:bg-xogun-surface transition-colors">
                      <Swords size={13} /> Retos
                    </NavLink>
                    <NavLink to="/calendario" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-xogun-muted hover:text-xogun-text hover:bg-xogun-surface transition-colors">
                      <CalendarIcon size={13} /> Calendario
                    </NavLink>
                    {profile?.is_admin && (
                      <NavLink to="/admin" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-xogun-muted hover:text-xogun-accent hover:bg-xogun-surface transition-colors">
                        <Shield size={13} /> Administración
                      </NavLink>
                    )}
                    <hr className="border-xogun-border my-1" />
                    <button onClick={handleSignOut}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-xogun-muted hover:text-xogun-red hover:bg-xogun-surface transition-colors w-full text-left">
                      <LogOut size={13} /> Saír
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => navigate('/login')}
                className="btn-primary flex items-center gap-1.5 py-1.5 text-xs">
                <LogIn size={13} /> Acceder
              </button>
            )}
            <button onClick={() => setMobileOpen(o => !o)} className="md:hidden btn-ghost p-1.5">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden border-t border-xogun-border px-4 py-2 flex flex-col gap-1">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'tab-active' : 'tab-inactive'}`
                }>
                <Icon size={15} />{label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

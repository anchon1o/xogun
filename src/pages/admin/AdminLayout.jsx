import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Users, BookOpen, Settings, Gamepad2, Palette, Shield, Smile, GitPullRequest, Dices, Image, History, ChevronDown } from 'lucide-react'

const adminNav = [
  { to: '/admin/usuarios',    icon: Users,          label: 'Usuarios' },
  { to: '/admin/catalogo',    icon: BookOpen,       label: 'Catálogo' },
  { to: '/admin/xogos',       icon: Gamepad2,       label: 'Xogos pendentes' },
  { to: '/admin/imaxes',      icon: Image,          label: 'Imaxes pendentes' },
  { to: '/admin/suxestions',  icon: GitPullRequest, label: 'Suxestións' },
  { to: '/admin/presets',     icon: Dices,          label: 'Presets' },
  { to: '/admin/avatares',    icon: Smile,          label: 'Avatares' },
  { to: '/admin/funcions',    icon: Settings,       label: 'Funcionalidades' },
  { to: '/admin/aparencia',   icon: Palette,        label: 'Aparencia' },
  { to: '/admin/actividade',  icon: History,        label: 'Actividade' },
]

export default function AdminLayout() {
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const current = adminNav.find(n => location.pathname.startsWith(n.to)) || adminNav[0]

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Cabeceira móbil: selector desplegable en vez de sidebar */}
      <div className="lg:hidden">
        <button onClick={() => setMobileNavOpen(o => !o)}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-xogun-card border border-xogun-border text-sm">
          <Shield size={15} className="text-xogun-accent flex-shrink-0" />
          <current.icon size={14} className="flex-shrink-0" />
          <span className="flex-1 text-left font-medium">{current.label}</span>
          <ChevronDown size={14} className={`transition-transform flex-shrink-0 ${mobileNavOpen ? 'rotate-180' : ''}`} />
        </button>
        {mobileNavOpen && (
          <nav className="mt-1 grid grid-cols-2 gap-1 bg-xogun-card border border-xogun-border rounded-lg p-2">
            {adminNav.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} onClick={() => setMobileNavOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs transition-colors ${isActive ? 'tab-active' : 'tab-inactive'}`
                }>
                <Icon size={12} className="flex-shrink-0" />
                <span className="truncate">{label}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </div>

      {/* Sidebar fixa en escritorio */}
      <aside className="hidden lg:block w-48 flex-shrink-0">
        <div className="flex items-center gap-2 mb-4 px-2">
          <Shield size={16} className="text-xogun-accent" />
          <span className="font-display text-sm text-xogun-accent">Administración</span>
        </div>
        <nav className="space-y-1">
          {adminNav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'tab-active' : 'tab-inactive'}`
              }>
              <Icon size={14} />{label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 min-w-0"><Outlet /></div>
    </div>
  )
}

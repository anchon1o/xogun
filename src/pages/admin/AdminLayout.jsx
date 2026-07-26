import { Outlet, NavLink } from 'react-router-dom'
import { Users, BookOpen, Settings, Gamepad2, Palette, Shield, Smile, GitPullRequest } from 'lucide-react'

const adminNav = [
  { to: '/admin/usuarios',    icon: Users,          label: 'Usuarios' },
  { to: '/admin/catalogo',    icon: BookOpen,       label: 'Catálogo' },
  { to: '/admin/xogos',       icon: Gamepad2,       label: 'Xogos pendentes' },
  { to: '/admin/suxestions',  icon: GitPullRequest, label: 'Suxestións' },
  { to: '/admin/avatares',    icon: Smile,          label: 'Avatares' },
  { to: '/admin/funcions',    icon: Settings,       label: 'Funcionalidades' },
  { to: '/admin/aparencia',   icon: Palette,        label: 'Aparencia' },
]

export default function AdminLayout() {
  return (
    <div className="flex gap-6">
      <aside className="w-48 flex-shrink-0">
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

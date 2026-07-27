import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AppConfigProvider } from './contexts/AppConfigContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import CatalogPage from './pages/CatalogPage'
import CollectionPage from './pages/CollectionPage'
import ToolsPage from './pages/ToolsPage'
import MatchesPage from './pages/MatchesPage'
import ProfilePage from './pages/ProfilePage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCatalog from './pages/admin/AdminCatalog'
import AdminFeatures from './pages/admin/AdminFeatures'
import AdminGames from './pages/admin/AdminGames'
import AdminAppearance from './pages/admin/AdminAppearance'
import AdminSuggestions from './pages/admin/AdminSuggestions'
import AdminAvatars from './pages/admin/AdminAvatars'

function Splash() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-xogun-bg">
      <div className="flex flex-col items-center gap-3">
        <svg viewBox="0 0 100 100" width="64" height="64" className="animate-pulse" style={{ color: '#c8a96e' }}>
          <path d="M42 8 C36 8 32 14 34 20 C36 26 42 32 50 34 C58 32 64 26 66 20 C68 14 64 8 58 8 C54 8 51 12 50 16 C49 12 46 8 42 8 Z" fill="currentColor" opacity="0.85"/>
          <path d="M38 34 C30 36 22 40 18 46 L28 50 L24 62 L34 58 C36 66 42 70 50 70 C58 70 64 66 66 58 L76 62 L72 50 L82 46 C78 40 70 36 62 34 C58 40 54 42 50 42 C46 42 42 40 38 34 Z" fill="currentColor"/>
        </svg>
        <span className="font-display text-xl text-xogun-accent tracking-wider">Xogún</span>
      </div>
    </div>
  )
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Splash />
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { profile, loading } = useAuth()
  if (loading) return null
  return profile?.is_admin ? children : <Navigate to="/" replace />
}

function AppRoutes() {
  const { profile } = useAuth()
  return (
    <ThemeProvider profile={profile}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="catalogo"    element={<CatalogPage />} />
          <Route path="ferramentas" element={<ToolsPage />} />
          <Route path="coleccion"   element={<PrivateRoute><CollectionPage /></PrivateRoute>} />
          <Route path="partidas"    element={<PrivateRoute><MatchesPage /></PrivateRoute>} />
          <Route path="perfil"      element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index               element={<Navigate to="usuarios" replace />} />
            <Route path="usuarios"     element={<AdminUsers />} />
            <Route path="catalogo"     element={<AdminCatalog />} />
            <Route path="xogos"        element={<AdminGames />} />
            <Route path="suxestions"   element={<AdminSuggestions />} />
            <Route path="avatares"     element={<AdminAvatars />} />
            <Route path="funcions"     element={<AdminFeatures />} />
            <Route path="aparencia"    element={<AdminAppearance />} />
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <AppConfigProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </AppConfigProvider>
  )
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AppConfigProvider } from './contexts/AppConfigContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { GameSessionProvider } from './contexts/GameSessionContext'
import { MusicPlayerProvider } from './contexts/MusicPlayerContext'
import { ToastProvider } from './contexts/ToastContext'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import GamesPage from './pages/GamesPage'
import ToolsPage from './pages/ToolsPage'
import MatchesPage from './pages/MatchesPage'
import ProfilePage from './pages/ProfilePage'
import FriendsPage from './pages/FriendsPage'
import StatsPage from './pages/StatsPage'
import ChallengesPage from './pages/ChallengesPage'
import CalendarPage from './pages/CalendarPage'
import SocialGamePage from './pages/SocialGamePage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCatalog from './pages/admin/AdminCatalog'
import AdminFeatures from './pages/admin/AdminFeatures'
import AdminGames from './pages/admin/AdminGames'
import AdminAppearance from './pages/admin/AdminAppearance'
import AdminSuggestions from './pages/admin/AdminSuggestions'
import AdminAvatars from './pages/admin/AdminAvatars'
import AdminPresets from './pages/admin/AdminPresets'
import AdminImages from './pages/admin/AdminImages'
import AdminActivityLog from './pages/admin/AdminActivityLog'
import { useAppConfig } from './contexts/AppConfigContext'

function Splash() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-xogun-bg">
      <div className="flex flex-col items-center gap-3">
        <svg viewBox="20.5 76.0 169.5 143.1" width="64" height="64" className="animate-pulse" style={{ color: '#c8a96e' }}>
          <g transform="translate(7.1823832,32.320724)">
            <path style={{ fill: 'currentColor' }}
              d="m 52.161481,179.45051 c -0.333248,-0.86844 2.75681,-12.28382 6.866784,-25.36754 4.109984,-13.08368 7.47269,-24.12326 7.47269,-24.53236 0,-0.4091 -2.378404,-3.25862 -5.285338,-6.33228 l -5.285348,-5.58848 3.63113,-4.13774 3.631122,-4.13778 1.83354,2.64584 c 3.457152,4.98876 11.002296,11.60728 16.556092,14.52284 4.981966,2.61538 6.65027,2.91806 16.139636,2.92828 9.411931,0.01 11.238171,-0.31022 16.499551,-2.8941 5.27696,-2.59154 12.80024,-9.13092 17.35596,-15.08618 1.58634,-2.07368 1.68352,-2.04224 4.78394,1.54752 1.7406,2.0153 3.16472,4.17834 3.16472,4.80672 0,0.6284 -2.14312,3.24586 -4.7625,5.81658 -2.61938,2.57074 -4.7625,5.33526 -4.7625,6.14344 0,0.80814 3.34342,12.22456 7.42986,25.36978 4.96338,15.96624 7.0778,24.25246 6.36934,24.96092 -0.70844,0.70844 -3.43842,-1.21178 -8.2236,-5.78434 -9.65134,-9.22254 -15.21106,-13.60506 -24.57694,-19.37308 -6.1854,-3.80932 -8.87816,-4.85838 -12.470599,-4.85838 -7.806066,0 -19.861562,7.49892 -37.042766,23.04182 -6.4396,5.82556 -8.87727,7.47472 -9.324774,6.30854 z m -17.991054,-2.64998 c -10.827628,-3.6709 -14.554666,-6.03788 -13.707946,-8.70566 1.196054,-3.76842 12.307888,-23.28636 13.257256,-23.28636 0.522192,0 4.796238,2.61936 9.497884,5.82082 4.701646,3.20146 9.00629,5.82084 9.565884,5.82084 1.542606,0 1.292342,1.43016 -2.23973,12.79916 -3.796664,12.22064 -3.289882,11.98692 -16.373348,7.55122 z m 114.399593,1.74248 c -2.14108,-6.03694 -5.84454,-18.68644 -5.85554,-20.00012 -0.008,-0.88626 1.70548,-2.53714 3.80648,-3.66862 2.10102,-1.13146 6.23516,-3.85914 9.18698,-6.0615 2.95184,-2.20236 5.88566,-4.00428 6.51962,-4.00428 0.63396,0 4.15974,5.49902 7.8351,12.22006 5.32752,9.74234 6.43024,12.52392 5.43868,13.71868 -1.5841,1.90872 -16.39724,7.64922 -22.08572,8.55884 -3.19946,0.51162 -4.46416,0.31246 -4.8456,-0.76306 z M 47.352731,149.43061 c -9.514946,-6.50116 -23.722944,-18.5632 -23.581328,-20.01964 0.236876,-2.43614 9.99709,-19.52746 11.151414,-19.52746 2.312618,0 13.641262,6.7394 19.066616,11.34272 9.181,7.78992 9.176778,7.77264 4.997292,20.47466 -1.979052,6.0146 -4.118726,11.09406 -4.754828,11.2877 -0.63611,0.1936 -3.731736,-1.40744 -6.879166,-3.55796 z m 90.060469,-6.47418 c -1.8401,-5.67532 -3.55986,-10.9885 -3.82168,-11.80708 -1.24376,-3.88836 24.48808,-22.75994 28.01416,-20.5454 2.35206,1.47718 11.06148,18.05222 10.39638,19.78548 -1.08748,2.8339 -27.3627,22.88574 -29.98868,22.88574 -0.69,0 -2.76008,-4.64344 -4.60018,-10.31874 z M 89.731965,125.43361 C 73.269283,120.79459 61.776429,104.32971 54.939807,75.589724 52.554863,65.563814 49.814235,58.944494 45.914731,53.79184 l -2.803292,-3.704168 3.748734,-0.32796 c 8.368346,-0.732114 21.689006,4.45611 29.017498,11.301938 l 3.371088,3.149076 -2.696558,3.973606 c -3.51916,5.185776 -4.096046,7.77904 -3.411008,15.333656 0.63538,7.007104 5.09652,17.495102 9.815766,23.076542 3.564478,4.21568 10.13189,7.4663 15.150772,7.49906 17.920349,0.117 32.885009,-33.69299 20.646069,-46.646098 l -2.59696,-2.748516 4.23822,-3.828984 c 7.5369,-6.809134 19.2477,-11.311486 29.42164,-11.311486 h 3.83656 l -2.18442,2.38125 c -3.84404,4.190448 -7.61788,13.081424 -10.76282,25.3567 -6.7149,26.209414 -15.17116,39.517874 -29.18702,45.934554 -6.74034,3.08582 -15.507373,3.97214 -21.787035,2.2026 z m 1.499108,-19.5424 c -3.167878,-2.56608 -4.621784,-5.8161 -4.621784,-10.331458 0,-3.02836 0.819012,-4.6986 3.732752,-7.61232 3.460686,-3.460696 4.094522,-3.691984 8.696324,-3.173292 10.558415,1.190092 14.270395,12.331032 6.648135,19.95331 -2.42238,2.42238 -3.96901,3.03462 -7.618721,3.01584 -2.73175,-0.014 -5.490094,-0.76128 -6.836706,-1.85208 z" />
            <circle style={{ fill: 'currentColor' }} cx="98.320282" cy="96.699623" r="12.425092" />
          </g>
        </svg>
        <span className="font-display text-xl text-xogun-accent tracking-wider">Xōgun</span>
      </div>
    </div>
  )
}

function MaintenanceScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-xogun-bg px-4">
      <div className="text-center max-w-sm">
        <span className="text-5xl">🚧</span>
        <h1 className="font-display text-2xl text-xogun-accent mt-4">Volvemos enseguida</h1>
        <p className="text-xogun-muted text-sm mt-2">
          Xōgun está en mantemento neste momento. Proba de novo en uns minutos.
        </p>
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
  const { config } = useAppConfig()

  if (config.maintenance_mode === true && !profile?.is_admin) {
    return <MaintenanceScreen />
  }

  return (
    <ThemeProvider profile={profile}>
      <GameSessionProvider>
        <MusicPlayerProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="catalogo"    element={<GamesPage />} />
              <Route path="ferramentas" element={<ToolsPage />} />
              <Route path="coleccion"   element={<Navigate to="/catalogo" replace />} />
              <Route path="partidas"    element={<PrivateRoute><MatchesPage /></PrivateRoute>} />
              <Route path="perfil"      element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
              <Route path="amigos"      element={<PrivateRoute><FriendsPage /></PrivateRoute>} />
              <Route path="estatisticas" element={<PrivateRoute><StatsPage /></PrivateRoute>} />
              <Route path="retos"        element={<PrivateRoute><ChallengesPage /></PrivateRoute>} />
              <Route path="calendario"   element={<PrivateRoute><CalendarPage /></PrivateRoute>} />
              <Route path="social"       element={<PrivateRoute><SocialGamePage /></PrivateRoute>} />
              <Route path="social/:code" element={<PrivateRoute><SocialGamePage /></PrivateRoute>} />
              <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index               element={<Navigate to="usuarios" replace />} />
                <Route path="usuarios"     element={<AdminUsers />} />
                <Route path="catalogo"     element={<AdminCatalog />} />
                <Route path="xogos"        element={<AdminGames />} />
                <Route path="suxestions"   element={<AdminSuggestions />} />
                <Route path="presets"      element={<AdminPresets />} />
                <Route path="imaxes"       element={<AdminImages />} />
                <Route path="actividade"   element={<AdminActivityLog />} />
                <Route path="avatares"     element={<AdminAvatars />} />
                <Route path="funcions"     element={<AdminFeatures />} />
                <Route path="aparencia"    element={<AdminAppearance />} />
              </Route>
            </Route>
          </Routes>
        </MusicPlayerProvider>
      </GameSessionProvider>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppConfigProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </AppConfigProvider>
    </ToastProvider>
  )
}

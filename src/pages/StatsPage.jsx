import { useAuth } from '../contexts/AuthContext'
import { useMatches } from '../hooks/useMatches'
import { useStats } from '../hooks/useStats'
import { useCollection } from '../hooks/useCollection'
import { getUnlockedAchievements } from '../lib/achievements'
import { Trophy, Swords, TrendingUp, Users, Flame, Gamepad2, Lock } from 'lucide-react'

const MONTH_LABELS = ['Xan', 'Feb', 'Mar', 'Abr', 'Mai', 'Xuñ', 'Xul', 'Ago', 'Set', 'Out', 'Nov', 'Dec']

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="card text-center">
      <div className="flex items-center justify-center gap-1.5 text-xogun-muted mb-1">{icon}<span className="text-xs">{label}</span></div>
      <div className="font-display text-3xl text-xogun-accent">{value}</div>
      {sub && <p className="text-xogun-muted text-xs mt-0.5">{sub}</p>}
    </div>
  )
}

export default function StatsPage() {
  const { user, profile } = useAuth()
  const { matches, loading } = useMatches(user?.id)
  const { collection } = useCollection(user?.id)
  const userName = profile?.display_name || profile?.email?.replace('@xogun.app', '')
  const stats = useStats(matches, user?.id, userName)
  const achievements = getUnlockedAchievements(stats, collection.length)
  const unlockedCount = achievements.filter(a => a.unlocked).length

  if (loading) return <p className="text-xogun-muted text-sm">Cargando estatísticas...</p>

  if (stats.totalMatches === 0 && collection.length === 0) {
    return (
      <div className="max-w-2xl">
        <h1 className="section-title flex items-center gap-2"><TrendingUp size={20} /> Estatísticas</h1>
        <p className="text-xogun-muted text-sm text-center py-16">
          Aínda non tes partidas nin xogos na colección. Gárdaas dende o Marcador nas Ferramentas ou engade xogos en Colección para ver aquí as túas estatísticas e logros.
        </p>
      </div>
    )
  }

  const maxMonthCount = Math.max(...stats.matchesByMonth.map(m => m.count), 1)
  const maxOpponentCount = Math.max(...stats.favoriteOpponents.map(o => o.count), 1)

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="section-title flex items-center gap-2"><TrendingUp size={20} /> Estatísticas</h1>

      {/* Main stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={<Swords size={15} />} label="Partidas" value={stats.totalMatches} />
        <StatCard icon={<Trophy size={15} />} label="Vitorias" value={stats.totalWins} />
        <StatCard icon={<TrendingUp size={15} />} label="% Vitorias" value={`${stats.winRate}%`} />
        <StatCard icon={<Flame size={15} />} label="Racha actual" value={stats.winStreak}
          sub={stats.longestWinStreak > stats.winStreak ? `Máx: ${stats.longestWinStreak}` : null} />
      </div>

      {/* Most played game */}
      {stats.mostPlayedGame && (
        <div className="card flex items-center gap-3">
          <Gamepad2 size={20} className="text-xogun-accent flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xogun-muted text-xs">Xogo máis xogado</p>
            <p className="font-display text-lg text-xogun-text">{stats.mostPlayedGame.name}</p>
          </div>
          <span className="text-xogun-accent font-display text-2xl">{stats.mostPlayedGame.count}</span>
        </div>
      )}

      {/* Matches per month */}
      {stats.matchesByMonth.length > 1 && (
        <div className="card">
          <p className="label mb-3">Partidas por mes</p>
          <div className="flex items-end gap-2 h-24">
            {stats.matchesByMonth.map(({ month, count }) => {
              const [year, m] = month.split('-')
              return (
                <div key={month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xogun-accent text-xs font-bold">{count}</span>
                  <div className="w-full bg-xogun-accent/30 rounded-t transition-all"
                    style={{ height: `${Math.max(8, (count / maxMonthCount) * 60)}px`, backgroundColor: 'var(--xogun-accent)', opacity: 0.7 }} />
                  <span className="text-xogun-muted text-[10px]">{MONTH_LABELS[parseInt(m) - 1]}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Games played breakdown */}
      {stats.gamesPlayed.length > 0 && (
        <div className="card">
          <p className="label mb-3 flex items-center gap-1.5"><Gamepad2 size={11} /> Xogos xogados</p>
          <div className="space-y-2">
            {stats.gamesPlayed.slice(0, 6).map(g => (
              <div key={g.name} className="flex items-center gap-2">
                <span className="text-sm flex-1 truncate">{g.name}</span>
                <div className="flex-1 max-w-32 h-2 bg-xogun-surface rounded-full overflow-hidden">
                  <div className="h-full bg-xogun-accent rounded-full" style={{ width: `${(g.count / stats.gamesPlayed[0].count) * 100}%` }} />
                </div>
                <span className="text-xogun-muted text-xs w-6 text-right">{g.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorite opponents */}
      {stats.favoriteOpponents.length > 0 && (
        <div className="card">
          <p className="label mb-3 flex items-center gap-1.5"><Users size={11} /> Con quen xogas máis</p>
          <div className="space-y-2">
            {stats.favoriteOpponents.map(o => (
              <div key={o.name} className="flex items-center gap-2">
                <span className="text-sm flex-1 truncate">{o.name}</span>
                <div className="flex-1 max-w-32 h-2 bg-xogun-surface rounded-full overflow-hidden">
                  <div className="h-full bg-xogun-accent rounded-full" style={{ width: `${(o.count / maxOpponentCount) * 100}%` }} />
                </div>
                <span className="text-xogun-muted text-xs w-6 text-right">{o.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="card">
        <p className="label mb-3 flex items-center gap-1.5"><Trophy size={11} /> Logros ({unlockedCount}/{achievements.length})</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {achievements.map(a => (
            <div key={a.id}
              className={`flex flex-col items-center text-center gap-1 p-3 rounded-xl border transition-all ${a.unlocked ? 'border-xogun-accent bg-xogun-accent/10' : 'border-xogun-border bg-xogun-surface opacity-50'}`}>
              <span className="text-2xl">{a.unlocked ? a.emoji : <Lock size={20} className="text-xogun-muted" />}</span>
              <span className={`text-xs font-medium ${a.unlocked ? 'text-xogun-accent' : 'text-xogun-muted'}`}>{a.name}</span>
              <span className="text-xogun-muted text-[10px] leading-tight">{a.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

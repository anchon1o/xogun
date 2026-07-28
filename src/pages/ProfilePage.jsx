import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useAvatars } from '../hooks/useAvatars'
import { useCollection, COLLECTION_STATUSES, VISIBILITY_OPTIONS } from '../hooks/useCollection'
import { useFriendships } from '../hooks/useFriendships'
import { UserAvatar } from '../hooks/useAvatars'
import { Save, Users, BookOpen, Swords } from 'lucide-react'

const THEME_OPTIONS = [
  { id: 'dark',  label: 'Escuro' },
  { id: 'light', label: 'Claro' },
]

const ACCENT_PRESETS = [
  '#c8a96e','#e8c87a','#6e8dc8','#6ec87e',
  '#c86e6e','#c86ec8','#6ec8c8','#a86ec8',
]

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth()
  const { avatars } = useAvatars()
  const { stats } = useCollection(user?.id)
  const { friends } = useFriendships(user?.id)

  const [form, setForm] = useState({
    display_name:          profile?.display_name || '',
    bio:                   profile?.bio || '',
    city:                  profile?.city || '',
    avatar_id:             profile?.avatar_id || null,
    avatar_color:          profile?.avatar_color || '#c8a96e',
    theme:                 profile?.theme || 'dark',
    accent_color:          profile?.accent_color || '#c8a96e',
    collection_visibility: profile?.collection_visibility || 'friends',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  async function handleSave() {
    setSaving(true)
    await updateProfile(form)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="section-title">O meu perfil</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <BookOpen size={16} />, label: 'Xogos', value: stats.total },
          { icon: <Swords size={16} />, label: 'Partidas', value: stats.timesPlayed },
          { icon: <Users size={16} />, label: 'Amigos', value: friends.length },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className="flex items-center justify-center gap-1.5 text-xogun-muted mb-1">{s.icon}<span className="text-xs">{s.label}</span></div>
            <div className="font-display text-2xl text-xogun-accent">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Avatar + identidade */}
      <div className="card space-y-4">
        <h2 className="font-medium text-sm text-xogun-muted uppercase tracking-wider">Identidade</h2>

        {/* Avatar preview + color */}
        <div className="flex items-center gap-4">
          <UserAvatar profile={{ ...profile, ...form }} size={64} />
          <div className="space-y-2">
            <div>
              <label className="label">Cor</label>
              <div className="flex gap-1.5 flex-wrap">
                {ACCENT_PRESETS.map(c => (
                  <button key={c} onClick={() => { set('avatar_color', c); set('accent_color', c) }}
                    className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${form.avatar_color === c ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }} />
                ))}
                <input type="color" value={form.avatar_color}
                  onChange={e => { set('avatar_color', e.target.value); set('accent_color', e.target.value) }}
                  className="w-6 h-6 rounded-full border-2 border-xogun-border cursor-pointer p-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Avatar grid */}
        {avatars.length > 0 && (
          <div>
            <label className="label">Avatar</label>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => set('avatar_id', null)}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-all ${!form.avatar_id ? 'border-xogun-accent' : 'border-xogun-border hover:border-xogun-accent/50'}`}
                style={{ backgroundColor: form.avatar_color + '33', color: form.avatar_color }}>
                {(form.display_name || 'X')[0].toUpperCase()}
              </button>
              {avatars.map(av => {
                const colored = av.svg.replace(/fill="currentColor"/g, `fill="${form.avatar_color}"`)
                return (
                  <button key={av.id} onClick={() => set('avatar_id', av.id)}
                    className={`w-12 h-12 rounded-full border-2 p-1.5 transition-all ${form.avatar_id === av.id ? 'border-xogun-accent' : 'border-xogun-border hover:border-xogun-accent/50'}`}
                    style={{ backgroundColor: form.avatar_color + '22' }}
                    dangerouslySetInnerHTML={{ __html: colored }}
                    title={av.name} />
                )
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Nome para mostrar</label>
            <input className="input" value={form.display_name} onChange={e => set('display_name', e.target.value)} /></div>
          <div><label className="label">Cidade / zona</label>
            <input className="input" value={form.city} onChange={e => set('city', e.target.value)} placeholder="A Coruña..." /></div>
        </div>

        <div><label className="label">Bio</label>
          <textarea className="input" rows={2} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Breve presentación..." /></div>
      </div>

      {/* Preferencias */}
      <div className="card space-y-4">
        <h2 className="font-medium text-sm text-xogun-muted uppercase tracking-wider">Preferencias</h2>

        <div>
          <label className="label">Tema</label>
          <div className="flex gap-2">
            {THEME_OPTIONS.map(t => (
              <button key={t.id} onClick={() => set('theme', t.id)}
                className={`px-4 py-2 rounded-lg text-sm border transition-colors ${form.theme === t.id ? 'border-xogun-accent text-xogun-accent bg-xogun-accent/10' : 'border-xogun-border text-xogun-muted hover:border-xogun-accent'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Visibilidade por defecto</label>
          <p className="text-xogun-muted text-xs mb-2">Aplícase aos xogos novos que engadas. Podes cambiala individualmente en cada xogo dende a túa colección.</p>
          <div className="flex gap-2">
            {VISIBILITY_OPTIONS.map(v => (
              <button key={v.id} onClick={() => set('collection_visibility', v.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-colors ${form.collection_visibility === v.id ? 'border-xogun-accent text-xogun-accent bg-xogun-accent/10' : 'border-xogun-border text-xogun-muted hover:border-xogun-accent'}`}>
                {v.emoji} {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="btn-primary flex items-center gap-2 disabled:opacity-50">
        <Save size={14} />
        {saving ? 'Gardando...' : saved ? '✓ Gardado' : 'Gardar cambios'}
      </button>
    </div>
  )
}

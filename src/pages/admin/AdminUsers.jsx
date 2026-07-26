import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Edit2, Trash2, Shield, UserX, UserCheck } from 'lucide-react'

const USERNAME_DOMAIN = '@xogun.app'
const toEmail = u => u.trim().toLowerCase() + USERNAME_DOMAIN
const toUsername = email => email?.replace(USERNAME_DOMAIN, '') || ''

export default function AdminUsers() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [form, setForm] = useState({ username: '', display_name: '', password: '', is_admin: false, avatar_color: '#c8a96e' })
  const [saving, setSaving]   = useState(false)
  const [msg, setMsg]         = useState('')
  const [error, setError]     = useState('')

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').order('display_name')
    setUsers(data || []); setLoading(false)
  }

  function openCreate() { setEditUser(null); setForm({ username:'',display_name:'',password:'',is_admin:false,avatar_color:'#c8a96e' }); setError(''); setShowForm(true) }
  function openEdit(u)  { setEditUser(u); setForm({ username:toUsername(u.email),display_name:u.display_name||'',password:'',is_admin:u.is_admin||false,avatar_color:u.avatar_color||'#c8a96e' }); setError(''); setShowForm(true) }

  async function handleSave() {
    if (!form.username || (!editUser && !form.password)) { setError('Usuario e contrasinal son obrigatorios'); return }
    setSaving(true); setError('')
    const email = toEmail(form.username)
    const res = await fetch(editUser ? '/api/admin-update-user' : '/api/admin-create-user', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, email, userId: editUser?.id })
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Erro'); setSaving(false) }
    else { setMsg(editUser ? 'Usuario actualizado' : 'Usuario creado'); setShowForm(false); fetchUsers(); setTimeout(() => setMsg(''), 3000) }
    setSaving(false)
  }

  async function handleDelete(u) {
    if (!confirm(`Eliminar "${u.display_name || toUsername(u.email)}"?`)) return
    await fetch('/api/admin-delete-user', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ userId: u.id }) })
    setMsg('Usuario eliminado'); fetchUsers(); setTimeout(() => setMsg(''), 3000)
  }

  async function toggleActive(u) {
    await supabase.from('profiles').update({ is_active: !u.is_active }).eq('id', u.id)
    fetchUsers()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl text-xogun-accent">Usuarios</h2>
        <button onClick={openCreate} className="btn-primary flex items-center gap-1.5 text-xs"><Plus size={13} /> Novo usuario</button>
      </div>
      {msg && <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg px-4 py-2 text-sm mb-4">{msg}</div>}
      {loading ? <p className="text-xogun-muted text-sm">Cargando...</p> : (
        <div className="space-y-2">
          {users.map(u => (
            <div key={u.id} className="card flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-xogun-bg flex-shrink-0"
                style={{ backgroundColor: u.avatar_color || '#c8a96e' }}>
                {(u.display_name || toUsername(u.email) || '?')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{u.display_name || toUsername(u.email)}</p>
                <p className="text-xogun-muted text-xs">@{toUsername(u.email)} · {u.last_seen ? `Última conexión: ${new Date(u.last_seen).toLocaleDateString('gl')}` : 'Nunca conectado'}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {u.is_admin && <span className="badge border-xogun-accent/30 text-xogun-accent text-xs"><Shield size={10} className="inline mr-0.5" />Admin</span>}
                {!u.is_active && <span className="badge border-xogun-red/30 text-xogun-red text-xs">Inactivo</span>}
                <button onClick={() => toggleActive(u)} className="btn-ghost p-1.5" title={u.is_active ? 'Desactivar' : 'Activar'}>
                  {u.is_active ? <UserX size={13} /> : <UserCheck size={13} />}
                </button>
                <button onClick={() => openEdit(u)} className="btn-ghost p-1.5"><Edit2 size={13} /></button>
                <button onClick={() => handleDelete(u)} className="btn-ghost p-1.5 hover:text-xogun-red"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal max-w-md">
            <div className="modal-header">
              <h2 className="font-display text-lg text-xogun-accent">{editUser ? 'Editar usuario' : 'Novo usuario'}</h2>
              <button onClick={() => setShowForm(false)} className="text-xogun-muted hover:text-xogun-text text-xl">×</button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="label">Nome para mostrar</label>
                <input className="input" value={form.display_name} onChange={e => setForm(f=>({...f,display_name:e.target.value}))} placeholder="Nome do usuario" /></div>
              <div><label className="label">Nome de usuario *</label>
                <input className="input" type="text" value={form.username} onChange={e => setForm(f=>({...f,username:e.target.value.toLowerCase().replace(/\s/g,'')}))} placeholder="antonio" autoCapitalize="none" /></div>
              <div><label className="label">{editUser ? 'Novo contrasinal (baleiro = non cambiar)' : 'Contrasinal *'}</label>
                <input className="input" type="password" value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))} placeholder="••••••••" /></div>
              <div><label className="label">Cor do avatar</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.avatar_color} onChange={e => setForm(f=>({...f,avatar_color:e.target.value}))} className="w-10 h-10 rounded-lg border-2 border-xogun-border cursor-pointer p-0" />
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xogun-bg" style={{backgroundColor:form.avatar_color}}>
                    {(form.display_name||form.username||'?')[0]?.toUpperCase()}
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_admin} onChange={e => setForm(f=>({...f,is_admin:e.target.checked}))} className="accent-xogun-accent" />
                <span className="text-sm">Administrador</span>
              </label>
              {error && <p className="text-xogun-red text-sm">{error}</p>}
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">{saving ? 'Gardando...' : 'Gardar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

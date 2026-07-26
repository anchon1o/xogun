const { createClient } = require('@supabase/supabase-js')

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password, display_name, is_admin, avatar_color } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e contrasinal son obrigatorios' })
  }

  const admin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name }
  })

  if (error) {
    console.error('Create user error:', error)
    return res.status(400).json({ error: error.message })
  }

  const { error: profileError } = await admin.from('profiles').upsert({
    id: data.user.id,
    email,
    display_name: display_name || null,
    is_admin: is_admin || false,
    avatar_color: avatar_color || '#c8a96e'
  })

  if (profileError) {
    console.error('Profile error:', profileError)
    return res.status(400).json({ error: profileError.message })
  }

  return res.status(200).json({ success: true, userId: data.user.id })
}

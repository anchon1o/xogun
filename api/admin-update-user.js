const { createClient } = require('@supabase/supabase-js')

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { userId, email, password, display_name, is_admin, avatar_color } = req.body

  if (!userId) return res.status(400).json({ error: 'userId obrigatorio' })

  const admin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const authUpdates = { email }
  if (password) authUpdates.password = password

  const { error: authError } = await admin.auth.admin.updateUserById(userId, authUpdates)
  if (authError) {
    console.error('Auth update error:', authError)
    return res.status(400).json({ error: authError.message })
  }

  const { error: profileError } = await admin.from('profiles').update({
    email,
    display_name: display_name || null,
    is_admin: is_admin || false,
    avatar_color: avatar_color || '#c8a96e'
  }).eq('id', userId)

  if (profileError) {
    console.error('Profile update error:', profileError)
    return res.status(400).json({ error: profileError.message })
  }

  return res.status(200).json({ success: true })
}

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

function generateCode(len = 6) {
  let code = ''
  for (let i = 0; i < len; i++) code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  return code
}

// ── Crear partida ──────────────────────────────────────────────────────────────
export async function createWavelengthGame(userId) {
  let code = generateCode()
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: existing } = await supabase
      .from('wavelength_games')
      .select('id')
      .eq('code', code)
      .maybeSingle()
    if (!existing) break
    code = generateCode()
  }

  const { data: game, error } = await supabase
    .from('wavelength_games')
    .insert({ code, created_by: userId, status: 'waiting', round: 1 })
    .select()
    .single()

  if (error || !game) return { error }

  // O creador únese automaticamente como primeiro xogador
  const { error: playerError } = await supabase
    .from('wavelength_players')
    .insert({ game_id: game.id, user_id: userId })

  if (playerError) return { error: playerError }

  return { data: game }
}

// ── Hook principal ─────────────────────────────────────────────────────────────
export function useWavelengthGame(code, userId) {
  const [game, setGame]       = useState(null)
  const [players, setPlayers] = useState([])
  const [myGuess, setMyGuess] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [guess, setGuess]     = useState(50)
  const pollRef = useRef(null)

  const fetchAll = useCallback(async () => {
    if (!code) { setLoading(false); return }

    const { data: g } = await supabase
      .from('wavelength_games')
      .select('*')
      .eq('code', code.toUpperCase())
      .maybeSingle()

    if (!g) { setNotFound(true); setLoading(false); return }
    setNotFound(false)
    setGame(g)

    const { data: p } = await supabase
      .from('wavelength_players')
      .select('*, profiles(display_name)')
      .eq('game_id', g.id)
      .order('joined_at')
    setPlayers(p || [])

    // Buscar a adiviña propia desta rolda
    if (userId) {
      const { data: myG } = await supabase
        .from('wavelength_guesses')
        .select('position')
        .eq('game_id', g.id)
        .eq('user_id', userId)
        .eq('round', g.round)
        .maybeSingle()
      setMyGuess(myG?.position ?? null)
      if (myG?.position != null) setGuess(myG.position)
    }

    setLoading(false)
  }, [code, userId])

  // Unirse á partida se non se é xogador aínda
  useEffect(() => {
    if (!game || !userId) return
    const isPlayer = players.some(p => p.user_id === userId)
    if (!isPlayer) {
      supabase
        .from('wavelength_players')
        .insert({ game_id: game.id, user_id: userId })
        .then(() => fetchAll())
    }
  }, [game?.id, userId, players.length])

  useEffect(() => {
    fetchAll()
    pollRef.current = setInterval(fetchAll, 3000)
    return () => clearInterval(pollRef.current)
  }, [fetchAll])

  const myPlayer = players.find(p => p.user_id === userId) || null
  const isHost   = !!(game && userId && game.created_by === userId)
  const isPsychic = game?.psychic_id === userId

  // ── Accións ───────────────────────────────────────────────────────────────

  async function submitGuess() {
    if (!game || !userId) return { error: { message: 'Sen partida ou usuario' } }
    const { error } = await supabase
      .from('wavelength_guesses')
      .upsert(
        { game_id: game.id, user_id: userId, round: game.round, position: guess },
        { onConflict: 'game_id,user_id,round' }
      )
    if (!error) await fetchAll()
    return { error }
  }

  async function nextRound() {
    if (!game) return { error: { message: 'Sen partida' } }

    // Calcular o seguinte psíquico (rotación circular)
    const currentPsychicIdx = players.findIndex(p => p.user_id === game.psychic_id)
    const nextPsychicIdx    = (currentPsychicIdx + 1) % players.length
    const nextPsychicId     = players[nextPsychicIdx]?.user_id || game.created_by

    // Novo par de conceptos e obxectivo aleatorio
    const { data: secret } = await supabase
      .from('wavelength_secrets')
      .select('*')
      .order('id')
      .limit(100)

    const pool = secret || []
    const pick = pool[Math.floor(Math.random() * pool.length)]

    const { error } = await supabase
      .from('wavelength_games')
      .update({
        round: game.round + 1,
        status: 'guessing',
        psychic_id:    nextPsychicId,
        left_concept:  pick?.left_concept  || '❄️ Frío',
        right_concept: pick?.right_concept || '🔥 Quente',
        target:        Math.floor(Math.random() * 81) + 10, // 10-90
      })
      .eq('id', game.id)

    if (!error) await fetchAll()
    return { error }
  }

  async function startGame() {
    if (!game) return { error: { message: 'Sen partida' } }

    const { data: secret } = await supabase
      .from('wavelength_secrets')
      .select('*')
      .order('id')
      .limit(100)

    const pool = secret || []
    const pick = pool[Math.floor(Math.random() * pool.length)]

    const { error } = await supabase
      .from('wavelength_games')
      .update({
        status:        'guessing',
        psychic_id:    userId,
        left_concept:  pick?.left_concept  || '❄️ Frío',
        right_concept: pick?.right_concept || '🔥 Quente',
        target:        Math.floor(Math.random() * 81) + 10,
      })
      .eq('id', game.id)

    if (!error) await fetchAll()
    return { error }
  }

  async function showResults() {
    if (!game) return { error: { message: 'Sen partida' } }
    const { error } = await supabase
      .from('wavelength_games')
      .update({ status: 'results' })
      .eq('id', game.id)
    if (!error) await fetchAll()
    return { error }
  }

  async function deleteGame() {
    if (!game) return { error: { message: 'Sen partida' } }
    const { error } = await supabase
      .from('wavelength_games')
      .delete()
      .eq('id', game.id)
    return { error }
  }

  return {
    game, players, myPlayer, myGuess, isHost, isPsychic, loading, notFound,
    guess, setGuess,
    submitGuess, nextRound, startGame, showResults, deleteGame,
    refetch: fetchAll,
  }
}

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { notifyUser } from './useNotifications'

const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

function generateCode(len = 6) {
  let code = ''
  for (let i = 0; i < len; i++) code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  return code
}

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export async function createSocialGame(userId, { name, preset, playerNames, rolePool }) {
  let code = generateCode()
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: existing } = await supabase.from('social_games').select('id').eq('code', code).maybeSingle()
    if (!existing) break
    code = generateCode()
  }

  const { data: game, error: gameError } = await supabase
    .from('social_games')
    .insert({ code, name: name || null, preset, role_pool: rolePool, created_by: userId })
    .select().single()
  if (gameError || !game) return { error: gameError }

  const playerRows = playerNames.map((n, i) => ({ game_id: game.id, name: n, seat_order: i }))
  const { error: playersError } = await supabase.from('social_game_players').insert(playerRows)
  if (playersError) return { error: playersError }

  return { data: game }
}

export function useSocialGame(code, userId) {
  const [game, setGame] = useState(null)
  const [players, setPlayers] = useState([])
  const [myRole, setMyRole] = useState(null)
  const [myVote, setMyVote] = useState(null)
  const [tally, setTally] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const pollRef = useRef(null)

  const fetchAll = useCallback(async () => {
    if (!code) { setLoading(false); return }
    const { data: g } = await supabase.from('social_games').select('*').eq('code', code.toUpperCase()).maybeSingle()
    if (!g) { setNotFound(true); setLoading(false); return }
    setNotFound(false)
    setGame(g)

    const { data: p } = await supabase
      .from('social_game_players')
      .select('*, profiles!claimed_by(display_name, avatar_id, avatar_color)')
      .eq('game_id', g.id)
      .order('seat_order')
    setPlayers(p || [])

    const mine = (p || []).find(x => x.claimed_by === userId)
    if (mine && g.status === 'dealt') {
      const { data: roleRow } = await supabase
        .from('social_game_roles')
        .select('role_name')
        .eq('player_id', mine.id)
        .maybeSingle()
      setMyRole(roleRow?.role_name || null)
    } else {
      setMyRole(null)
    }

    if (mine && g.voting_round > 0) {
      const { data: voteRow } = await supabase
        .from('social_game_votes')
        .select('target_player_id')
        .eq('game_id', g.id).eq('voter_player_id', mine.id).eq('round', g.voting_round)
        .maybeSingle()
      setMyVote(voteRow?.target_player_id ?? null)
    } else {
      setMyVote(null)
    }

    if (g.voting_round > 0) {
      const { data: tallyRows } = await supabase.rpc('social_vote_tally', { p_game_id: g.id, p_round: g.voting_round })
      setTally(tallyRows || [])
    } else {
      setTally([])
    }

    setLoading(false)
  }, [code, userId])

  useEffect(() => {
    fetchAll()
    pollRef.current = setInterval(fetchAll, 3000)
    return () => clearInterval(pollRef.current)
  }, [fetchAll])

  const myPlayer = players.find(p => p.claimed_by === userId) || null
  const isHost = !!(game && userId && game.created_by === userId)

  async function claimSlot(playerId) {
    const { data, error } = await supabase
      .from('social_game_players')
      .update({ claimed_by: userId })
      .eq('id', playerId)
      .is('claimed_by', null)
      .select().maybeSingle()
    if (!error) await fetchAll()
    if (!data && !error) return { error: { message: 'Esa praza xa foi reclamada por outra persoa' } }
    return { error }
  }

  async function addSlot(name) {
    if (!game) return { error: { message: 'Sen partida' } }
    const { error } = await supabase
      .from('social_game_players')
      .insert({ game_id: game.id, name, seat_order: players.length })
    if (!error) await fetchAll()
    return { error }
  }

  async function removeSlot(playerId) {
    const { error } = await supabase.from('social_game_players').delete().eq('id', playerId)
    if (!error) await fetchAll()
    return { error }
  }

  async function toggleEliminated(playerId, current) {
    const { error } = await supabase.from('social_game_players').update({ eliminated: !current }).eq('id', playerId)
    if (!error) await fetchAll()
    return { error }
  }

  async function dealRoles(rolePool) {
    if (!game) return { error: { message: 'Sen partida' } }
    if (rolePool.length !== players.length) {
      return { error: { message: `O número de roles (${rolePool.length}) non coincide co de xogadores (${players.length})` } }
    }
    await supabase.from('social_game_roles').delete().eq('game_id', game.id)

    const shuffled = shuffle(rolePool)
    const rows = players.map((p, i) => ({ game_id: game.id, player_id: p.id, role_name: shuffled[i] }))
    const { error: rolesError } = await supabase.from('social_game_roles').insert(rows)
    if (rolesError) return { error: rolesError }

    const { error: statusError } = await supabase
      .from('social_games').update({ status: 'dealt', role_pool: rolePool }).eq('id', game.id)
    if (statusError) return { error: statusError }

    players.filter(p => p.claimed_by).forEach(p => {
      notifyUser(p.claimed_by, {
        type: 'social_game',
        title: 'Xa tes o teu rol!',
        body: `${game.name || 'A partida'} repartiu os roles — mira o teu en privado`,
        link: `/social/${game.code}`,
      })
    })

    await fetchAll()
    return { error: null }
  }

  async function resetToLobby() {
    if (!game) return { error: { message: 'Sen partida' } }
    await supabase.from('social_game_roles').delete().eq('game_id', game.id)
    const { error } = await supabase.from('social_games').update({ status: 'lobby', phase: 'none', phase_ends_at: null }).eq('id', game.id)
    if (!error) await fetchAll()
    return { error }
  }

  async function deleteGame() {
    if (!game) return { error: { message: 'Sen partida' } }
    const { error } = await supabase.from('social_games').delete().eq('id', game.id)
    return { error }
  }

  // ── Fases (día/noite) e temporizador compartido ──
  async function startPhase(phase, durationSeconds) {
    if (!game) return { error: { message: 'Sen partida' } }
    const endsAt = durationSeconds ? new Date(Date.now() + durationSeconds * 1000).toISOString() : null
    const { error } = await supabase
      .from('social_games')
      .update({ phase, phase_ends_at: endsAt })
      .eq('id', game.id)
    if (!error) await fetchAll()
    return { error }
  }

  async function clearPhase() {
    return startPhase('none', null)
  }

  // ── Votación secreta ──
  async function openVoting(durationSeconds) {
    if (!game) return { error: { message: 'Sen partida' } }
    const nextRound = (game.voting_round || 0) + 1
    const endsAt = durationSeconds ? new Date(Date.now() + durationSeconds * 1000).toISOString() : null
    const { error } = await supabase
      .from('social_games')
      .update({ voting_round: nextRound, phase: 'voting', phase_ends_at: endsAt })
      .eq('id', game.id)
    if (!error) {
      players.filter(p => p.claimed_by && !p.eliminated).forEach(p => {
        notifyUser(p.claimed_by, {
          type: 'social_game',
          title: 'Votación aberta!',
          body: `${game.name || 'A partida'} abriu unha votación — vota dende o teu móbil`,
          link: `/social/${game.code}`,
        })
      })
      await fetchAll()
    }
    return { error }
  }

  async function castVote(targetPlayerId) {
    if (!game) return { error: { message: 'Sen partida' } }
    const mine = players.find(p => p.claimed_by === userId)
    if (!mine) return { error: { message: 'Non tes praza nesta partida' } }
    const { error } = await supabase
      .from('social_game_votes')
      .upsert(
        { game_id: game.id, voter_player_id: mine.id, target_player_id: targetPlayerId, round: game.voting_round },
        { onConflict: 'game_id,voter_player_id,round' }
      )
    if (!error) await fetchAll()
    return { error }
  }

  async function closeVoting() {
    return startPhase('results', null)
  }

  return {
    game, players, myPlayer, myRole, myVote, tally, isHost, loading, notFound,
    claimSlot, addSlot, removeSlot, toggleEliminated, dealRoles, resetToLobby, deleteGame,
    startPhase, clearPhase, openVoting, castVote, closeVoting,
    refetch: fetchAll,
  }
}

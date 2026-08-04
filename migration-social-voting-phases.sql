-- ============================================================
-- XOGÚN — Migración: fases de xogo, temporizador e votación secreta
-- para os xogos sociais (Lobo, Mafia...)
-- ============================================================

ALTER TABLE social_games ADD COLUMN IF NOT EXISTS phase TEXT DEFAULT 'none';
ALTER TABLE social_games ADD COLUMN IF NOT EXISTS phase_ends_at TIMESTAMPTZ;
ALTER TABLE social_games ADD COLUMN IF NOT EXISTS voting_round INT DEFAULT 0;

CREATE TABLE IF NOT EXISTS social_game_votes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id           UUID NOT NULL REFERENCES social_games(id) ON DELETE CASCADE,
  voter_player_id   UUID NOT NULL REFERENCES social_game_players(id) ON DELETE CASCADE,
  target_player_id  UUID REFERENCES social_game_players(id) ON DELETE CASCADE,
  round             INT NOT NULL DEFAULT 1,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (game_id, voter_player_id, round)
);

ALTER TABLE social_game_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ver só o propio voto ou anfitrión ve todos" ON social_game_votes;
CREATE POLICY "ver só o propio voto ou anfitrión ve todos"
  ON social_game_votes FOR SELECT USING (
    EXISTS (SELECT 1 FROM social_game_players p WHERE p.id = voter_player_id AND p.claimed_by = auth.uid())
    OR EXISTS (SELECT 1 FROM social_games g WHERE g.id = game_id AND g.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "votar como un mesmo" ON social_game_votes;
CREATE POLICY "votar como un mesmo"
  ON social_game_votes FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM social_game_players p WHERE p.id = voter_player_id AND p.claimed_by = auth.uid())
  );

DROP POLICY IF EXISTS "cambiar o propio voto" ON social_game_votes;
CREATE POLICY "cambiar o propio voto"
  ON social_game_votes FOR UPDATE USING (
    EXISTS (SELECT 1 FROM social_game_players p WHERE p.id = voter_player_id AND p.claimed_by = auth.uid())
  );

DROP POLICY IF EXISTS "anfitrión limpa votos ao abrir nova rolda" ON social_game_votes;
CREATE POLICY "anfitrión limpa votos ao abrir nova rolda"
  ON social_game_votes FOR DELETE USING (
    EXISTS (SELECT 1 FROM social_games g WHERE g.id = game_id AND g.created_by = auth.uid())
  );

CREATE INDEX IF NOT EXISTS social_game_votes_game ON social_game_votes(game_id, round);

CREATE OR REPLACE FUNCTION social_vote_tally(p_game_id UUID, p_round INT)
RETURNS TABLE(target_player_id UUID, votes BIGINT)
LANGUAGE sql SECURITY DEFINER
SET search_path = public
AS $$
  SELECT target_player_id, COUNT(*) AS votes
  FROM social_game_votes
  WHERE game_id = p_game_id AND round = p_round AND target_player_id IS NOT NULL
  GROUP BY target_player_id
  ORDER BY votes DESC;
$$;

GRANT EXECUTE ON FUNCTION social_vote_tally(UUID, INT) TO authenticated;

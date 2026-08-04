-- ============================================================
-- XOGÚN — Migración: Xogos sociais multidispositivo (Lobo, Mafia...)
-- ============================================================

CREATE TABLE IF NOT EXISTS social_games (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT UNIQUE NOT NULL,
  name        TEXT,
  preset      TEXT DEFAULT 'custom',
  role_pool   JSONB NOT NULL DEFAULT '[]',
  status      TEXT DEFAULT 'lobby',
  created_by  UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE social_games ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "calquera autenticado busca partidas por código" ON social_games;
CREATE POLICY "calquera autenticado busca partidas por código"
  ON social_games FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "crear partida propia" ON social_games;
CREATE POLICY "crear partida propia"
  ON social_games FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "anfitrión actualiza a súa partida" ON social_games;
CREATE POLICY "anfitrión actualiza a súa partida"
  ON social_games FOR UPDATE USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "anfitrión elimina a súa partida" ON social_games;
CREATE POLICY "anfitrión elimina a súa partida"
  ON social_games FOR DELETE USING (auth.uid() = created_by);

CREATE INDEX IF NOT EXISTS social_games_code ON social_games(code);


CREATE TABLE IF NOT EXISTS social_game_players (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id     UUID NOT NULL REFERENCES social_games(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  claimed_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  eliminated  BOOLEAN DEFAULT false,
  seat_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE social_game_players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ver prazas de xogadores" ON social_game_players;
CREATE POLICY "ver prazas de xogadores"
  ON social_game_players FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "anfitrión crea prazas" ON social_game_players;
CREATE POLICY "anfitrión crea prazas"
  ON social_game_players FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM social_games g WHERE g.id = game_id AND g.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "reclamar praza libre ou anfitrión xestiona" ON social_game_players;
CREATE POLICY "reclamar praza libre ou anfitrión xestiona"
  ON social_game_players FOR UPDATE USING (
    claimed_by IS NULL OR claimed_by = auth.uid() OR
    EXISTS (SELECT 1 FROM social_games g WHERE g.id = game_id AND g.created_by = auth.uid())
  ) WITH CHECK (
    claimed_by = auth.uid() OR claimed_by IS NULL OR
    EXISTS (SELECT 1 FROM social_games g WHERE g.id = game_id AND g.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "anfitrión elimina prazas" ON social_game_players;
CREATE POLICY "anfitrión elimina prazas"
  ON social_game_players FOR DELETE USING (
    EXISTS (SELECT 1 FROM social_games g WHERE g.id = game_id AND g.created_by = auth.uid())
  );

DROP INDEX IF EXISTS social_players_one_slot;
CREATE UNIQUE INDEX social_players_one_slot ON social_game_players(game_id, claimed_by) WHERE claimed_by IS NOT NULL;
CREATE INDEX IF NOT EXISTS social_game_players_game ON social_game_players(game_id);


CREATE TABLE IF NOT EXISTS social_game_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id     UUID NOT NULL REFERENCES social_games(id) ON DELETE CASCADE,
  player_id   UUID NOT NULL UNIQUE REFERENCES social_game_players(id) ON DELETE CASCADE,
  role_name   TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE social_game_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "só o propio xogador ve o seu rol" ON social_game_roles;
CREATE POLICY "só o propio xogador ve o seu rol"
  ON social_game_roles FOR SELECT USING (
    EXISTS (SELECT 1 FROM social_game_players p WHERE p.id = player_id AND p.claimed_by = auth.uid())
  );

DROP POLICY IF EXISTS "anfitrión crea roles ao repartir" ON social_game_roles;
CREATE POLICY "anfitrión crea roles ao repartir"
  ON social_game_roles FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM social_games g WHERE g.id = game_id AND g.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "anfitrión pode repartir de novo" ON social_game_roles;
CREATE POLICY "anfitrión pode repartir de novo"
  ON social_game_roles FOR DELETE USING (
    EXISTS (SELECT 1 FROM social_games g WHERE g.id = game_id AND g.created_by = auth.uid())
  );

CREATE INDEX IF NOT EXISTS social_game_roles_game ON social_game_roles(game_id);

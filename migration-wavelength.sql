-- ============================================================
-- XŌGUN — Migración: Escala (xogo estilo Wavelength)
-- Executar en Supabase Dashboard → SQL Editor
-- Seguro de executar varias veces (idempotente)
-- ============================================================

-- ── 1. Partidas de Escala ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wavelength_games (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code          TEXT UNIQUE NOT NULL,
  status        TEXT DEFAULT 'waiting',   -- 'waiting' | 'guessing' | 'results'
  round         INT DEFAULT 1,
  psychic_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  left_concept  TEXT,
  right_concept TEXT,
  target        INT,                       -- posición secreta 0-100 (só visible á psíquica)
  created_by    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE wavelength_games ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "calquera autenticado busca partidas de escala por código" ON wavelength_games;
CREATE POLICY "calquera autenticado busca partidas de escala por código"
  ON wavelength_games FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "crear partida de escala propia" ON wavelength_games;
CREATE POLICY "crear partida de escala propia"
  ON wavelength_games FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "anfitrión actualiza a partida de escala" ON wavelength_games;
CREATE POLICY "anfitrión actualiza a partida de escala"
  ON wavelength_games FOR UPDATE USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "anfitrión elimina a partida de escala" ON wavelength_games;
CREATE POLICY "anfitrión elimina a partida de escala"
  ON wavelength_games FOR DELETE USING (auth.uid() = created_by);

CREATE INDEX IF NOT EXISTS wavelength_games_code ON wavelength_games(code);


-- ── 2. Xogadores nunha partida de Escala ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS wavelength_players (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id    UUID NOT NULL REFERENCES wavelength_games(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (game_id, user_id)
);

ALTER TABLE wavelength_players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ver xogadores de escala" ON wavelength_players;
CREATE POLICY "ver xogadores de escala"
  ON wavelength_players FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "unirse a partida de escala" ON wavelength_players;
CREATE POLICY "unirse a partida de escala"
  ON wavelength_players FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "saír de partida de escala" ON wavelength_players;
CREATE POLICY "saír de partida de escala"
  ON wavelength_players FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS wavelength_players_game ON wavelength_players(game_id);


-- ── 3. Adiviñas de cada xogador por rolda ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS wavelength_guesses (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id    UUID NOT NULL REFERENCES wavelength_games(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  round      INT NOT NULL,
  position   INT NOT NULL CHECK (position >= 0 AND position <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (game_id, user_id, round)
);

ALTER TABLE wavelength_guesses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ver adiviñas da propia partida" ON wavelength_guesses;
CREATE POLICY "ver adiviñas da propia partida"
  ON wavelength_guesses FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "rexistrar a propia adiviña" ON wavelength_guesses;
CREATE POLICY "rexistrar a propia adiviña"
  ON wavelength_guesses FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "modificar a propia adiviña" ON wavelength_guesses;
CREATE POLICY "modificar a propia adiviña"
  ON wavelength_guesses FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS wavelength_guesses_game ON wavelength_guesses(game_id, round);


-- ── 4. Biblioteca de pares de conceptos ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS wavelength_secrets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  left_concept  TEXT NOT NULL,
  right_concept TEXT NOT NULL
);

-- RLS desactivado: lectura pública (como game_categories e game_mechanics)
ALTER TABLE wavelength_secrets DISABLE ROW LEVEL SECURITY;

-- Inserir pares de conceptos base se a táboa está baleira
INSERT INTO wavelength_secrets (left_concept, right_concept)
SELECT * FROM (VALUES
  ('❄️ Frío', '🔥 Quente'),
  ('🐌 Lento', '🚀 Rápido'),
  ('🤫 Silencioso', '📢 Ruidoso'),
  ('😢 Triste', '😂 Alegre'),
  ('🌚 Escuro', '☀️ Brillante'),
  ('🧊 Seco', '🌊 Mollado'),
  ('🐣 Novo', '👴 Vello'),
  ('💤 Aburrido', '🎉 Emocionante'),
  ('🤏 Pequeno', '🐘 Grande'),
  ('😇 Inocente', '😈 Malvado'),
  ('🪨 Duro', '🧸 Brando'),
  ('🌿 Natural', '🏭 Artificial'),
  ('😰 Estresante', '🧘 Relaxante'),
  ('💸 Caro', '🪙 Barato'),
  ('🤓 Complicado', '🍼 Simple'),
  ('🧂 Salgado', '🍬 Doce'),
  ('🎲 Aleatorio', '🧮 Estratéxico'),
  ('🦁 Salvaxe', '🐩 Doméstico'),
  ('🌍 Global', '🏡 Local'),
  ('⚡ Moderno', '🏛️ Clásico')
) AS t(left_concept, right_concept)
WHERE NOT EXISTS (SELECT 1 FROM wavelength_secrets LIMIT 1);


-- ── 5. Activar o launcher en app_config ───────────────────────────────────────
UPDATE app_config
SET value = value || '{"wavelength_launcher": true}'::jsonb
WHERE key = 'tools_enabled';

-- ============================================================
-- XOGÚN — MIGRACIÓN CONSOLIDADA
-- ============================================================
-- Este ficheiro unifica TODAS as migracións incrementais nun só
-- script. É seguro executalo enteiro sobre unha base de datos que
-- xa teña algunhas (ou todas) destas migracións aplicadas — cada
-- sentenza usa IF NOT EXISTS / DROP...IF EXISTS, así que repetir
-- a execución non causa erros nin duplica datos.
--
-- Ordena internamente as oito migracións incrementais que se foron
-- creando ao longo do desenvolvemento, na orde correcta de
-- dependencias entre táboas.
--
-- Non substitúe a supabase-schema.sql (que representa unha
-- instalación completa desde cero) — este ficheiro é para aplicar
-- sobre unha base de datos xa existente.
-- ============================================================


-- ─────────────────────────────────────────────────────────
-- Orixe: migration-visibility-lists.sql
-- ─────────────────────────────────────────────────────────

-- ============================================================
-- XOGÚN — Migración: visibilidade por estado + listas personalizadas
-- Executar despois do schema base (supabase-schema.sql)
-- Non borra datos existentes en games/user_games/profiles
-- ============================================================

-- ── 1. Visibilidade por entrada de colección (non global no perfil) ──
ALTER TABLE user_games
  ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'friends';  -- 'private'|'friends'|'public'

-- Migrar o valor que tiña cada usuario no seu perfil á súa colección existente,
-- para que ninguén perda a configuración que xa tiña.
UPDATE user_games ug
SET visibility = p.collection_visibility
FROM profiles p
WHERE ug.user_id = p.id AND ug.visibility IS NULL;

-- Actualizar a política de SELECT para usar a visibilidade por entrada
DROP POLICY IF EXISTS "ver coleccións segundo visibilidade" ON user_games;
DROP POLICY IF EXISTS "ver entradas segundo a súa propia visibilidade" ON user_games;
CREATE POLICY "ver entradas segundo a súa propia visibilidade"
  ON user_games FOR SELECT USING (
    auth.uid() = user_id OR
    visibility = 'public' OR
    (visibility = 'friends' AND EXISTS (
      SELECT 1 FROM friendships f WHERE f.status = 'accepted' AND
      ((f.requester = auth.uid() AND f.addressee = user_id) OR
       (f.addressee = auth.uid() AND f.requester = user_id))
    ))
  );

-- O perfil mantén collection_visibility só como VALOR POR DEFECTO
-- para novas entradas (non como regra de visibilidade real xa).
COMMENT ON COLUMN profiles.collection_visibility IS
  'Valor por defecto aplicado a novas entradas de user_games.visibility. Xa non controla a visibilidade directamente — ver user_games.visibility.';


-- ── 2. Listas personalizadas (ex: "Excursión agosto", "Noite de party") ──
CREATE TABLE IF NOT EXISTS game_lists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  emoji       TEXT DEFAULT '📋',
  visibility  TEXT DEFAULT 'private',  -- 'private'|'friends'|'public'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE game_lists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ver listas segundo visibilidade" ON game_lists;
CREATE POLICY "ver listas segundo visibilidade"
  ON game_lists FOR SELECT USING (
    auth.uid() = user_id OR
    visibility = 'public' OR
    (visibility = 'friends' AND EXISTS (
      SELECT 1 FROM friendships f WHERE f.status = 'accepted' AND
      ((f.requester = auth.uid() AND f.addressee = user_id) OR
       (f.addressee = auth.uid() AND f.requester = user_id))
    ))
  );

DROP POLICY IF EXISTS "usuario xestiona as súas listas" ON game_lists;
CREATE POLICY "usuario xestiona as súas listas"
  ON game_lists FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS game_lists_user ON game_lists(user_id);


-- ── 3. Elementos de cada lista (só referencias, sen duplicar datos) ──
CREATE TABLE IF NOT EXISTS game_list_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id    UUID NOT NULL REFERENCES game_lists(id) ON DELETE CASCADE,
  game_id    UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  note       TEXT,           -- nota opcional específica desta lista (ex: "levar eu")
  sort_order INT DEFAULT 0,
  added_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (list_id, game_id)
);

ALTER TABLE game_list_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ver elementos coa lista" ON game_list_items;
CREATE POLICY "ver elementos coa lista"
  ON game_list_items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM game_lists l WHERE l.id = list_id AND (
        l.user_id = auth.uid() OR
        l.visibility = 'public' OR
        (l.visibility = 'friends' AND EXISTS (
          SELECT 1 FROM friendships f WHERE f.status = 'accepted' AND
          ((f.requester = auth.uid() AND f.addressee = l.user_id) OR
           (f.addressee = auth.uid() AND f.requester = l.user_id))
        ))
      )
    )
  );

DROP POLICY IF EXISTS "propietario da lista xestiona elementos" ON game_list_items;
CREATE POLICY "propietario da lista xestiona elementos"
  ON game_list_items FOR ALL USING (
    EXISTS (SELECT 1 FROM game_lists l WHERE l.id = list_id AND l.user_id = auth.uid())
  );

CREATE INDEX IF NOT EXISTS list_items_list ON game_list_items(list_id);
CREATE INDEX IF NOT EXISTS list_items_game ON game_list_items(game_id);


-- ─────────────────────────────────────────────────────────
-- Orixe: migration-notifications.sql
-- ─────────────────────────────────────────────────────────

-- ============================================================
-- XOGÚN — Migración: sistema de notificacións internas
-- Executar sobre unha base de datos xa existente (non borra nada)
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT,
  link       TEXT,
  read       BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "usuario ve as súas notificacións" ON notifications;
CREATE POLICY "usuario ve as súas notificacións"
  ON notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "usuario xestiona as súas notificacións" ON notifications;
CREATE POLICY "usuario xestiona as súas notificacións"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "usuario elimina as súas notificacións" ON notifications;
CREATE POLICY "usuario elimina as súas notificacións"
  ON notifications FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "sistema crea notificacións" ON notifications;
CREATE POLICY "sistema crea notificacións"
  ON notifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE INDEX IF NOT EXISTS notifications_user ON notifications(user_id, read);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT true;


-- ─────────────────────────────────────────────────────────
-- Orixe: migration-playlists-multisource.sql
-- ─────────────────────────────────────────────────────────

-- ============================================================
-- XOGÚN — Migración: playlists multi-fonte (Spotify, embeds)
-- Executar sobre unha base de datos xa existente
-- ============================================================

ALTER TABLE playlists ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'youtube';
ALTER TABLE playlists ADD COLUMN IF NOT EXISTS embed_url TEXT;


-- ─────────────────────────────────────────────────────────
-- Orixe: migration-soundboard.sql
-- ─────────────────────────────────────────────────────────

-- ============================================================
-- XOGÚN — Migración: activar ferramenta "Botonera de sons"
-- ============================================================

UPDATE app_config
SET value = value || '{"soundboard": true}'::jsonb
WHERE key = 'tools_enabled';


-- ─────────────────────────────────────────────────────────
-- Orixe: migration-challenges.sql
-- ─────────────────────────────────────────────────────────

-- ============================================================
-- XOGÚN — Migración: retos entre amigos
-- ============================================================

CREATE TABLE IF NOT EXISTS challenges (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  to_user      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id      UUID REFERENCES games(id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  deadline     DATE,
  status       TEXT DEFAULT 'pending',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  resolved_at  TIMESTAMPTZ
);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ver os meus retos" ON challenges;
CREATE POLICY "ver os meus retos"
  ON challenges FOR SELECT USING (auth.uid() = from_user OR auth.uid() = to_user);

DROP POLICY IF EXISTS "crear retos" ON challenges;
CREATE POLICY "crear retos"
  ON challenges FOR INSERT WITH CHECK (auth.uid() = from_user);

DROP POLICY IF EXISTS "xestionar os meus retos" ON challenges;
CREATE POLICY "xestionar os meus retos"
  ON challenges FOR UPDATE USING (auth.uid() = from_user OR auth.uid() = to_user);

DROP POLICY IF EXISTS "eliminar retos propios" ON challenges;
CREATE POLICY "eliminar retos propios"
  ON challenges FOR DELETE USING (auth.uid() = from_user);

CREATE INDEX IF NOT EXISTS challenges_from ON challenges(from_user);
CREATE INDEX IF NOT EXISTS challenges_to   ON challenges(to_user);


-- ─────────────────────────────────────────────────────────
-- Orixe: migration-session-invites.sql
-- ─────────────────────────────────────────────────────────

-- ============================================================
-- XOGÚN — Migración: invitacións a sesións (calendario + RSVP)
-- ============================================================

CREATE TABLE IF NOT EXISTS session_invites (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id   UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rsvp       TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (match_id, user_id)
);

ALTER TABLE session_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ver invitacións propias ou da partida creada" ON session_invites;
CREATE POLICY "ver invitacións propias ou da partida creada"
  ON session_invites FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM matches m WHERE m.id = match_id AND m.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "creador da partida invita" ON session_invites;
CREATE POLICY "creador da partida invita"
  ON session_invites FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM matches m WHERE m.id = match_id AND m.created_by = auth.uid())
  );

DROP POLICY IF EXISTS "usuario actualiza o seu propio rsvp" ON session_invites;
CREATE POLICY "usuario actualiza o seu propio rsvp"
  ON session_invites FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "creador elimina invitacións" ON session_invites;
CREATE POLICY "creador elimina invitacións"
  ON session_invites FOR DELETE USING (
    EXISTS (SELECT 1 FROM matches m WHERE m.id = match_id AND m.created_by = auth.uid())
  );

CREATE INDEX IF NOT EXISTS session_invites_match ON session_invites(match_id);
CREATE INDEX IF NOT EXISTS session_invites_user  ON session_invites(user_id);


-- ─────────────────────────────────────────────────────────
-- Orixe: migration-activity-maintenance.sql
-- ─────────────────────────────────────────────────────────

-- ============================================================
-- XOGÚN — Migración: rexistro de actividade + modo mantemento
-- ============================================================

INSERT INTO app_config (key, value)
VALUES ('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS activity_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  target_type TEXT,
  target_name TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "só admins ven o rexistro" ON activity_log;
CREATE POLICY "só admins ven o rexistro"
  ON activity_log FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

DROP POLICY IF EXISTS "admins escriben no rexistro" ON activity_log;
CREATE POLICY "admins escriben no rexistro"
  ON activity_log FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE INDEX IF NOT EXISTS activity_log_created ON activity_log(created_at DESC);


-- ─────────────────────────────────────────────────────────
-- Orixe: migration-character-sheets.sql
-- ─────────────────────────────────────────────────────────

-- ============================================================
-- XOGÚN — Migración: follas de personaxe de rol
-- ============================================================

UPDATE app_config
SET value = value || '{"character_sheet": true}'::jsonb
WHERE key = 'tools_enabled';

CREATE TABLE IF NOT EXISTS character_sheet_templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id     UUID REFERENCES games(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  theme       TEXT DEFAULT 'fantasy',
  config      JSONB NOT NULL,
  created_by  UUID REFERENCES profiles(id),
  approved    BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE character_sheet_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "plantillas de personaxe aprobadas visibles" ON character_sheet_templates;
CREATE POLICY "plantillas de personaxe aprobadas visibles"
  ON character_sheet_templates FOR SELECT USING (approved = true OR auth.uid() = created_by);

DROP POLICY IF EXISTS "usuarios crean plantillas de personaxe" ON character_sheet_templates;
CREATE POLICY "usuarios crean plantillas de personaxe"
  ON character_sheet_templates FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "creador/admin xestiona plantillas de personaxe" ON character_sheet_templates;
CREATE POLICY "creador/admin xestiona plantillas de personaxe"
  ON character_sheet_templates FOR UPDATE USING (
    auth.uid() = created_by OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

DROP POLICY IF EXISTS "creador/admin elimina plantillas de personaxe" ON character_sheet_templates;
CREATE POLICY "creador/admin elimina plantillas de personaxe"
  ON character_sheet_templates FOR DELETE USING (
    auth.uid() = created_by OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE TABLE IF NOT EXISTS characters (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id  UUID REFERENCES character_sheet_templates(id) ON DELETE SET NULL,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  avatar_url   TEXT,
  data         JSONB DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "usuario xestiona os seus personaxes" ON characters;
CREATE POLICY "usuario xestiona os seus personaxes"
  ON characters FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS characters_user ON characters(user_id);


-- ─────────────────────────────────────────────────────────
-- Orixe: migration-social-games.sql
-- ─────────────────────────────────────────────────────────

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
-- ─────────────────────────────────────────────────────────
-- Orixe: migration-social-voting-phases.sql
-- ─────────────────────────────────────────────────────────

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
-- ─────────────────────────────────────────────────────────
-- Orixe: migration-social-launcher-toggle.sql
-- ─────────────────────────────────────────────────────────

-- ============================================================
-- XOGÚN — Migración: activar acceso rápido "Xogo social" en Ferramentas
-- ============================================================

UPDATE app_config
SET value = value || '{"social_game_launcher": true}'::jsonb
WHERE key = 'tools_enabled';

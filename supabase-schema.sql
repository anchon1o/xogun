-- ============================================================
-- XOGÚN — Schema SQL completo v3
-- Executar no SQL Editor de Supabase
-- BORRA TODO O ANTERIOR — executar en orde
-- ============================================================

-- ── LIMPEZA ─────────────────────────────────────────────────
DROP TABLE IF EXISTS playlist_tracks        CASCADE;
DROP TABLE IF EXISTS playlists              CASCADE;
DROP TABLE IF EXISTS game_edit_suggestions  CASCADE;
DROP TABLE IF EXISTS match_players          CASCADE;
DROP TABLE IF EXISTS matches                CASCADE;
DROP TABLE IF EXISTS score_templates        CASCADE;
DROP TABLE IF EXISTS user_games             CASCADE;
DROP TABLE IF EXISTS friendships            CASCADE;
DROP TABLE IF EXISTS games                  CASCADE;
DROP TABLE IF EXISTS game_mechanics         CASCADE;
DROP TABLE IF EXISTS game_categories        CASCADE;
DROP TABLE IF EXISTS avatars                CASCADE;
DROP TABLE IF EXISTS app_config             CASCADE;
DROP TABLE IF EXISTS profiles               CASCADE;
DROP FUNCTION IF EXISTS handle_new_user     CASCADE;
DROP FUNCTION IF EXISTS xogun_avg_rating    CASCADE;

-- ── 1. AVATARES PREDEFINIDOS ─────────────────────────────────
CREATE TABLE avatars (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  svg        TEXT NOT NULL,
  active     BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0
);

ALTER TABLE avatars DISABLE ROW LEVEL SECURITY;

-- Set de avatares temáticos de xogos de mesa
INSERT INTO avatars (name, svg, sort_order) VALUES
('Meeple',    '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="20" r="15" fill="currentColor"/><path d="M25 45 Q20 35 30 30 Q40 25 50 35 Q60 25 70 30 Q80 35 75 45 L65 80 Q62 90 50 90 Q38 90 35 80 Z" fill="currentColor"/></svg>', 1),
('Dado',      '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="80" height="80" rx="15" fill="currentColor"/><circle cx="30" cy="30" r="7" fill="white"/><circle cx="70" cy="30" r="7" fill="white"/><circle cx="50" cy="50" r="7" fill="white"/><circle cx="30" cy="70" r="7" fill="white"/><circle cx="70" cy="70" r="7" fill="white"/></svg>', 2),
('Coroa',     '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M10 70 L10 40 L30 60 L50 20 L70 60 L90 40 L90 70 Z" fill="currentColor"/><rect x="10" y="70" width="80" height="15" rx="5" fill="currentColor"/></svg>', 3),
('Torre',     '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="25" y="40" width="50" height="55" fill="currentColor"/><rect x="20" y="20" width="15" height="25" fill="currentColor"/><rect x="42" y="20" width="15" height="25" fill="currentColor"/><rect x="65" y="20" width="15" height="25" fill="currentColor"/><rect x="35" y="65" width="30" height="30" fill="white" opacity="0.3"/></svg>', 4),
('Espada',    '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 10 L58 45 L90 50 L58 55 L50 90 L42 55 L10 50 L42 45 Z" fill="currentColor"/></svg>', 5),
('Hexágono',  '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5" fill="currentColor"/></svg>', 6),
('Carta',     '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="10" width="70" height="90" rx="8" fill="currentColor"/><rect x="25" y="20" width="50" height="70" rx="4" fill="white" opacity="0.2"/><text x="50" y="62" text-anchor="middle" font-size="36" fill="white">♠</text></svg>', 7),
('Peón',      '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="25" r="18" fill="currentColor"/><ellipse cx="50" cy="60" rx="20" ry="25" fill="currentColor"/><ellipse cx="50" cy="88" rx="30" ry="10" fill="currentColor"/></svg>', 8),
('Dragón',    '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 15 C30 15 15 30 15 50 C15 65 25 78 40 83 L35 95 L50 85 L65 95 L60 83 C75 78 85 65 85 50 C85 30 70 15 50 15Z" fill="currentColor"/><circle cx="38" cy="45" r="6" fill="white"/><circle cx="62" cy="45" r="6" fill="white"/><circle cx="40" cy="46" r="3" fill="black"/><circle cx="64" cy="46" r="3" fill="black"/></svg>', 9),
('Escudo',    '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 5 L90 20 L90 55 C90 75 70 90 50 95 C30 90 10 75 10 55 L10 20 Z" fill="currentColor"/></svg>', 10),
('Fantasma',  '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M20 90 L20 45 C20 25 35 10 50 10 C65 10 80 25 80 45 L80 90 L68 80 L56 90 L44 80 L32 90 Z" fill="currentColor"/><circle cx="38" cy="45" r="7" fill="white"/><circle cx="62" cy="45" r="7" fill="white"/></svg>', 11),
('Robot',     '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="25" y="30" width="50" height="45" rx="8" fill="currentColor"/><rect x="35" y="15" width="30" height="18" rx="5" fill="currentColor"/><rect x="47" y="10" width="6" height="8" fill="currentColor"/><rect x="10" y="38" width="15" height="8" rx="4" fill="currentColor"/><rect x="75" y="38" width="15" height="8" rx="4" fill="currentColor"/><circle cx="38" cy="50" r="6" fill="white"/><circle cx="62" cy="50" r="6" fill="white"/><rect x="35" y="62" width="30" height="5" rx="2" fill="white" opacity="0.5"/></svg>', 12);


-- ── 2. PROFILES ─────────────────────────────────────────────
CREATE TABLE profiles (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                 TEXT,
  display_name          TEXT,
  bio                   TEXT,
  city                  TEXT,
  avatar_id             INT REFERENCES avatars(id),
  avatar_color          TEXT DEFAULT '#c8a96e',
  theme                 TEXT DEFAULT 'dark',
  accent_color          TEXT DEFAULT '#c8a96e',
  collection_visibility TEXT DEFAULT 'friends',  -- 'private'|'friends'|'public'
  is_admin              BOOLEAN DEFAULT false,
  is_active             BOOLEAN DEFAULT true,
  preferences           JSONB DEFAULT '{}',
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  last_seen             TIMESTAMPTZ
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "perfís visibles para usuarios autenticados"
  ON profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "usuario edita o seu perfil"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', NULL))
  ON CONFLICT (id) DO UPDATE SET
    email        = EXCLUDED.email,
    display_name = COALESCE(EXCLUDED.display_name, profiles.display_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ── 3. FRIENDSHIPS ──────────────────────────────────────────
CREATE TABLE friendships (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  addressee   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status      TEXT DEFAULT 'pending',   -- 'pending'|'accepted'|'blocked'
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (requester, addressee)
);

ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ver as miñas amizades"
  ON friendships FOR SELECT USING (auth.uid() = requester OR auth.uid() = addressee);
CREATE POLICY "xestionar as miñas amizades"
  ON friendships FOR ALL USING (auth.uid() = requester OR auth.uid() = addressee);

CREATE INDEX friendships_requester ON friendships(requester);
CREATE INDEX friendships_addressee ON friendships(addressee);


-- ── 4. APP CONFIG ────────────────────────────────────────────
CREATE TABLE app_config (
  key   TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "config visible para todos"    ON app_config FOR SELECT USING (true);
CREATE POLICY "só admin modifica config"     ON app_config FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

INSERT INTO app_config (key, value) VALUES
  ('app_name', '"Xogún"'),
  ('features', '{
    "tools_public": true,
    "catalog_public": true,
    "collections": true,
    "wishlist": true,
    "match_history": true,
    "planned_matches": true,
    "bgg_import": true,
    "game_moderation": true,
    "achievements": true,
    "score_templates": true,
    "playlists": true,
    "friendships": true
  }'),
  ('visible_game_fields', '{
    "description": true,
    "min_players": true, "max_players": true, "recommended_players": true,
    "min_duration": true, "max_duration": true,
    "age": true, "complexity": true,
    "bgg_rating": true, "bgg_id": true,
    "categories": true, "mechanics": true,
    "images": true, "videos": true, "rules_url": true,
    "publisher": true, "designer": true, "artists": true,
    "languages": true
  }'),
  ('tools_enabled', '{
    "dice": true, "scoreboard": true, "timer": true, "turns": true,
    "role_dealer": true, "resource_bank": true, "objective_counter": true,
    "first_player": true, "session_planner": true, "music": true
  }');


-- ── 5. GAME CATEGORIES ──────────────────────────────────────
CREATE TABLE game_categories (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE,
  emoji      TEXT,
  active     BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0
);
ALTER TABLE game_categories DISABLE ROW LEVEL SECURITY;

INSERT INTO game_categories (name, emoji, sort_order) VALUES
  ('Abstracto','⬡',1),('Aventura','⚔️',2),('Cooperativo','🤝',3),
  ('Deducción','🔍',4),('Económico','💰',5),('Estratexia','♟️',6),
  ('Familiar','👨‍👩‍👧',7),('Fantasía','🧙',8),('Ficción científica','🚀',9),
  ('Guerra','🎖️',10),('Historia','🏛️',11),('Horror','👻',12),
  ('Natureza','🌿',13),('Party','🎉',14),('Piratas','🏴‍☠️',15),
  ('Rol','🎭',16),('Trens','🚂',17),('Zombis','🧟',18);


-- ── 6. GAME MECHANICS ───────────────────────────────────────
CREATE TABLE game_mechanics (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE,
  active     BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0
);
ALTER TABLE game_mechanics DISABLE ROW LEVEL SECURITY;

INSERT INTO game_mechanics (name, sort_order) VALUES
  ('Colocación de traballadores',1),('Construción de mazo',2),
  ('Control de territorios',3),('Cooperativo',4),('Dados',5),
  ('Deducción',6),('Draft',7),('Fuga',8),('Xestión de recursos',9),
  ('Movemento en reixa',10),('Programación de ordes',11),
  ('Push your luck',12),('Rol',13),('Ruta/Rede',14),('Subasta',15),
  ('Toma e dá',16),('Trivia',17),('Votación',18),
  ('Xogo de cartas',19),('Xogo de figuras',20);


-- ── 7. GAMES (catálogo global) ───────────────────────────────
CREATE TABLE games (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bgg_id               INTEGER UNIQUE,
  name                 TEXT NOT NULL,
  description          TEXT,
  publisher            TEXT,
  designer             TEXT,
  artists              TEXT,
  year_published       SMALLINT,
  min_players          SMALLINT,
  max_players          SMALLINT,
  recommended_players  TEXT,          -- ex: "3-4" ou "exactamente 4"
  min_duration         SMALLINT,
  max_duration         SMALLINT,
  age                  SMALLINT,
  complexity           NUMERIC(3,1),
  bgg_rating           NUMERIC(4,2),
  languages            TEXT[],        -- ex: ['gl','es','en']
  images               JSONB DEFAULT '[]',    -- [{url, caption}]
  videos               JSONB DEFAULT '[]',    -- [{url, title, type}]
  rules_url            TEXT,
  category_ids         INTEGER[] DEFAULT '{}',
  mechanic_ids         INTEGER[] DEFAULT '{}',
  added_by             UUID REFERENCES profiles(id),
  approved             BOOLEAN DEFAULT false,
  approved_by          UUID REFERENCES profiles(id),
  approved_at          TIMESTAMPTZ,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "xogos aprobados visibles para todos"
  ON games FOR SELECT USING (approved = true OR auth.uid() = added_by);
CREATE POLICY "usuarios autenticados engaden xogos"
  ON games FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "autor ou admin edita xogos"
  ON games FOR UPDATE USING (
    auth.uid() = added_by OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE INDEX games_name_idx    ON games(name);
CREATE INDEX games_bgg_id_idx  ON games(bgg_id);
CREATE INDEX games_approved    ON games(approved);


-- ── 8. GAME EDIT SUGGESTIONS ─────────────────────────────────
CREATE TABLE game_edit_suggestions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id      UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  suggested_by UUID REFERENCES profiles(id),
  field        TEXT NOT NULL,        -- campo que se suxire modificar
  old_value    JSONB,
  new_value    JSONB NOT NULL,
  note         TEXT,                 -- explicación do usuario
  status       TEXT DEFAULT 'pending',  -- 'pending'|'approved'|'rejected'
  reviewed_by  UUID REFERENCES profiles(id),
  review_note  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at  TIMESTAMPTZ
);

ALTER TABLE game_edit_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "usuario ve as súas suxestións"
  ON game_edit_suggestions FOR SELECT USING (
    auth.uid() = suggested_by OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "usuario autenticado suxire edicións"
  ON game_edit_suggestions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "admin revisa suxestións"
  ON game_edit_suggestions FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE INDEX suggestions_game   ON game_edit_suggestions(game_id);
CREATE INDEX suggestions_status ON game_edit_suggestions(status);


-- ── 9. USER GAMES (colección persoal) ───────────────────────
CREATE TABLE user_games (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id         UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'owned',  -- 'owned'|'wishlist'|'played'|'favorite'
  personal_rating SMALLINT CHECK (personal_rating BETWEEN 1 AND 10),
  notes           TEXT,
  times_played    SMALLINT DEFAULT 0,
  acquired_at     DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, game_id)
);

ALTER TABLE user_games ENABLE ROW LEVEL SECURITY;

-- Visibilidade: respecta collection_visibility do perfil
CREATE POLICY "ver coleccións segundo visibilidade"
  ON user_games FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = user_id AND (
        p.collection_visibility = 'public' OR
        (p.collection_visibility = 'friends' AND EXISTS (
          SELECT 1 FROM friendships f WHERE f.status = 'accepted' AND
          ((f.requester = auth.uid() AND f.addressee = user_id) OR
           (f.addressee = auth.uid() AND f.requester = user_id))
        ))
      )
    )
  );
CREATE POLICY "usuario xestiona a súa colección"
  ON user_games FOR ALL USING (auth.uid() = user_id);

-- Vista: puntuación media por xogo
CREATE OR REPLACE FUNCTION xogun_avg_rating(game_uuid UUID)
RETURNS NUMERIC AS $$
  SELECT ROUND(AVG(personal_rating)::NUMERIC, 1)
  FROM user_games
  WHERE game_id = game_uuid AND personal_rating IS NOT NULL;
$$ LANGUAGE SQL STABLE;

CREATE INDEX user_games_user ON user_games(user_id);
CREATE INDEX user_games_game ON user_games(game_id);


-- ── 10. SCORE TEMPLATES ─────────────────────────────────────
CREATE TABLE score_templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id     UUID REFERENCES games(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  description TEXT,
  config      JSONB NOT NULL,
  created_by  UUID REFERENCES profiles(id),
  approved    BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE score_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plantillas aprobadas visibles"
  ON score_templates FOR SELECT USING (approved = true OR auth.uid() = created_by);
CREATE POLICY "usuarios crean plantillas"
  ON score_templates FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "autor ou admin edita plantilla"
  ON score_templates FOR UPDATE USING (
    auth.uid() = created_by OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );


-- ── 11. MATCHES ─────────────────────────────────────────────
CREATE TABLE matches (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id       UUID REFERENCES games(id) ON DELETE SET NULL,
  game_name     TEXT,
  created_by    UUID REFERENCES profiles(id),
  status        TEXT DEFAULT 'planned',  -- 'planned'|'active'|'finished'
  is_public     BOOLEAN DEFAULT false,
  planned_at    TIMESTAMPTZ,
  started_at    TIMESTAMPTZ,
  finished_at   TIMESTAMPTZ,
  duration_mins SMALLINT,
  scores        JSONB DEFAULT '{}',
  template_id   UUID REFERENCES score_templates(id),
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "partidas públicas ou propias"
  ON matches FOR SELECT USING (is_public = true OR auth.uid() = created_by);
CREATE POLICY "usuario crea e edita as súas partidas"
  ON matches FOR ALL USING (auth.uid() = created_by);

CREATE INDEX matches_created_by ON matches(created_by);
CREATE INDEX matches_game_id    ON matches(game_id);
CREATE INDEX matches_status     ON matches(status);


-- ── 12. MATCH PLAYERS ───────────────────────────────────────
CREATE TABLE match_players (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id     UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  guest_name   TEXT,
  player_color TEXT DEFAULT '#c8a96e',
  score        JSONB DEFAULT '{}',
  winner       BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE match_players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "xogadores visibles coa partida"
  ON match_players FOR SELECT USING (
    EXISTS (SELECT 1 FROM matches m WHERE m.id = match_id AND
      (m.is_public = true OR m.created_by = auth.uid()))
  );
CREATE POLICY "creador xestiona xogadores"
  ON match_players FOR ALL USING (
    EXISTS (SELECT 1 FROM matches m WHERE m.id = match_id AND m.created_by = auth.uid())
  );

CREATE INDEX match_players_match ON match_players(match_id);
CREATE INDEX match_players_user  ON match_players(user_id);


-- ── 13. PLAYLISTS ───────────────────────────────────────────
CREATE TABLE playlists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  game_id     UUID REFERENCES games(id) ON DELETE SET NULL,
  created_by  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_public   BOOLEAN DEFAULT false,
  approved    BOOLEAN DEFAULT false,
  cover_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "playlists públicas aprobadas ou propias"
  ON playlists FOR SELECT USING (
    (is_public = true AND approved = true) OR auth.uid() = created_by
  );
CREATE POLICY "usuario xestiona as súas playlists"
  ON playlists FOR ALL USING (auth.uid() = created_by);

CREATE INDEX playlists_created_by ON playlists(created_by);
CREATE INDEX playlists_game_id    ON playlists(game_id);


-- ── 14. PLAYLIST TRACKS ─────────────────────────────────────
CREATE TABLE playlist_tracks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  youtube_url TEXT NOT NULL,
  title       TEXT,
  duration    INT,              -- en segundos
  sort_order  INT DEFAULT 0,
  added_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE playlist_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tracks visibles coa playlist"
  ON playlist_tracks FOR SELECT USING (
    EXISTS (SELECT 1 FROM playlists p WHERE p.id = playlist_id AND
      ((p.is_public AND p.approved) OR p.created_by = auth.uid()))
  );
CREATE POLICY "propietario da playlist xestiona tracks"
  ON playlist_tracks FOR ALL USING (
    EXISTS (SELECT 1 FROM playlists p WHERE p.id = playlist_id AND p.created_by = auth.uid())
  );

CREATE INDEX tracks_playlist ON playlist_tracks(playlist_id);


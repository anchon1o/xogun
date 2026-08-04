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
('Dragón',    '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="m 29.329184,91.109337 c -1.88821,-1.90077 -2.86577,-3.241951 -3.77335,-5.176929 -0.9407,-2.005573 -1.23028,-3.386016 -1.22065,-5.8188 0.007,-1.728717 0.0615,-2.228675 0.37423,-3.420894 0.46941,-1.789733 1.73389,-4.361927 2.95157,-6.004017 1.42542,-1.922238 4.00438,-4.499348 6.68014,-6.675352 3.89216,-3.165203 5.44235,-4.943463 6.04851,-6.938409 0.47443,-1.561393 0.15836,-3.85064 -0.61667,-4.466335 -0.25221,-0.200361 -0.56157,-0.281027 -1.07777,-0.281027 -0.76322,0 -3.3447,0.600283 -3.57299,0.830846 -0.0864,0.08728 -0.009,0.325515 0.21741,0.671475 0.41321,0.630623 0.99743,1.78152 1.13987,2.245514 0.094,0.306283 0.0537,0.295101 -0.6388,-0.17694 -2.69633,-1.838064 -7.72754,-2.397221 -11.79944,-1.311363 -2.13308,0.568833 -5.46101,2.299947 -5.46101,2.840696 0,0.105487 0.21775,0.799317 0.48389,1.541846 0.26613,0.742528 0.48388,1.401804 0.48388,1.465057 0,0.122768 -0.99666,-0.285529 -3.66371,-1.500887 -0.91248,-0.415809 -1.71451,-0.768538 -1.78229,-0.783843 -0.0678,-0.0153 -0.25138,0.188095 -0.40798,0.451998 -0.21224,0.357658 -0.29956,0.793149 -0.34299,1.710447 -0.032,0.676843 -0.11891,1.230622 -0.19304,1.230622 -0.23281,0 -2.0385,-1.844326 -2.73407,-2.792566 -1.5093796,-2.057685 -2.1343696,-3.890596 -2.0472796,-6.004017 0.0636,-1.542943 0.33117,-2.200538 1.57663,-3.874686 0.7955896,-1.069437 1.0230196,-1.221065 1.0230196,-0.682065 0,0.374697 0.48448,1.066043 0.74706,1.066043 0.0957,0 0.94661,-0.551044 1.89095,-1.224542 0.94433,-0.673498 2.10594,-1.474616 2.58133,-1.780261 0.79725,-0.512568 0.85917,-0.588244 0.79753,-0.974604 -0.21453,-1.344608 -0.23147,-1.885588 -0.0741,-2.367039 0.29969,-0.917097 2.12312,-2.9379 7.9434,-8.803226 3.12444,-3.148618 6.07934,-6.227422 6.56643,-6.841787 1.52894,-1.928408 2.7635,-4.00878 3.62361,-6.106144 0.1716,-0.418437 0.19036,-0.290456 0.22563,1.539072 0.0312,1.616258 -0.0147,2.221416 -0.24114,3.184501 -0.36414,1.548455 -0.96443,2.986859 -1.74729,4.186773 -0.34654,0.531169 -0.66702,1.024695 -0.71217,1.096724 -0.13857,0.221061 1.17729,-0.772003 2.51114,-1.895134 3.93244,-3.311189 6.56987,-7.193289 8.25171,-12.145883 0.24456,-0.720188 0.49011,-1.361876 0.54565,-1.425977 0.2151,-0.24822 0.47826,2.431424 0.47082,4.794095 -0.009,2.81936 -0.24254,4.410663 -0.96643,6.581566 -0.45863,1.375431 -1.2297,2.970284 -1.98001,4.09542 -0.20653,0.309701 -0.42481,0.644195 -0.48506,0.74332 -0.0602,0.09913 0.28452,-0.06138 0.76617,-0.356674 3.36423,-2.062578 7.57749,-3.784973 10.13871,-4.144743 l 0.69127,-0.0971 -0.63895,0.414437 c -0.86477,0.560912 -2.49453,2.131419 -3.24222,3.12434 -0.33664,0.44705 -0.61193,0.827825 -0.61177,0.846167 1.4e-4,0.01834 1.10447,0.03984 2.454,0.04779 3.54276,0.02085 7.21071,0.670332 10.26159,1.817025 l 1.03346,0.388435 -1.24084,0.179713 c -1.62281,0.235033 -3.36015,0.743744 -4.82986,1.414233 l -1.18514,0.540664 0.93541,0.39303 c 2.50064,1.050686 5.15081,2.977529 7.4034,5.382732 0.8131,0.868179 1.46326,1.593751 1.44481,1.612383 -0.0185,0.01863 -0.52758,-0.08499 -1.13139,-0.230284 -0.60382,-0.145289 -1.81673,-0.307 -2.69535,-0.359356 l -1.59749,-0.09519 0.56407,0.620771 c 1.80211,1.983244 3.69679,5.898961 3.36822,6.961041 -0.0595,0.192401 -0.30927,1.03755 -0.55499,1.87811 -1.52509,5.217071 -4.14528,9.844384 -8.02927,14.179894 -1.02463,1.143742 -2.52672,2.59005 -3.14783,3.030933 -0.0317,0.02249 -0.0306,0.06816 0.002,0.101486 0.15182,0.153329 3.39814,-2.503117 4.83572,-3.957037 2.42287,-2.450415 4.02139,-4.620688 5.56326,-7.55308 2.32741,-4.426397 3.46132,-9.039794 3.43187,-13.962831 -0.0338,-5.648665 -1.22604,-10.741955 -3.68981,-15.763015 -2.54,-5.176401 -5.65869,-8.829058 -10.29322,-12.0556 -3.30666,-2.302083 -7.52089,-3.995099 -11.68242,-4.693267 l -1.52079,-0.25514 0.55302,-0.165921 c 0.30416,-0.09126 1.26847,-0.300532 2.14293,-0.465056 1.35142,-0.254263 2.12911,-0.300799 5.1845,-0.310222 3.75561,-0.01159 4.75868,0.07645 7.96456,0.699029 7.17745,1.393851 14.66524,4.933655 20.65391,9.764008 2.91187,2.348662 6.71873,6.441793 9.02273,9.701227 2.78505,3.939979 5.42729,9.492906 6.57747,13.823203 0.72653,2.735277 1.30857,6.74078 1.17583,8.091829 -0.0458,0.466609 -0.066,0.444196 -0.62902,-0.698141 -0.31991,-0.649125 -0.84781,-1.588641 -1.17311,-2.087812 -0.60509,-0.928521 -2.45032,-2.932195 -2.70032,-2.932195 -0.0898,0 -0.13332,1.246581 -0.12309,3.525615 0.0176,3.915344 -0.12156,5.503072 -0.76088,8.683627 -0.73626,3.662842 -1.74373,6.676537 -3.37645,10.100122 -1.97534,4.142005 -3.88634,6.98752 -6.73097,10.022562 -1.53049,1.632933 -1.7726,1.741693 -1.16569,0.523646 1.12785,-2.263552 1.83093,-5.213894 1.70828,-7.16846 -0.13901,-2.215297 -0.66943,-2.888345 -2.1681,-2.751101 -1.38711,0.12703 -3.17333,1.168257 -7.12237,4.151766 -7.29742,5.513232 -14.08098,8.91157 -23.25582,11.650409 -4.93231,1.472373 -6.99165,2.30009 -9.02065,3.625692 -1.68926,1.103646 -3.18554,2.729567 -3.18554,3.461545 0,0.138556 -0.061,0.25192 -0.13561,0.25192 -0.0746,0 -0.90023,-0.769701 -1.83476,-1.710447 z m 15.77,-39.919686 c -0.43124,-0.781034 -2.08774,-2.557564 -2.89969,-3.109798 l -0.65823,-0.447687 0.89007,-0.591009 c 1.32788,-0.881711 2.85895,-1.543277 4.55688,-1.968995 l 1.51769,-0.380525 -0.54991,-0.342824 c -0.7789,-0.48558 -2.07465,-1.045107 -3.0412,-1.313245 -1.13881,-0.315927 -3.47306,-0.42099 -4.64678,-0.209151 -1.0959,0.197798 -1.25062,0.423933 -0.29306,0.428338 1.17022,0.0054 4.87344,0.969186 4.87344,1.268361 0,0.05649 -0.2022,0.146075 -0.44933,0.199074 -1.29153,0.276981 -4.25455,2.282936 -5.17504,3.503491 l -0.32884,0.436028 1.21387,0.38007 c 1.55571,0.487103 3.50446,1.428631 4.46391,2.15672 0.41353,0.313809 0.77308,0.570562 0.799,0.570562 0.0259,0 -0.0968,-0.260735 -0.27278,-0.57941 z m -18.91501,-6.27537 c 0.92825,-0.31582 1.81665,-1.413213 2.50106,-3.089448 0.2244,-0.549576 0.39044,-1.052418 0.36898,-1.117427 -0.0627,-0.190062 -6.46463,4.234034 -6.46463,4.467445 0,0.133215 3.09704,-0.09129 3.59459,-0.26057 z m 14.81261,-4.667604 c 1.62013,-1.901627 4.02198,-3.994638 5.76295,-5.021926 0.48094,-0.283788 0.85422,-0.529774 0.82952,-0.546638 -0.0247,-0.01686 -0.82259,0.01373 -1.77309,0.06798 -3.03645,0.173322 -5.65983,1.048202 -8.17341,2.725778 -1.36327,0.909854 -1.3842,1.048642 -0.0879,0.582896 1.15617,-0.415401 4.64817,-1.365566 5.01866,-1.365566 0.12054,0 -0.15586,0.45677 -0.68651,1.134533 -0.49542,0.632761 -1.2624,1.883275 -1.73417,2.827473 -0.46523,0.931117 -0.73446,1.536508 -0.59828,1.345314 0.13618,-0.191195 0.78519,-0.978626 1.44224,-1.749846 z"/></svg>', 9),
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
  notifications_enabled BOOLEAN DEFAULT true,
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
  ('maintenance_mode', 'false'),
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
    "first_player": true, "session_planner": true, "music": true,
    "match_notes": true, "team_generator": true, "soundboard": true, "character_sheet": true, "social_game_launcher": true
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
  visibility      TEXT DEFAULT 'friends',         -- 'private'|'friends'|'public' — visibilidade DESTA entrada
  personal_rating SMALLINT CHECK (personal_rating BETWEEN 1 AND 10),
  notes           TEXT,
  times_played    SMALLINT DEFAULT 0,
  acquired_at     DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, game_id)
);

ALTER TABLE user_games ENABLE ROW LEVEL SECURITY;

-- Visibilidade por entrada: cada estado (Teño/Quero ter/...) pode ter
-- a súa propia visibilidade, en vez de depender dun único axuste global.
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


-- ── 9b. GAME LISTS (listas personalizadas, ex: "Excursión agosto") ──
-- Referencian xogos do catálogo sen duplicar datos — só agrupan.
CREATE TABLE game_lists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  emoji       TEXT DEFAULT '📋',
  visibility  TEXT DEFAULT 'private',  -- 'private'|'friends'|'public'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE game_lists ENABLE ROW LEVEL SECURITY;

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
CREATE POLICY "usuario xestiona as súas listas"
  ON game_lists FOR ALL USING (auth.uid() = user_id);

CREATE INDEX game_lists_user ON game_lists(user_id);


-- ── 9c. GAME LIST ITEMS (elementos dentro de cada lista) ──
CREATE TABLE game_list_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id    UUID NOT NULL REFERENCES game_lists(id) ON DELETE CASCADE,
  game_id    UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  note       TEXT,
  sort_order INT DEFAULT 0,
  added_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (list_id, game_id)
);

ALTER TABLE game_list_items ENABLE ROW LEVEL SECURITY;

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
CREATE POLICY "propietario da lista xestiona elementos"
  ON game_list_items FOR ALL USING (
    EXISTS (SELECT 1 FROM game_lists l WHERE l.id = list_id AND l.user_id = auth.uid())
  );

CREATE INDEX list_items_list ON game_list_items(list_id);
CREATE INDEX list_items_game ON game_list_items(game_id);


-- ── 9d. NOTIFICATIONS (internas, opt-in) ────────────────────
CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,     -- 'friend_request'|'friend_accepted'|'suggestion_approved'|'preset_approved'|'game_approved'
  title      TEXT NOT NULL,
  body       TEXT,
  link       TEXT,              -- ruta interna á que navegar ao premer (ex: '/amigos')
  read       BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "usuario ve as súas notificacións"
  ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "usuario xestiona as súas notificacións"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "usuario elimina as súas notificacións"
  ON notifications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "sistema crea notificacións"
  ON notifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE INDEX notifications_user ON notifications(user_id, read);


-- ── 9e. CHALLENGES (retos entre amigos) ─────────────────────
-- Resólvense manualmente (completado/fallado) — o obxectivo é texto libre
-- ("gaña unha partida de Catán antes de fin de mes"), así que non se
-- intenta detectar automaticamente contra o historial de partidas.
CREATE TABLE challenges (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  to_user      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id      UUID REFERENCES games(id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  deadline     DATE,
  status       TEXT DEFAULT 'pending',  -- 'pending'|'accepted'|'completed'|'failed'|'declined'
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  resolved_at  TIMESTAMPTZ
);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ver os meus retos"
  ON challenges FOR SELECT USING (auth.uid() = from_user OR auth.uid() = to_user);
CREATE POLICY "crear retos"
  ON challenges FOR INSERT WITH CHECK (auth.uid() = from_user);
CREATE POLICY "xestionar os meus retos"
  ON challenges FOR UPDATE USING (auth.uid() = from_user OR auth.uid() = to_user);
CREATE POLICY "eliminar retos propios"
  ON challenges FOR DELETE USING (auth.uid() = from_user);

CREATE INDEX challenges_from ON challenges(from_user);
CREATE INDEX challenges_to   ON challenges(to_user);


-- ── 9f. SESSION INVITES (RSVP para partidas planificadas) ───
-- Reutiliza a táboa matches (status='planned') como "sesión de calendario";
-- esta táboa só engade a quen se invitou e se vai/non vai.
CREATE TABLE session_invites (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id   UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rsvp       TEXT DEFAULT 'pending',  -- 'pending'|'going'|'not_going'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (match_id, user_id)
);

ALTER TABLE session_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ver invitacións propias ou da partida creada"
  ON session_invites FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM matches m WHERE m.id = match_id AND m.created_by = auth.uid())
  );
CREATE POLICY "creador da partida invita"
  ON session_invites FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM matches m WHERE m.id = match_id AND m.created_by = auth.uid())
  );
CREATE POLICY "usuario actualiza o seu propio rsvp"
  ON session_invites FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "creador elimina invitacións"
  ON session_invites FOR DELETE USING (
    EXISTS (SELECT 1 FROM matches m WHERE m.id = match_id AND m.created_by = auth.uid())
  );

CREATE INDEX session_invites_match ON session_invites(match_id);
CREATE INDEX session_invites_user  ON session_invites(user_id);


-- ── 9g. ACTIVITY LOG (rexistro de accións de moderación) ────
-- Só visible para admins. Escríbese dende as accións de aprobar/rexeitar
-- xa existentes (xogos, suxestións, presets), sen necesidade dun sistema
-- de auditoría xenérico máis complexo.
CREATE TABLE activity_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,   -- 'game_approved'|'game_rejected'|'suggestion_approved'|'suggestion_rejected'|'preset_approved'|'preset_rejected'|'user_created'|'user_deleted'|...
  target_type TEXT,            -- 'game'|'suggestion'|'preset'|'user'
  target_name TEXT,            -- descrición lexible do obxecto afectado
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "só admins ven o rexistro"
  ON activity_log FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "admins escriben no rexistro"
  ON activity_log FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE INDEX activity_log_created ON activity_log(created_at DESC);


-- ── 9h. CHARACTER SHEET TEMPLATES (deseño da folla por sistema de xogo) ──
-- O deseño defínese como unha lista de campos (config JSONB), similar ao
-- enfoque xa usado en score_templates, para reutilizar o mesmo patrón.
CREATE TABLE character_sheet_templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id     UUID REFERENCES games(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,        -- ex: "D&D 5e", "Vampiro: A Mascarada"
  theme       TEXT DEFAULT 'fantasy', -- 'fantasy'|'scifi'|'horror'|'modern' — só para estética
  config      JSONB NOT NULL,        -- { fields: [...], stats: [...] }
  created_by  UUID REFERENCES profiles(id),
  approved    BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE character_sheet_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plantillas de personaxe aprobadas visibles"
  ON character_sheet_templates FOR SELECT USING (approved = true OR auth.uid() = created_by);
CREATE POLICY "usuarios crean plantillas de personaxe"
  ON character_sheet_templates FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "creador/admin xestiona plantillas de personaxe"
  ON character_sheet_templates FOR UPDATE USING (
    auth.uid() = created_by OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
CREATE POLICY "creador/admin elimina plantillas de personaxe"
  ON character_sheet_templates FOR DELETE USING (
    auth.uid() = created_by OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );


-- ── 9i. CHARACTERS (personaxes concretos, rechables por partida) ────
CREATE TABLE characters (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id  UUID REFERENCES character_sheet_templates(id) ON DELETE SET NULL,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  avatar_url   TEXT,
  data         JSONB DEFAULT '{}',   -- valores dos campos definidos na plantilla
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "usuario xestiona os seus personaxes"
  ON characters FOR ALL USING (auth.uid() = user_id);

CREATE INDEX characters_user ON characters(user_id);


-- ── 9j. SOCIAL GAMES (reparto secreto multidispositivo: Lobo, Mafia...) ──
-- Cada xogador reclama a súa praza dende o SEU propio móbil e o rol
-- gárdase nunha táboa separada e illada por RLS, de xeito que nin sequera
-- o anfitrión pode ver os roles despois de repartilos — só quen os reclamou.
CREATE TABLE social_games (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT UNIQUE NOT NULL,
  name        TEXT,
  preset      TEXT DEFAULT 'custom',
  role_pool   JSONB NOT NULL DEFAULT '[]',   -- array de nomes de rol, ex: ["Lobo","Lobo","Aldeán",...]
  status      TEXT DEFAULT 'lobby',           -- 'lobby'|'dealt'|'finished'
  created_by  UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE social_games ENABLE ROW LEVEL SECURITY;
-- Nota de deseño: a busca por código require que calquera usuario autenticado
-- poida ler a fila da partida (o código en si é o control de acceso, como un
-- PIN de sala). O contido exposto (nome, preset, lista de roles posibles) non
-- é sensible — o que si está estritamente illado son os roles xa asignados
-- (táboa social_game_roles, máis abaixo).
CREATE POLICY "calquera autenticado busca partidas por código"
  ON social_games FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "crear partida propia"
  ON social_games FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "anfitrión actualiza a súa partida"
  ON social_games FOR UPDATE USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "anfitrión elimina a súa partida"
  ON social_games FOR DELETE USING (auth.uid() = created_by);

CREATE INDEX social_games_code ON social_games(code);


CREATE TABLE social_game_players (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id     UUID NOT NULL REFERENCES social_games(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  claimed_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  eliminated  BOOLEAN DEFAULT false,
  seat_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE social_game_players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ver prazas de xogadores"
  ON social_game_players FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "anfitrión crea prazas"
  ON social_game_players FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM social_games g WHERE g.id = game_id AND g.created_by = auth.uid())
  );
CREATE POLICY "reclamar praza libre ou anfitrión xestiona"
  ON social_game_players FOR UPDATE USING (
    claimed_by IS NULL OR claimed_by = auth.uid() OR
    EXISTS (SELECT 1 FROM social_games g WHERE g.id = game_id AND g.created_by = auth.uid())
  ) WITH CHECK (
    claimed_by = auth.uid() OR claimed_by IS NULL OR
    EXISTS (SELECT 1 FROM social_games g WHERE g.id = game_id AND g.created_by = auth.uid())
  );
CREATE POLICY "anfitrión elimina prazas"
  ON social_game_players FOR DELETE USING (
    EXISTS (SELECT 1 FROM social_games g WHERE g.id = game_id AND g.created_by = auth.uid())
  );

-- Un mesmo usuario non pode reclamar dúas prazas na mesma partida
CREATE UNIQUE INDEX social_players_one_slot ON social_game_players(game_id, claimed_by) WHERE claimed_by IS NOT NULL;
CREATE INDEX social_game_players_game ON social_game_players(game_id);


CREATE TABLE social_game_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id     UUID NOT NULL REFERENCES social_games(id) ON DELETE CASCADE,
  player_id   UUID NOT NULL UNIQUE REFERENCES social_game_players(id) ON DELETE CASCADE,
  role_name   TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE social_game_roles ENABLE ROW LEVEL SECURITY;
-- Illamento estrito: só quen reclamou esa praza pode ver o seu propio rol.
CREATE POLICY "só o propio xogador ve o seu rol"
  ON social_game_roles FOR SELECT USING (
    EXISTS (SELECT 1 FROM social_game_players p WHERE p.id = player_id AND p.claimed_by = auth.uid())
  );
CREATE POLICY "anfitrión crea roles ao repartir"
  ON social_game_roles FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM social_games g WHERE g.id = game_id AND g.created_by = auth.uid())
  );
CREATE POLICY "anfitrión pode repartir de novo"
  ON social_game_roles FOR DELETE USING (
    EXISTS (SELECT 1 FROM social_games g WHERE g.id = game_id AND g.created_by = auth.uid())
  );

CREATE INDEX social_game_roles_game ON social_game_roles(game_id);

-- Fase de xogo (día/noite/votación) e temporizador compartido entre dispositivos
ALTER TABLE social_games ADD COLUMN phase TEXT DEFAULT 'none';           -- 'none'|'day'|'night'|'voting'|'results'
ALTER TABLE social_games ADD COLUMN phase_ends_at TIMESTAMPTZ;            -- fin previsto da fase (cada móbil calcula o restante)
ALTER TABLE social_games ADD COLUMN voting_round INT DEFAULT 0;


-- ── 9k. SOCIAL GAME VOTES (votación secreta, reconto público) ──
-- Ninguén (nin sequera outros xogadores) pode ver por quen votou outra
-- persoa — só o propio anfitrión (para resolver empates) e cada un o seu
-- propio voto. O reconto agregado sérvese a través dunha función SQL
-- (social_vote_tally) que devolve só totais, nunca identidades.
CREATE TABLE social_game_votes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id           UUID NOT NULL REFERENCES social_games(id) ON DELETE CASCADE,
  voter_player_id   UUID NOT NULL REFERENCES social_game_players(id) ON DELETE CASCADE,
  target_player_id  UUID REFERENCES social_game_players(id) ON DELETE CASCADE, -- NULL = voto en branco
  round             INT NOT NULL DEFAULT 1,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (game_id, voter_player_id, round)
);

ALTER TABLE social_game_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ver só o propio voto ou anfitrión ve todos"
  ON social_game_votes FOR SELECT USING (
    EXISTS (SELECT 1 FROM social_game_players p WHERE p.id = voter_player_id AND p.claimed_by = auth.uid())
    OR EXISTS (SELECT 1 FROM social_games g WHERE g.id = game_id AND g.created_by = auth.uid())
  );
CREATE POLICY "votar como un mesmo"
  ON social_game_votes FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM social_game_players p WHERE p.id = voter_player_id AND p.claimed_by = auth.uid())
  );
CREATE POLICY "cambiar o propio voto"
  ON social_game_votes FOR UPDATE USING (
    EXISTS (SELECT 1 FROM social_game_players p WHERE p.id = voter_player_id AND p.claimed_by = auth.uid())
  );
CREATE POLICY "anfitrión limpa votos ao abrir nova rolda"
  ON social_game_votes FOR DELETE USING (
    EXISTS (SELECT 1 FROM social_games g WHERE g.id = game_id AND g.created_by = auth.uid())
  );

CREATE INDEX social_game_votes_game ON social_game_votes(game_id, round);

-- Función de reconto: devolve só totais por xogador obxectivo, nunca quen votou.
-- SECURITY DEFINER porque necesita ler todas as filas de votos para sumalas,
-- mesmo cando quen chama só ten permiso RLS para ver o seu propio voto.
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
  source_type TEXT DEFAULT 'youtube',  -- 'youtube'|'spotify'|'embed'
  embed_url   TEXT,                     -- URL embebible completa para spotify/embed (iframe src)
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


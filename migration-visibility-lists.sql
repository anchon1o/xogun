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

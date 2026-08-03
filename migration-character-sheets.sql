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

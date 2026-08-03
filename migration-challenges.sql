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

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

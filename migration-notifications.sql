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

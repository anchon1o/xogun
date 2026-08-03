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

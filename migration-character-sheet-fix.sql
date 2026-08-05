-- ============================================================
-- XŌGUN — Migración: arranxo do bug de follas de personaxe
-- (as plantillas incorporadas non gardaban cal se elixira, así que
-- sempre se amosaba a folla de D&D 5e independentemente da escollida)
-- ============================================================

ALTER TABLE characters ADD COLUMN IF NOT EXISTS builtin_template_id TEXT;

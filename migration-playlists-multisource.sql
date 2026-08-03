-- ============================================================
-- XOGÚN — Migración: playlists multi-fonte (Spotify, embeds)
-- Executar sobre unha base de datos xa existente
-- ============================================================

ALTER TABLE playlists ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'youtube';
ALTER TABLE playlists ADD COLUMN IF NOT EXISTS embed_url TEXT;

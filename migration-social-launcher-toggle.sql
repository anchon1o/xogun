-- ============================================================
-- XOGÚN — Migración: activar acceso rápido "Xogo social" en Ferramentas
-- ============================================================

UPDATE app_config
SET value = value || '{"social_game_launcher": true}'::jsonb
WHERE key = 'tools_enabled';

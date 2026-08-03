-- ============================================================
-- XOGÚN — Migración: activar ferramenta "Botonera de sons"
-- ============================================================

UPDATE app_config
SET value = value || '{"soundboard": true}'::jsonb
WHERE key = 'tools_enabled';

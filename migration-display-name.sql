-- ============================================================
-- XŌGUN — Migración: nome visible estilizado "Xōgun"
-- (Só afecta ao texto amosado na interface — identificadores internos,
-- nomes de arquivo, clases CSS e o nome do paquete seguen sendo "xogun".)
-- ============================================================

UPDATE app_config
SET value = '"Xōgun"'::jsonb
WHERE key = 'app_name';
